"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useToast } from "@/context/ToastContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { showToast } = useToast();
  const hasRecovered = useRef(false);

  useEffect(() => {
    if (hasRecovered.current) return;
    const saved = localStorage.getItem("aura-cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setCart(parsed);
          setTimeout(() => {
            showToast("Welcome back, patron. We preserved your bag.");
          }, 1500);
        }
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    hasRecovered.current = true;
  }, [showToast]);

  useEffect(() => {
    localStorage.setItem("aura-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    (product, size = "", color = "", quantity = 1) => {
      setCart((prev) => {
        const key = `${product.id || product.slug}-${size}-${color}`;
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [
          ...prev,
          {
            key,
            product_id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: (() => {
              if (!product.images) return "";
              if (Array.isArray(product.images)) return product.images[0] || "";
              if (typeof product.images === "object") {
                const colorImages =
                  product.images[color] ||
                  Object.values(product.images)[0] ||
                  [];
                return colorImages[0] || "";
              }
              return "";
            })(),
            material: product.material,
            size,
            color,
            quantity,
          },
        ];
      });
      setIsDrawerOpen(true);
    },
    [],
  );

  const removeFromCart = useCallback((key) => {
    setCart((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback(
    (key, quantity) => {
      if (quantity <= 0) {
        removeFromCart(key);
        return;
      }
      setCart((prev) =>
        prev.map((i) => (i.key === key ? { ...i, quantity } : i)),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 4999 ? 0 : cart.length > 0 ? 299 : 0;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        total,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
