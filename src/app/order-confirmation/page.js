"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [order, setOrder] = useState(null);
  useEffect(() => {
    if (id)
      fetch(`/api/orders/${id}`)
        .then((r) => r.json())
        .then((d) => setOrder(d.order));
  }, [id]);
  return (
    <div className="confirm-wrap">
      <div className="confirm-check">✓</div>
      <h1>Thank You</h1>
      <p>
        Your order has been placed successfully. We&apos;ll send you a
        confirmation email shortly.
      </p>
      {order && (
        <div className="confirm-details">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontSize: ".65rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "var(--taupe)",
              }}
            >
              Order #{order.id}
            </span>
            <span style={{ fontFamily: "var(--serif)", fontSize: "1.1rem" }}>
              ₹{order.total?.toLocaleString("en-IN")}
            </span>
          </div>
          {order.items?.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: ".5rem 0",
                borderTop: "1px solid rgba(158,139,124,.15)",
                fontSize: ".82rem",
                color: "var(--taupe)",
              }}
            >
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Link href="/products" className="btn-primary">
          Continue Shopping
        </Link>
        <Link href="/orders" className="btn-ghost">
          View Orders
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="confirm-wrap">
          <h1>Loading...</h1>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
