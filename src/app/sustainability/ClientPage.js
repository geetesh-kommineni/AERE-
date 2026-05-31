"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ClientPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  return (
    <>
      <div className="sust-hero" ref={heroRef} style={{ overflow: "hidden" }}>
        <motion.img
          src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200&q=80&auto=format"
          alt="Sustainability"
          style={{ y, scale: 1.1 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(26,20,16,.5)",
          }}
        />
        <div className="sust-hero-overlay">
          <h1>
            Fashion with <em>Intention</em>
          </h1>
          <p>
            We believe luxury and responsibility are not mutually exclusive.
            Every decision we make — from seed to stitch — is guided by our
            commitment to the planet and its people.
          </p>
        </div>
      </div>
      <div className="sust-pillars">
        <div className="sust-pillar">
          <h3>Natural Materials</h3>
          <p>
            We work exclusively with natural and certified fibres — Belgian
            linen, mulberry silk, organic cotton, and Grade A Mongolian
            cashmere. Every material is GOTS or OEKO-TEX certified. Nothing
            synthetic ever enters our supply chain.
          </p>
        </div>
        <div className="sust-pillar">
          <h3>Ethical Production</h3>
          <p>
            Our eight artisan workshops across India operate under fair-wage
            agreements. Every craftsperson receives healthcare benefits, paid
            leave, and skills training. We publish annual transparency reports
            detailing our supply chain.
          </p>
        </div>
        <div className="sust-pillar">
          <h3>Zero Waste</h3>
          <p>
            Every fabric offcut is either repurposed into accessories or
            composted naturally. Our packaging is 100% recyclable and made from
            post-consumer materials. We offset our carbon footprint through
            verified reforestation projects.
          </p>
        </div>
      </div>
      <div className="info-page" style={{ paddingTop: "4rem" }}>
        {/* Accreditation Seals Interactive Grid */}
        <div
          style={{
            paddingBottom: "6rem",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--serif)",
              fontSize: "2.5rem",
              fontWeight: 300,
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Accreditation <em>Seals</em>
          </h2>
          <p
            style={{
              fontFamily: "var(--sans)",
              fontSize: "0.82rem",
              color: "var(--taupe)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              textAlign: "center",
              marginBottom: "4rem",
            }}
          >
            Hover over each watermark to reveal the story of its makers
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {[
              {
                id: "gots",
                stamp: "GOTS",
                title: "Global Organic Textile Standard",
                detail:
                  "Our Belgian Linen and Organic Cottons are GOTS certified. This ensures organic status of textiles from harvesting of raw materials through environmentally and socially responsible manufacturing.",
                story:
                  "We audit our fields in Gujarat and Jaipur quarterly to track pesticide-free growth, using 70% less water than industrial farming.",
              },
              {
                id: "craftmark",
                stamp: "CRAFT",
                title: "Craft Mark Certification",
                detail:
                  "Accredited by the All India Artisans and Craftworkers Welfare Association (AIACA). Authenticates that our block prints and hand-woven pieces are crafted using traditional Indian hand-skills.",
                story:
                  "This seal supports 340+ hand-weavers, guaranteeing fair wages and preserving the heritage craft of Jaipur print-making.",
              },
              {
                id: "dye",
                stamp: "O-DYE",
                title: "Organic Natural Dye Lab",
                detail:
                  "Certified OEKO-TEX Standard 100. Our dye house in Rajasthan uses zero toxic chemicals. We color fabrics exclusively using indigo, terracotta rose, and walnut hull.",
                story:
                  "Water used during dyeing is filtered through a natural reed bed filtration system, rendering it clean enough to return to local organic farms.",
              },
              {
                id: "zero",
                stamp: "ZERO",
                title: "Zero Waste Studio",
                detail:
                  "Verified Circular Economy status. We design our patterns using zero-waste layout principles. 100% of cotton fabric offcuts are converted into handmade cotton paper.",
                story:
                  "Every single tag, envelope, and packing box you receive is made from these direct factory offcuts, saving thousands of trees annually.",
              },
            ].map((ac) => (
              <motion.div
                key={ac.id}
                className="luxury-glass-panel cert-card-hover"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "relative",
                  height: "370px",
                  borderRadius: 0,
                  border: "1px solid var(--border-subtle)",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "rgba(255, 248, 244, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "2.5rem",
                }}
              >
                {/* Default State: Large Embossed Watermark Stamp */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    opacity: 0.04,
                    userSelect: "none",
                    zIndex: 1,
                    transition: "opacity 0.4s, transform 0.4s",
                  }}
                  className="cert-stamp-bg"
                >
                  <span
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: "11rem",
                      fontWeight: 300,
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {ac.stamp}
                  </span>
                </div>

                {/* Content Overlay */}
                <div
                  style={{
                    zIndex: 2,
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {/* Tiny upper tag */}
                    <span
                      style={{
                        fontFamily: "var(--sans)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "var(--rose)",
                        display: "block",
                        marginBottom: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      AÉRE Audit verified
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: "1.35rem",
                        fontWeight: 350,
                        color: "var(--ink)",
                        lineHeight: 1.3,
                        marginBottom: "1rem",
                      }}
                    >
                      {ac.title}
                    </h3>
                  </div>

                  {/* Dynamic story reveal on hover */}
                  <div style={{ overflow: "hidden" }}>
                    <div
                      className="cert-card-interactive-content"
                      style={{ transition: "all 0.4s ease-out" }}
                    >
                      <p
                        style={{
                          fontSize: "0.78rem",
                          lineHeight: 1.6,
                          color: "var(--stone)",
                          margin: 0,
                        }}
                      >
                        {ac.detail}
                      </p>

                      <div
                        className="cert-story-block"
                        style={{
                          marginTop: "0",
                          borderTop: "1px dashed var(--border-subtle)",
                          paddingTop: "0",
                          opacity: 0,
                          maxHeight: 0,
                          overflow: "hidden",
                          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--sans)",
                            fontSize: "0.62rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "var(--rose)",
                            display: "block",
                            marginBottom: "0.35rem",
                            fontWeight: 500,
                          }}
                        >
                          The Maker Story
                        </span>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            lineHeight: 1.5,
                            color: "var(--ink)",
                            fontStyle: "italic",
                            margin: 0,
                          }}
                        >
                          {ac.story}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <h2>The Numbers</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>92%</h3>
            <p>Of our materials are certified organic or recycled.</p>
          </div>
          <div className="info-card">
            <h3>340+</h3>
            <p>Artisans employed across our workshop network.</p>
          </div>
          <div className="info-card">
            <h3>0 kg</h3>
            <p>Textile waste sent to landfill since 2021.</p>
          </div>
          <div className="info-card">
            <h3>100%</h3>
            <p>Renewable energy used in our primary atelier.</p>
          </div>
        </div>
      </div>
    </>
  );
}
