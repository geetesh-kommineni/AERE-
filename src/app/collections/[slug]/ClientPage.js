'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';
import ScrollReveal from '@/components/ScrollReveal';

export default function CollectionDetailPage({ params }) {
  const { slug } = use(params);
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/collections/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((d) => {
        setCollection(d.collection);
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <>
        {/* Banner Skeleton */}
        <section style={{ height: '60vh', backgroundColor: 'rgba(158,139,124,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div 
            className="skeleton-shimmer"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              transform: 'translateX(-100%)',
              animation: 'shimmer 1.8s infinite'
            }}
          />
          <div style={{ position: 'relative', textAlign: 'center', width: '300px', height: '40px', backgroundColor: 'rgba(158,139,124,0.08)' }}>
            <div 
              className="skeleton-shimmer"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 1.8s infinite'
              }}
            />
          </div>
        </section>

        {/* Product Grid Skeleton */}
        <section style={{ padding: '4rem 4rem 8rem' }}>
          <div className="products-grid" style={{ padding: 0 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </>
    );
  }

  if (!collection) {
    return (
      <div style={{ padding: '10rem 4rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', marginBottom: '1rem', fontWeight: 300 }}>Collection Not Found</h1>
        <p style={{ color: 'var(--taupe)', marginBottom: '2rem' }}>The requested collection does not exist or has been archived.</p>
        <Link href="/collections" className="btn-primary" style={{ display: 'inline-block' }}>
          Back to Collections
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Editorial Collection Hero Banner */}
      <section className="collection-hero" style={{ position: 'relative', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src={collection.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=85&auto=format'}
            alt={collection.name}
            fill
            priority
            style={{ objectFit: 'cover', filter: 'brightness(0.9) saturate(0.85)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,20,16,0.3) 0%, rgba(26,20,16,0.6) 100%)' }} />
        </div>
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', padding: '0 2rem', maxWidth: '800px' }}>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontFamily: 'var(--sans)', fontSize: '.75rem', letterSpacing: '.3em', textTransform: 'uppercase', marginBottom: '1rem', color: 'rgba(255,255,255,0.8)' }}
          >
            {collection.tag || 'AÉRE Chapter'}
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '-0.02em', marginBottom: '1.5rem', textTransform: 'none' }}
          >
            {collection.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}
          >
            {collection.description}
          </motion.p>
        </div>
      </section>

      {/* Product Grid Section */}
      <section style={{ padding: '4rem 4rem 8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--sand)', paddingBottom: '1.5rem', marginBottom: '3rem' }}>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--taupe)' }}>
            Curated Chapter / {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
          </p>
          <Link href="/collections" style={{ fontFamily: 'var(--sans)', fontSize: '.7rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--ink)' }}>
            All Chapters
          </Link>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--taupe)', fontFamily: 'var(--serif)', fontSize: '1.2rem', fontStyle: 'italic' }}>
            New pieces for this chapter are currently in development.
          </div>
        ) : (
          <div className="products-grid" style={{ padding: 0 }}>
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 0.08} />
            ))}
          </div>
        )}
      </section>

      {/* Editorial Branding Section */}
      <ScrollReveal>
        <section style={{ backgroundColor: 'var(--sand)', padding: '6rem 4rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <p className="eyebrow" style={{ color: 'var(--taupe)', marginBottom: '1rem' }}>Chapter Reflection</p>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 300, fontStyle: 'italic', color: 'var(--ink)', marginBottom: '1.5rem' }}>Slow Made, Sustainably Minded</h2>
            <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'var(--taupe)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Each piece in this collection is cut from organic materials and handcrafted in small numbers to avoid waste. 
              Aére represents a philosophy of quiet luxury and deliberate design, ensuring each garment shares a legacy of care and environmental respect.
            </p>
            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--taupe)' }}>
              — The Aére Atelier
            </p>
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
