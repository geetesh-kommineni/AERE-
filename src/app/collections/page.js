"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((d) => setCollections(d.collections || []));
  }, []);
  return (
    <>
      <div className="page-hero">
        <p className="eyebrow">Curated</p>
        <h1>
          Our <em>Collections</em>
        </h1>
        <p>
          Each collection is a chapter in the Aére story — thoughtfully curated,
          seasonally considered.
        </p>
      </div>
      <div className="collections-page-grid">
        {collections.map((c, i) => (
          <ScrollReveal key={c.id} delay={i * 0.1}>
            <Link
              href={`/collections/${c.slug}`}
              className="col-page-item"
              style={{
                display: "block",
                position: "relative",
                minHeight: "400px",
                overflow: "hidden",
              }}
            >
              <img
                src={c.image}
                alt={c.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  inset: 0,
                  filter: "saturate(.85)",
                }}
              />
              <div className="col-overlay">
                <p className="col-tag">{c.tag}</p>
                <h3 className="col-name">{c.name}</h3>
                <div className="col-arrow">→</div>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </>
  );
}
