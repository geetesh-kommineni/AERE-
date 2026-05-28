'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';

export default function ScrollDial() {
  const { scrollYProgress } = useScroll();
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Sync React state with framer motion scroll progress
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const percentage = Math.round(latest * 100);
      setScrollPercentage(percentage);
      setVisible(percentage > 1);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="scroll-dial-wrap"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          aria-label="Scroll to top"
          title="Scroll to Top"
        >
          {/* Circular SVG containing rotating text path */}
          <svg className="scroll-dial-svg" viewBox="0 0 100 100">
            <defs>
              <path
                id="textPath"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text fill="var(--taupe)" fontSize="5.5" letterSpacing="0.25em" fontWeight="500">
              <textPath href="#textPath" startOffset="0%">
                SCROLL TO EXPLORE · AÉRE ATELIER · 
              </textPath>
            </text>
          </svg>

          {/* Central Percentage display */}
          <div className="scroll-dial-center">
            <span className="scroll-dial-pct">{scrollPercentage}%</span>
            <span style={{ fontSize: '0.45rem', opacity: 0.5, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
