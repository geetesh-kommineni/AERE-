"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const MILESTONES = [
  {
    year: "2023",
    title: "The First Loom",
    subtitle: "Jaipur Atelier & Foundations",
    text: "AÉRE was born in Jaipur from a simple but stubborn belief: that the most beautiful garments are those that grow more meaningful over time. Our founder, Meera Sharma, spent three years living alongside master block printers and weavers, establishing the founding Jaipur atelier to bridge India’s rich textile heritage with a quiet, modern sensibility.",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80&auto=format",
    quote: '"Quiet luxury begins with knowing the hands that spun the thread."',
    metrics: [
      { val: "1", label: "Jaipur Atelier" },
      { val: "4", label: "Master Weavers" },
    ],
    stamp: "JAIPUR",
  },
  {
    year: "2024",
    title: "The Organic Commitment",
    subtitle: "100% Certified Natural Fibres",
    text: "By 2024, AÉRE transitioned to an entirely organic and certified natural fibre model. We committed exclusively to Belgian linen, mulberry silk, organic cotton, and Grade A cashmere. We formed direct partnerships with local artisan guilds across Gujarat, Rajasthan, and Himachal Pradesh, ensuring fair wages and safe working environments.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&auto=format",
    quote: '"We choose materials that remember the soil they came from."',
    metrics: [
      { val: "8", label: "Artisan Hubs" },
      { val: "60+", label: "Certifications" },
    ],
    stamp: "ORGANIC",
  },
  {
    year: "2025",
    title: "Circular Design & Dyes",
    subtitle: "Zero Waste & Natural Pigments",
    text: "We introduced our Circular Zero Waste Philosophy in 2025. Every fabric offcut is compiled, re-spun, or naturally composted. We launched our natural dye laboratory, using waste madder root, indigo, pomegranate rinds, and marigolds to dye our signature linen collections, entirely eliminating synthetic runoffs.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80&auto=format",
    quote: '"Zero waste is not a target. It is a quiet discipline."',
    metrics: [
      { val: "100%", label: "Natural Dyes" },
      { val: "0%", label: "Synthetic Waste" },
    ],
    stamp: "ZERO",
  },
  {
    year: "2026",
    title: "The Considered Wardrobe",
    subtitle: "Quiet Luxury Manifesto",
    text: "Today, AÉRE continues to champion slow, unhurried fashion. We do not design for short-lived seasons or chase algorithmic trends. We build garments that are lived in, that breathe, age gracefully, and become softer with every wash. Every seam stands as a quiet commitment to choosing less, but infinitely better.",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format",
    quote: '"She chooses less noise, and more intention."',
    metrics: [
      { val: "18+", label: "Years of Craft" },
      { val: "46", label: "Countries Shipped" },
    ],
    stamp: "M-2026",
  },
];

export default function ClientStory() {
  const trackRef = useRef(null);

  // Track vertical scroll progress of the main track container
  const { scrollYProgress } = useScroll({
    target: trackRef,
  });

  // Map vertical scroll (0 to 1) to horizontal translation (0% to -75% for 4 panels)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  // Self-drawing SVG sewing stitch path length (0 to 1)
  const stitchLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Subtle watermark parallax drift
  const watermarkX = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <div ref={trackRef} style={{ height: "400vh", position: "relative" }}>
      {/* STICKY CONTAINER */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "var(--cream)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {/* FIXED BRANDING HEADER */}
        <div
          style={{
            position: "absolute",
            top: "8.5rem",
            left: "4rem",
            right: "4rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--rose)",
                display: "block",
                fontWeight: 600,
              }}
            >
              Chronicle
            </span>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "1.8rem",
                fontWeight: 300,
                color: "var(--ink)",
                margin: "0.25rem 0 0",
              }}
            >
              Atelier <em>Journey</em>
            </h2>
          </div>
        </div>

        {/* SELF-DRAWING SEWING STITCH LINE */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: 0,
            right: 0,
            height: "10px",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <svg
            width="100%"
            height="10"
            viewBox="0 0 1000 10"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0 5H1000"
              stroke="var(--rose)"
              strokeWidth="1.5"
              strokeDasharray="10,8"
              fill="none"
              style={{ pathLength: stitchLength }}
            />
          </svg>
        </div>

        {/* HORIZONTAL SLIDING CONTAINER */}
        <motion.div
          style={{
            x,
            display: "flex",
            width: "400vw",
            height: "70vh",
            alignItems: "center",
          }}
        >
          {MILESTONES.map((m, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={m.year}
                style={{
                  width: "100vw",
                  height: "100%",
                  display: "grid",
                  gridTemplateColumns: isEven ? "1.2fr 1fr" : "1fr 1.2fr",
                  gap: "6rem",
                  padding: "0 8rem",
                  alignItems: "center",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                {/* Embedded Large Embossed Watermark Stamp */}
                <motion.div
                  style={{
                    position: "absolute",
                    right: isEven ? "15%" : "auto",
                    left: isEven ? "auto" : "15%",
                    top: "15%",
                    x: watermarkX,
                    opacity: 0.03,
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: "18rem",
                      fontWeight: 300,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {m.stamp}
                  </span>
                </motion.div>

                {/* Left/Right Column: Text Content */}
                <div
                  style={{
                    order: isEven ? 1 : 2,
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.62rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--rose)",
                      marginBottom: "0.85rem",
                      display: "block",
                      fontWeight: 600,
                    }}
                  >
                    {m.year} · {m.subtitle}
                  </span>

                  <h3
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: "2.8rem",
                      fontWeight: 300,
                      color: "var(--ink)",
                      lineHeight: 1.15,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {m.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--stone)",
                      lineHeight: 1.8,
                      marginBottom: "2rem",
                    }}
                  >
                    {m.text}
                  </p>

                  <blockquote
                    style={{
                      fontSize: "1.1rem",
                      fontFamily: "var(--serif)",
                      fontStyle: "italic",
                      color: "var(--taupe)",
                      borderLeft: "2.5px solid var(--rose)",
                      paddingLeft: "1.25rem",
                      marginBottom: "2rem",
                      marginInlineStart: 0,
                    }}
                  >
                    {m.quote}
                  </blockquote>

                  <div style={{ display: "flex", gap: "3rem" }}>
                    {m.metrics.map((met, metIdx) => (
                      <div key={metIdx}>
                        <div
                          style={{
                            fontFamily: "var(--serif)",
                            fontSize: "1.8rem",
                            fontWeight: 300,
                            color: "var(--ink)",
                          }}
                        >
                          {met.val}
                        </div>
                        <div
                          style={{
                            fontSize: "0.62rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "var(--taupe)",
                            marginTop: "0.15rem",
                          }}
                        >
                          {met.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Left/Right Column: Image Exhibit */}
                <div
                  style={{
                    order: isEven ? 2 : 1,
                    zIndex: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="luxury-glass-panel"
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      background: "rgba(255, 248, 244, 0.2)",
                      padding: "1.25rem",
                      borderRadius: 0,
                      border: "1px solid var(--border-subtle)",
                      boxShadow: "0 12px 40px rgba(26,20,16,0.03)",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src={m.image}
                        alt={m.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "saturate(0.85)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* PROGRESS DOTS */}
        <div
          style={{
            position: "absolute",
            bottom: "3rem",
            left: "4rem",
            right: "4rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <Link
            href="/sustainability"
            className="btn-primary"
            style={{ fontSize: "0.72rem", padding: "0.6rem 1.8rem" }}
          >
            Our Sustainability Commitment
          </Link>
          <div style={{ display: "flex", gap: "1rem" }}>
            {MILESTONES.map((_, idx) => {
              // Custom hook-linked active highlight dot
              return (
                <div
                  key={idx}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: 0,
                    background: "var(--rose)",
                    opacity: 0.3,
                    transition: "all 0.3s",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
