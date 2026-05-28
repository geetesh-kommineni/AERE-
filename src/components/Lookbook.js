'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

export default function Lookbook() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Opposite staggered vertical displacements
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 120]);

  // High-fashion slow scale zooms (breathe zooms)
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.01, 1.08]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1.01, 1.08, 1.01]);

  return (
    <section ref={containerRef} style={{ padding: '9rem 4rem', background: 'var(--ivory)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4rem' }}>
        
        {/* Left Side: Staggered Parallax Images */}
        <div style={{ flex: '1', display: 'flex', gap: '2rem', height: '800px', alignItems: 'center' }}>
          <motion.div style={{ y: y1, flex: 1, height: '620px', position: 'relative', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <motion.img 
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80&auto=format" 
              alt="Editorial 1" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', scale: scale1, filter: 'saturate(0.9)' }} 
            />
          </motion.div>
          
          <motion.div style={{ y: y2, flex: 1, height: '720px', position: 'relative', marginTop: '-100px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <motion.img 
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80&auto=format" 
              alt="Editorial 2" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', scale: scale2, filter: 'saturate(0.9)' }} 
            />
          </motion.div>
        </div>

        {/* Right Side: Text & CTA */}
        <div style={{ flex: '0.8', paddingLeft: '4rem' }}>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="eyebrow"
          >
            The Lookbook
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontFamily: 'var(--serif)', fontSize: '3.5rem', fontWeight: 300, lineHeight: '1.1', margin: '1.5rem 0', color: 'var(--ink)' }}
            className="section-title"
          >
            A study in <br/><em>effortless</em> grace.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: '1.1rem', color: 'var(--stone)', lineHeight: '1.6', marginBottom: '3rem', maxWidth: '400px' }}
          >
            Explore the latest editorial campaign. A curated selection of silhouettes designed to move with you through the changing seasons.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/products" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '.8rem' }}>
              Explore the Campaign
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
