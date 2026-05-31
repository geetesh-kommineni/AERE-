"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (q)
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setProducts(d.products || []));
  }, [q]);
  return (
    <>
      <div className="page-hero">
        <p className="eyebrow">Search Results</p>
        <h1>
          Results for &ldquo;<em>{q}</em>&rdquo;
        </h1>
        <p>{products.length} garments found</p>
      </div>
      <div className="products-grid" style={{ paddingBottom: "4rem" }}>
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={i * 0.05} />
        ))}
      </div>
      {products.length === 0 && q && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            fontFamily: "var(--serif)",
            color: "var(--taupe)",
            fontStyle: "italic",
          }}
        >
          No garments match your search.
        </div>
      )}
    </>
  );
}
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="page-hero">
          <h1>Searching...</h1>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
