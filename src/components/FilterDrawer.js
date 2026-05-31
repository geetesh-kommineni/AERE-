"use client";
import { useState, useEffect } from "react";

function FilterSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        marginBottom: "0.5rem",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          padding: "1.25rem 0",
          fontFamily: "var(--sans)",
          fontSize: ".72rem",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "var(--ink)",
          cursor: "pointer",
          transition: "color 0.2s",
          opacity: 0.9,
        }}
      >
        {title}
        <span
          style={{
            display: "inline-block",
            transition: "transform 0.3s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            fontSize: ".65rem",
          }}
        >
          ▼
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? "500px" : "0",
          overflow: "hidden",
          transition:
            "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s",
          opacity: open ? 1 : 0,
          paddingBottom: open ? "1.5rem" : "0",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ChipButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.5rem 1.1rem",
        border: "1px solid",
        borderColor: active ? "var(--ink)" : "var(--border-subtle)",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--cream)" : "var(--stone)",
        cursor: "pointer",
        fontFamily: "var(--sans)",
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: active ? "scale(1.02)" : "scale(1)",
      }}
    >
      {label}
    </button>
  );
}

export default function FilterDrawer({
  isOpen,
  onClose,
  department,
  category,
  setCategory,
  material,
  setMaterial,
  color,
  setColor,
  size,
  setSize,
  sort,
  setSort,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categories,
  materials,
  onApply,
}) {
  const [localCategory, setLocalCategory] = useState(category);
  const [localMaterial, setLocalMaterial] = useState(material);
  const [localColor, setLocalColor] = useState(color);
  const [localSize, setLocalSize] = useState(size);
  const [localSort, setLocalSort] = useState(sort);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  useEffect(() => {
    if (isOpen) {
      setLocalCategory(category);
      setLocalMaterial(material);
      setLocalColor(color);
      setLocalSize(size);
      setLocalSort(sort);
      setLocalMinPrice(minPrice);
      setLocalMaxPrice(maxPrice);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, category, material, color, size, sort, minPrice, maxPrice]);

  const colors = ["Black", "White", "Beige", "Navy", "Grey", "Brown", "Olive"];
  const sizes =
    department === "Men"
      ? ["S", "M", "L", "XL", "XXL"]
      : ["XS", "S", "M", "L", "XL"];

  const activeCount = [
    localCategory,
    localMaterial,
    localColor,
    localSize,
    localMinPrice,
    localMaxPrice,
  ].filter(Boolean).length;

  const handleApply = () => {
    setCategory(localCategory);
    setMaterial(localMaterial);
    setColor(localColor);
    setSize(localSize);
    setSort(localSort);
    setMinPrice(localMinPrice);
    setMaxPrice(localMaxPrice);
    onApply();
    onClose();
  };

  const handleClear = () => {
    setLocalCategory("");
    setLocalMaterial("");
    setLocalColor("");
    setLocalSize("");
    setLocalSort("newest");
    setLocalMinPrice("");
    setLocalMaxPrice("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(26,20,16,0.4)",
          backdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.4s ease, backdrop-filter 0.4s ease",
          zIndex: 9998,
        }}
      />

      {/* Drawer */}
      <div
        className="luxury-glass-panel"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          height: "100vh",
          maxHeight: "100vh",
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--glass-bg)",
          color: "var(--ink)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition:
            "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          boxShadow: isOpen ? "-20px 0 60px rgba(0,0,0,0.05)" : "none",
          borderLeft: "1px solid var(--glass-border-bottom)",
          borderRadius: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "2rem 2.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.6rem",
                fontWeight: 300,
                margin: 0,
                fontStyle: "italic",
                color: "var(--ink)",
              }}
            >
              Refine
            </h2>
            {activeCount > 0 && (
              <p
                style={{
                  fontSize: ".65rem",
                  color: "var(--taupe)",
                  letterSpacing: ".1em",
                  marginTop: ".4rem",
                }}
              >
                {activeCount} filter{activeCount > 1 ? "s" : ""} active
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--border-subtle)",
              color: "var(--ink)",
              cursor: "pointer",
              fontSize: ".75rem",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 0.2s",
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem 2.5rem" }}>
          {/* SORT */}
          <FilterSection title="Sort By" defaultOpen={true}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              {[
                { value: "newest", label: "Newest First" },
                { value: "price-asc", label: "Price: Low → High" },
                { value: "price-desc", label: "Price: High → Low" },
                { value: "name", label: "Alphabetical" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLocalSort(opt.value)}
                  style={{
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontFamily: "var(--sans)",
                    fontSize: ".8rem",
                    cursor: "pointer",
                    color:
                      localSort === opt.value ? "var(--ink)" : "var(--taupe)",
                    padding: "0.4rem 0",
                    transition: "color 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      border: "1px solid",
                      borderColor:
                        localSort === opt.value
                          ? "var(--ink)"
                          : "var(--border-subtle)",
                      background:
                        localSort === opt.value ? "var(--ink)" : "transparent",
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                  />
                  {opt.label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* CATEGORY */}
          <FilterSection title="Category" defaultOpen={true}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <ChipButton
                label="All"
                active={!localCategory}
                onClick={() => setLocalCategory("")}
              />
              {categories.map((c) => (
                <ChipButton
                  key={c}
                  label={c}
                  active={localCategory === c}
                  onClick={() => setLocalCategory(localCategory === c ? "" : c)}
                />
              ))}
            </div>
          </FilterSection>

          {/* MATERIAL */}
          <FilterSection title="Material">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {materials.map((m) => (
                <ChipButton
                  key={m}
                  label={m}
                  active={localMaterial === m}
                  onClick={() => setLocalMaterial(localMaterial === m ? "" : m)}
                />
              ))}
            </div>
          </FilterSection>

          {/* COLOR */}
          <FilterSection title="Color">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {colors.map((c) => (
                <ChipButton
                  key={c}
                  label={c}
                  active={localColor === c}
                  onClick={() => setLocalColor(localColor === c ? "" : c)}
                />
              ))}
            </div>
          </FilterSection>

          {/* SIZE */}
          <FilterSection title="Size">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {sizes.map((s) => (
                <ChipButton
                  key={s}
                  label={s}
                  active={localSize === s}
                  onClick={() => setLocalSize(localSize === s ? "" : s)}
                />
              ))}
            </div>
          </FilterSection>

          {/* PRICE */}
          <FilterSection title="Price Range">
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: ".6rem",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--taupe)",
                    display: "block",
                    marginBottom: ".4rem",
                  }}
                >
                  Min ₹
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={localMinPrice}
                  onChange={(e) => setLocalMinPrice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    background: "rgba(158, 139, 124, 0.08)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--ink)",
                    fontFamily: "var(--sans)",
                    fontSize: "0.85rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
              <span style={{ color: "var(--taupe)", marginTop: "1.2rem" }}>
                —
              </span>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: ".6rem",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--taupe)",
                    display: "block",
                    marginBottom: ".4rem",
                  }}
                >
                  Max ₹
                </label>
                <input
                  type="number"
                  placeholder="20000"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.8rem",
                    background: "rgba(158, 139, 124, 0.08)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--ink)",
                    fontFamily: "var(--sans)",
                    fontSize: "0.85rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                  }}
                />
              </div>
            </div>
          </FilterSection>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: "1.5rem 2.5rem",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: "1rem",
          }}
        >
          <button
            onClick={handleClear}
            style={{
              flex: 1,
              padding: "1rem",
              border: "1px solid var(--border-subtle)",
              background: "transparent",
              color: "var(--ink)",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              fontSize: ".72rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              transition: "all 0.2s",
            }}
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            style={{
              flex: 2,
              padding: "1rem",
              border: "none",
              background: "var(--ink)",
              color: "var(--cream)",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              fontSize: ".72rem",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              fontWeight: 500,
              transition: "all 0.2s",
            }}
          >
            Apply{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      </div>
    </>
  );
}
