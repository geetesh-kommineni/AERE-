"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CouturePreloader() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if the preloader has already run in this session
    const hasRun = sessionStorage.getItem("aere-preloader-seen");
    if (hasRun === "true") {
      setLoading(false);
      return;
    }

    // Set timeout to complete load and slide open the curtains
    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("aere-preloader-seen", "true");
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {loading && (
        <motion.div className="curtain-loader" exit={{ pointerEvents: "none" }}>
          {/* Viewport stroke progress animation */}
          <svg
            style={{
              position: "fixed",
              inset: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 10002,
              pointerEvents: "none",
            }}
          >
            <motion.rect
              x="10"
              y="10"
              width="calc(100vw - 20px)"
              height="calc(100vh - 20px)"
              fill="none"
              stroke="rgba(201, 146, 122, 0.4)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </svg>

          {/* Left Curtain Gate */}
          <motion.div
            className="curtain-gate-left"
            initial={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Right Curtain Gate */}
          <motion.div
            className="curtain-gate-right"
            initial={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          />

          {/* Editorial Wordmark Overlay */}
          <motion.div
            className="curtain-wordmark-wrap"
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.h1
              className="curtain-wordmark text-glow-gold"
              initial={{ letterSpacing: "0.18em", opacity: 0, y: 15 }}
              animate={{ letterSpacing: "0.35em", opacity: 1, y: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            >
              AÉRE
            </motion.h1>
            <motion.p
              className="curtain-sub"
              initial={{ opacity: 0, letterSpacing: "0.15em" }}
              animate={{ opacity: 0.8, letterSpacing: "0.25em" }}
              transition={{
                duration: 1.8,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Atelier Couture
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
