"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import ScrollReveal from "@/components/ScrollReveal";
import FilterDrawer from "@/components/FilterDrawer";

function ProductsContent() {
  const searchParams = useSearchParams();
  const deptParam = searchParams?.get("department");
  const [department, setDepartment] = useState(deptParam || "Women");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (deptParam && deptParam !== department) {
      setDepartment(deptParam);
      setCategory("");
      setPage(1);
    }
  }, [deptParam]);

  useEffect(() => {
    const params = new URLSearchParams({ sort, page, limit: 12 });
    if (category) params.set("category", category);
    if (material) params.set("material", material);
    if (department) params.set("department", department);
    if (color) params.set("color", color);
    if (size) params.set("size", size);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    Promise.resolve().then(() => setLoading(true));
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setTotalPages(d.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [
    sort,
    category,
    material,
    color,
    size,
    minPrice,
    maxPrice,
    department,
    page,
  ]);

  const categories =
    department === "Men"
      ? ["Tops", "Bottoms", "Outerwear", "Knitwear", "Accessories"]
      : [
          "Dresses",
          "Tops",
          "Bottoms",
          "Co-ords",
          "Jumpsuits",
          "Knitwear",
          "Outerwear",
        ];

  const materials =
    department === "Men"
      ? ["Wool", "Cashmere", "Cotton", "Linen", "Silk", "Leather", "Denim"]
      : ["Silk", "Linen", "Cashmere", "Cotton", "Satin", "Wool"];

  return (
    <>
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        department={department}
        category={category}
        setCategory={setCategory}
        material={material}
        setMaterial={setMaterial}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        sort={sort}
        setSort={setSort}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        categories={categories}
        materials={materials}
        onApply={() => setPage(1)}
      />

      <div className="page-hero" style={{ paddingBottom: "2rem" }}>
        <p className="eyebrow">The Edit</p>
        <h1>
          Shop <em>{department || "All"}</em>
        </h1>
      </div>

      {/* Department Tabs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() => {
            setDepartment("Women");
            setCategory("");
            setPage(1);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--sans)",
            fontSize: "1rem",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: department === "Women" ? "var(--ink)" : "var(--stone)",
            borderBottom:
              department === "Women" ? "1px solid var(--ink)" : "none",
            paddingBottom: "0.5rem",
          }}
        >
          Women
        </button>
        <button
          onClick={() => {
            setDepartment("Men");
            setCategory("");
            setPage(1);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--sans)",
            fontSize: "1rem",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: department === "Men" ? "var(--ink)" : "var(--stone)",
            borderBottom:
              department === "Men" ? "1px solid var(--ink)" : "none",
            paddingBottom: "0.5rem",
          }}
        >
          Men
        </button>
      </div>

      <div
        style={{
          padding: "0 4rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--serif)",
            color: "var(--taupe)",
            fontSize: "0.9rem",
            fontStyle: "italic",
          }}
        >
          {products.length} {products.length === 1 ? "Piece" : "Pieces"}
        </p>
        <button
          onClick={() => setIsDrawerOpen(true)}
          style={{
            background: "none",
            border: "1px solid var(--stone)",
            padding: "0.5rem 1.5rem",
            fontFamily: "var(--sans)",
            fontSize: ".75rem",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            cursor: "pointer",
            color: "var(--ink)",
          }}
        >
          Filter & Sort
        </button>
      </div>

      <div style={{ display: "flex", padding: "0 4rem 5rem", gap: "4rem" }}>
        {/* PRODUCTS GRID */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div className="products-grid" style={{ padding: 0 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 0",
                color: "var(--taupe)",
                fontFamily: "var(--serif)",
                fontSize: "1.2rem",
                fontStyle: "italic",
              }}
            >
              No pieces found matching your criteria.
            </div>
          ) : (
            <div className="products-grid" style={{ padding: 0 }}>
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 0.05} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                padding: "4rem 0 0",
              }}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`pd-size ${page === i + 1 ? "active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
