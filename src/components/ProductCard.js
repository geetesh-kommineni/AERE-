"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";

export default function ProductCard({ product, delay = 0 }) {
  const ref = useRef(null);
  const [hoverColor, setHoverColor] = useState(null);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const wishlisted = isWishlisted(product.id);

  let colorsList = [];
  try {
    colorsList =
      typeof product.colors === "string"
        ? JSON.parse(product.colors)
        : product.colors || [];
  } catch (e) {
    colorsList = [];
  }

  let sizesList = [];
  try {
    sizesList =
      typeof product.sizes === "string"
        ? JSON.parse(product.sizes)
        : product.sizes || [];
  } catch (e) {
    sizesList = [];
  }

  const getProductImage = (index) => {
    if (!product || !product.images) return "";
    let rawUrl = "";
    let parsedImages = product.images;
    if (typeof product.images === "string") {
      try {
        parsedImages = JSON.parse(product.images);
      } catch (e) {
        parsedImages = [];
      }
    }

    if (Array.isArray(parsedImages)) {
      let activeIndex = index;
      if (hoverColor && colorsList.length > 1) {
        const colorIndex = colorsList.findIndex((c) => c.name === hoverColor);
        if (colorIndex !== -1 && colorIndex < parsedImages.length) {
          activeIndex = (colorIndex + index) % parsedImages.length;
        }
      }
      rawUrl = parsedImages[activeIndex] || "";
    } else if (typeof parsedImages === "object" && parsedImages !== null) {
      const activeColorKey = hoverColor || Object.keys(parsedImages)[0];
      const imagesForColor = parsedImages[activeColorKey] || [];
      rawUrl = imagesForColor[index] || imagesForColor[0] || "";
    }

    // Dynamically upgrade Unsplash images to ultra-high-definition (retina-ready w=2048, q=100)
    if (rawUrl && rawUrl.includes("unsplash.com")) {
      try {
        const url = new URL(rawUrl);
        url.searchParams.set("w", "2048");
        url.searchParams.set("q", "100");
        return url.toString();
      } catch (e) {
        return rawUrl.replace(/w=\d+/, "w=2048").replace(/q=\d+/, "q=100");
      }
    }
    return rawUrl;
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth scroll parallax displacement inside the masked img wrapper
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      showToast("Please sign in to add items to your bag.");
      router.push("/auth");
      return;
    }
    const activeColorName = hoverColor || colorsList[0]?.name || "";
    addToCart(product, product.sizes?.[1] || "M", activeColorName);
    showToast(`${product.name} added to bag`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link
      ref={ref}
      href={`/products/${product.slug}`}
      className="product-card reveal"
      style={{ transitionDelay: `${delay}s` }}
    >
      <div
        className="product-img-wrap cursor-view"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <motion.div
          style={{
            y: imageY,
            height: "112%",
            width: "100%",
            position: "absolute",
            top: "-6%",
            left: 0,
          }}
        >
          <Image
            src={
              getProductImage(0) ||
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=2048&q=100&auto=format"
            }
            alt={product.name}
            fill
            unoptimized={true}
            style={{ objectFit: "cover" }}
            className="product-img-primary"
          />
          {getProductImage(1) && (
            <Image
              src={getProductImage(1)}
              alt={`${product.name} alternate view`}
              fill
              unoptimized={true}
              style={{ objectFit: "cover" }}
              className="product-img-secondary"
            />
          )}
        </motion.div>

        {/* Floating available sizes overlay */}
        {sizesList.length > 0 && (
          <div className="product-card-sizes">
            {sizesList.map((sz) => (
              <span key={sz} className="product-card-size-label available">
                {sz}
              </span>
            ))}
          </div>
        )}

        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}

        {/* Magnetic Wishlist Button */}
        <motion.button
          className={`wishlist-btn ${wishlisted ? "active" : ""}`}
          onClick={handleWishlist}
          aria-label="Wishlist"
          whileHover={{ scale: 1.15 }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            e.currentTarget.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.15)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = `translate(0px, 0px) scale(1)`;
          }}
        >
          {wishlisted ? "♥" : "♡"}
        </motion.button>

        <button
          className="quick-add"
          onClick={handleQuickAdd}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            e.currentTarget.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = `translate(0px, 0px)`;
          }}
        >
          Add to Bag
        </button>
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-meta">
          <span className="product-material">{product.material}</span>
          <span className="product-price">
            {product.original_price && (
              <s>₹{product.original_price.toLocaleString("en-IN")}</s>
            )}
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Elegant Minimalist Color Swatches */}
        {colorsList.length > 1 && (
          <div className="product-card-swatches">
            {colorsList.map((col, idx) => (
              <button
                key={idx}
                type="button"
                className={`product-card-swatch ${hoverColor === col.name || (!hoverColor && idx === 0) ? "active" : ""}`}
                style={{ backgroundColor: col.hex }}
                onMouseEnter={() => setHoverColor(col.name)}
                onMouseLeave={() => setHoverColor(null)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setHoverColor(col.name);
                }}
                aria-label={`Select ${col.name}`}
                title={col.name}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
