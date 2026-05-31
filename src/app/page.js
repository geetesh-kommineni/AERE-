"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import Lookbook from "@/components/Lookbook";

import { useToast } from "@/context/ToastContext";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [nlName, setNlName] = useState("");
  const [nlEmail, setNlEmail] = useState("");
  const { showToast } = useToast();

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote:
        "The linen has a weight I've never felt before. It moves with a heavy drape that looks tailored yet completely relaxed. A masterpiece of design.",
      patron: "Aria K.",
      location: "New Delhi",
      garment: "Dusty Rose Linen Trouser",
    },
    {
      id: 2,
      quote:
        "Ordering from AÉRE felt like receiving a gift from an old friend. The Jaipur cotton packaging, the dried botanicals, and the absolute perfection of the silk seams. Exquisite.",
      patron: "Mira P.",
      location: "Mumbai",
      garment: "Mulberry Silk Blouse",
    },
    {
      id: 3,
      quote:
        "Their sizing guide recommended an L, and it fits exactly as described. Spacious chest room but structured at the shoulders. I will never buy synthetics again.",
      patron: "Kabir S.",
      location: "Bengaluru",
      garment: "Artisan Organic Cotton Shirt",
    },
    {
      id: 4,
      quote:
        "The dusty rose silk blouse is almost weightless. It breathes so beautifully in the summer heat, yet keeps a perfect formal shape. An absolute staple.",
      patron: "Elena R.",
      location: "Goa",
      garment: "Dusty Rose Silk Blouse",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev === 3 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Refs for scroll-linked parallax
  const editorialRef = useRef(null);
  const { scrollYProgress: editorialProgress } = useScroll({
    target: editorialRef,
    offset: ["start end", "end start"],
  });
  const editorialImageY = useTransform(
    editorialProgress,
    [0, 1],
    ["-10%", "10%"],
  );
  const editorialImageScale = useTransform(
    editorialProgress,
    [0, 0.5, 1],
    [1.1, 1.05, 1],
  );

  // Premium collections carousel states & refs
  const carouselRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const [progressWidth, setProgressWidth] = useState(0);
  const carouselX = useMotionValue(0);

  useEffect(() => {
    fetch("/api/products?featured=1&limit=8")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));
    fetch("/api/collections")
      .then((r) => r.json())
      .then((d) => setCollections(d.collections || []));
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const updateConstraints = () => {
      const scrollWidth = el.scrollWidth;
      const offsetWidth = el.offsetWidth;
      setDragConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
    };

    // Tiny delay to ensure DOM has rendered collections fully
    const timer = setTimeout(updateConstraints, 300);

    const unsubscribe = carouselX.on("change", (latest) => {
      const scrollWidth = el.scrollWidth;
      const offsetWidth = el.offsetWidth;
      const maxScroll = scrollWidth - offsetWidth;
      if (maxScroll <= 0) return;
      const percentage = Math.min(Math.max(-latest / maxScroll, 0), 1) * 100;
      setProgressWidth(percentage);
    });

    window.addEventListener("resize", updateConstraints);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateConstraints);
      unsubscribe();
    };
  }, [collections, carouselX]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const targetX = clientX - window.innerWidth / 2;
    const targetY = clientY - window.innerHeight / 2;
    mouseX.set(targetX);
    mouseY.set(targetY);
  };

  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  const imageX = useTransform(springX, [-1000, 1000], [25, -25]);
  const imageY = useTransform(springY, [-1000, 1000], [25, -25]);
  const textX = useTransform(springX, [-1000, 1000], [-15, 15]);
  const textY = useTransform(springY, [-1000, 1000], [-15, 15]);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nlName, email: nlEmail }),
    });
    const data = await res.json();
    showToast(data.message || "Welcome — you're on the list.");
    setNlName("");
    setNlEmail("");
  };

  const colImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    "https://images.unsplash.com/photo-1550614000-4b95d4ed79ea?w=800&q=80",
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero" onMouseMove={handleMouseMove}>
        <div className="hero-left">
          <motion.p style={{ x: textX, y: textY }} className="hero-tag">
            Spring · Summer 2026
          </motion.p>
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ x: textX, y: textY }}
              className="hero-title text-glow-rose"
            >
              Dressed
              <br />
              in <em>quiet</em>
              <br />
              luxury.
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hero-sub"
          >
            Garments designed for the considered wardrobe. Unhurried silhouettes
            in fabrics that remember the earth they came from.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hero-cta"
          >
            <Link href="/products" className="btn-primary">
              Shop the Edit
            </Link>
            <Link href="/collections" className="btn-ghost">
              View Collections
            </Link>
          </motion.div>
        </div>
        <div className="hero-right">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ x: imageX, y: imageY }}
            className="hero-image-wrap"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=900&q=85&auto=format"
              alt="AÉRE fashion editorial"
              animate={{ scale: [1, 1.08] }}
              transition={{
                duration: 20,
                ease: "linear",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "saturate(0.85)",
              }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="hero-badge"
          >
            <div className="label">New Season</div>
            <div className="value">SS &apos;26 Arrivals</div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <ScrollReveal>
        <div className="stats">
          <div className="stat-item">
            <div className="stat-num">18+</div>
            <div className="stat-label">Years of Craft</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">100%</div>
            <div className="stat-label">Natural Fibres</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">46</div>
            <div className="stat-label">Countries Shipped</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">Zero</div>
            <div className="stat-label">Waste Philosophy</div>
          </div>
        </div>
      </ScrollReveal>

      {/* COLLECTIONS */}
      <section id="collections">
        <ScrollReveal>
          <div className="section-header">
            <h2 className="section-title">
              Our <em>Collections</em>
            </h2>
            <Link href="/collections" className="section-link">
              All Collections
            </Link>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="collections-carousel-container">
            <motion.div
              ref={carouselRef}
              drag="x"
              dragConstraints={dragConstraints}
              style={{ x: carouselX }}
              className="collections-carousel-track"
            >
              {collections.slice(0, 5).map((col) => (
                <div
                  key={col.id}
                  className="cursor-drag"
                  style={{ userSelect: "none" }}
                >
                  <Link
                    href={`/collections/${col.slug}`}
                    className="carousel-col-item"
                    onClick={(e) => {
                      // Prevent navigation if dragged significantly
                      if (Math.abs(carouselX.getVelocity()) > 10) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <img src={col.image} alt={col.name} />
                    <div className="col-overlay">
                      <p className="col-tag">{col.tag}</p>
                      <h3 className="col-name">{col.name}</h3>
                      <div className="col-arrow">→</div>
                    </div>
                  </Link>
                </div>
              ))}
            </motion.div>
            <div className="carousel-progress-container">
              <div
                className="carousel-progress-bar"
                style={{
                  width: `${progressWidth}%`,
                  transition: "width 0.1s ease-out",
                }}
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* NEW ARRIVALS */}
      <section id="new">
        <ScrollReveal>
          <div className="section-header">
            <h2 className="section-title">
              New <em>Arrivals</em>
            </h2>
            <Link href="/products" className="section-link">
              View All
            </Link>
          </div>
        </ScrollReveal>
        <div className="products-grid">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* LOOKBOOK */}
      <Lookbook />

      <section ref={editorialRef}>
        <ScrollReveal>
          <div className="editorial">
            <div className="editorial-text">
              <p className="eyebrow">Our Philosophy</p>
              <h2>Clothes that outlive their season.</h2>
              <p>
                We make pieces that slow down — garments that breathe, age
                gracefully, and become more beautiful the more they&apos;re
                lived in. Every seam is a quiet commitment to doing less,
                better.
              </p>
              <Link href="/our-story" className="btn-primary">
                Read Our Story
              </Link>
            </div>
            <div className="editorial-center" style={{ overflow: "hidden" }}>
              <motion.img
                src="/images/aere_linen_hangtag.png"
                alt="AÉRE Luxury Woven Label"
                style={{
                  y: editorialImageY,
                  scale: editorialImageScale,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "saturate(.95)",
                }}
              />
            </div>
            <div className="editorial-right">
              <div>
                <p className="editorial-quote">
                  &ldquo;She chooses less noise, more intention.&rdquo;
                </p>
                <p className="editorial-attr">— Aére, 2026 Manifesto</p>
              </div>
              <div className="editorial-nums">
                <div className="editorial-num-item">
                  <div className="n">8</div>
                  <div className="l">Artisan Workshops</div>
                </div>
                <div className="editorial-num-item">
                  <div className="n">3</div>
                  <div className="l">Natural Dye Sources</div>
                </div>
                <div className="editorial-num-item">
                  <div className="n">60+</div>
                  <div className="l">Fabric Certifications</div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* PATRONS TESTIMONIALS CAROUSEL */}
      <ScrollReveal>
        <section
          style={{
            padding: "6rem 4rem 2rem",
            background: "var(--stone-light)",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <div
            style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
          >
            <p
              className="eyebrow"
              style={{ color: "var(--rose)", marginBottom: "1.5rem" }}
            >
              Patron Journals
            </p>
            <h2
              style={{
                fontFamily: "var(--serif)",
                fontSize: "2.5rem",
                fontWeight: 300,
                marginBottom: "3.5rem",
              }}
            >
              Voices of <em>Aére</em>
            </h2>

            <div
              className="luxury-glass-panel"
              style={{
                padding: "4rem 3.5rem",
                borderRadius: 0,
                position: "relative",
                minHeight: "280px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "rgba(255, 248, 244, 0.2)",
                border: "1px solid var(--border-subtle)",
                boxShadow: "0 8px 32px rgba(26, 20, 16, 0.03)",
              }}
            >
              {/* Star rating */}
              <div
                style={{
                  color: "var(--rose)",
                  fontSize: "0.85rem",
                  marginBottom: "1.5rem",
                  letterSpacing: "0.2em",
                }}
              >
                ★ ★ ★ ★ ★
              </div>

              <div style={{ overflow: "hidden", position: "relative" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--serif)",
                        fontSize: "1.65rem",
                        lineHeight: 1.6,
                        fontStyle: "italic",
                        color: "var(--ink)",
                        marginBottom: "2rem",
                        fontWeight: 300,
                      }}
                    >
                      &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                    </p>

                    <div>
                      <span
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: "0.72rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "var(--ink)",
                          fontWeight: 600,
                          display: "block",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {testimonials[activeTestimonial].patron}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--sans)",
                          fontSize: "0.65rem",
                          letterSpacing: "0.1em",
                          color: "var(--taupe)",
                          textTransform: "uppercase",
                        }}
                      >
                        {testimonials[activeTestimonial].location} · Wearing the{" "}
                        {testimonials[activeTestimonial].garment}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation arrows */}
              <button
                onClick={() =>
                  setActiveTestimonial((prev) =>
                    prev === 0 ? testimonials.length - 1 : prev - 1,
                  )
                }
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "var(--taupe)",
                  padding: "0.5rem",
                  transition: "color 0.3s",
                }}
                className="hover-color-ink"
                aria-label="Previous review"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setActiveTestimonial((prev) =>
                    prev === testimonials.length - 1 ? 0 : prev + 1,
                  )
                }
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "var(--taupe)",
                  padding: "0.5rem",
                  transition: "color 0.3s",
                }}
                className="hover-color-ink"
                aria-label="Next review"
              >
                →
              </button>
            </div>

            {/* Slider dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.8rem",
                marginTop: "2rem",
              }}
            >
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: 0,
                    border: "none",
                    background:
                      activeTestimonial === index
                        ? "var(--rose)"
                        : "var(--border-subtle)",
                    padding: 0,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    transform:
                      activeTestimonial === index ? "scale(1.2)" : "scale(1)",
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* FEATURES */}
      <ScrollReveal>
        <div className="features" style={{ marginTop: "6rem" }}>
          <div className="feature-item">
            <div className="feature-icon">⟳</div>
            <h3 className="feature-title">Free Returns</h3>
            <p className="feature-desc">
              30-day returns on all full-price items. No questions. No friction.
              Just care.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">◇</div>
            <h3 className="feature-title">Natural Fibres Only</h3>
            <p className="feature-desc">
              Every garment is made from certified natural or recycled
              materials. Nothing synthetic touches your skin.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✦</div>
            <h3 className="feature-title">Complimentary Shipping</h3>
            <p className="feature-desc">
              Free delivery across India on all orders above ₹4,999. Express
              options available at checkout.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* NEWSLETTER */}
      <ScrollReveal>
        <section
          className="newsletter luxury-glass-panel"
          style={{ marginTop: "8rem", marginBottom: "4rem" }}
        >
          <div className="newsletter-left">
            <p className="eyebrow">Stay Close</p>
            <h2>
              Letters from <em>Aére</em>
            </h2>
            <p>
              Early access to collections, styling notes, and stories from our
              makers — delivered thoughtfully, never often.
            </p>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input
              type="text"
              placeholder="Your Name"
              value={nlName}
              onChange={(e) => setNlName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email Address"
              value={nlEmail}
              onChange={(e) => setNlEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              Join the Circle
            </button>
            <p className="newsletter-note">
              We respect your inbox. One letter, never more than twice a month.
            </p>
          </form>
        </section>
      </ScrollReveal>
    </>
  );
}
