import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  const payload = await getUserFromRequest(request);
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const orders = db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC")
    .all(payload.id);
  for (const order of orders) {
    order.items = db
      .prepare("SELECT * FROM order_items WHERE order_id = ?")
      .all(order.id);
  }
  return NextResponse.json({ orders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, shipping, payment_method, email, promo_code } = body;
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const payload = await getUserFromRequest(request);
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in to complete checkout" },
        { status: 401 },
      );
    }
    const db = getDb();

    // Define the transactional order placement operation
    const placeOrderTransaction = db.transaction(
      (
        payloadId,
        shippingData,
        customerEmail,
        paymentMethod,
        cartItems,
        promoCode,
      ) => {
        let subtotal = 0;
        const enrichedItems = [];

        const getProduct = db.prepare("SELECT * FROM products WHERE id = ?");
        const updateStock = db.prepare(
          "UPDATE products SET in_stock = MAX(0, in_stock - ?) WHERE id = ?",
        );

        for (const item of cartItems) {
          const product = getProduct.get(item.product_id);
          if (!product) {
            throw new Error(`Product with ID ${item.product_id} not found`);
          }
          if (product.in_stock <= 0 || product.in_stock < item.quantity) {
            throw new Error(`Product "${product.name}" is out of stock`);
          }

          // Decrement product stock in SQLite
          updateStock.run(item.quantity, item.product_id);

          // Fetch primary image securely from product json array
          let firstImage = "";
          try {
            const parsed = JSON.parse(product.images || "[]");
            firstImage = parsed[0] || "";
          } catch (e) {}

          subtotal += product.price * item.quantity;
          enrichedItems.push({
            product_id: product.id,
            name: product.name,
            image: firstImage,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: product.price,
          });
        }

        // Apply promo discount verification
        let discountMultiplier = 1.0;
        if (promoCode === "AERE10") discountMultiplier = 0.9;
        else if (promoCode === "ATELIER20") discountMultiplier = 0.8;
        else if (promoCode === "VIP50") discountMultiplier = 0.5;

        const finalSubtotal = subtotal * discountMultiplier;
        const shippingCost = finalSubtotal >= 4999 ? 0 : 299;
        const total = finalSubtotal + shippingCost;

        const finalPaymentMethod = promoCode
          ? `${paymentMethod} (${promoCode})`
          : paymentMethod;

        const result = db
          .prepare(
            `
        INSERT INTO orders (
          user_id, subtotal, shipping, total, 
          shipping_name, shipping_email, shipping_phone, 
          shipping_address, shipping_city, shipping_state, 
          shipping_pincode, payment_method
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
          )
          .run(
            payloadId,
            finalSubtotal,
            shippingCost,
            total,
            shippingData?.name || "",
            customerEmail || shippingData?.email || "",
            shippingData?.phone || "",
            shippingData?.address || "",
            shippingData?.city || "",
            shippingData?.state || "",
            shippingData?.pincode || "",
            finalPaymentMethod || "card",
          );
        const orderId = result.lastInsertRowid;

        const insertItem = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_image, 
          size, color, quantity, price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

        for (const enriched of enrichedItems) {
          insertItem.run(
            orderId,
            enriched.product_id,
            enriched.name,
            enriched.image,
            enriched.size || "",
            enriched.color || "",
            enriched.quantity,
            enriched.price,
          );
        }

        return orderId;
      },
    );

    // Execute the transaction atomically
    const orderId = placeOrderTransaction(
      payload.id,
      shipping,
      email,
      payment_method,
      items,
      promo_code,
    );

    // Fetch the completed order to return
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
    order.items = db
      .prepare("SELECT * FROM order_items WHERE order_id = ?")
      .all(order.id);

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 400 },
    );
  }
}
