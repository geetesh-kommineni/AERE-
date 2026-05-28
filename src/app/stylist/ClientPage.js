'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function ClientPage() {
  const [step, setStep] = useState(0); // 0: department, 1: vibe, 2: atmosphere, 3: result
  const [selections, setSelections] = useState({
    department: 'women', // 'women' | 'men'
    vibe: '', // 'terracotta' | 'midnight' | 'ivory'
    atmosphere: '' // 'jaipur' | 'monsoon' | 'resort'
  });
  
  const [sizes, setSizes] = useState({ item0: 'M', item1: 'M', item2: 'M' });
  const { addToCart, setIsDrawerOpen } = useCart();
  const { showToast } = useToast();

  const handleSelect = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    setStep(prev => prev + 1);
  };

  const resetQuiz = () => {
    setSelections({ department: 'women', vibe: '', atmosphere: '' });
    setStep(0);
  };

  // Curated database items matching actual product inventory slugs
  const matches = {
    women: {
      terracotta: [
        {
          id: 6,
          name: 'Terracotta Wrap Skirt',
          slug: 'terracotta-wrap-skirt',
          image: '/images/products/terracotta-wrap-skirt.png',
          price: 4290,
          material: 'Natural Cotton Voile'
        },
        {
          id: 16,
          name: 'Terracotta Linen Shift',
          slug: 'terracotta-linen-shift',
          image: '/images/products/terracotta-linen-shift.png',
          price: 8990,
          material: 'French Linen'
        },
        {
          id: 7,
          name: 'Soft White Linen Shirt',
          slug: 'soft-white-linen-shirt',
          image: '/images/products/soft-white-linen-shirt.png',
          price: 4990,
          material: 'Stone-Washed Linen'
        }
      ],
      midnight: [
        {
          id: 11,
          name: 'Midnight Silk Slip Dress',
          slug: 'midnight-silk-slip-dress',
          image: '/images/products/midnight-silk-slip-dress.png',
          price: 12490,
          material: 'Mulberry Silk'
        },
        {
          id: 13,
          name: 'Onyx Evening Gown',
          slug: 'onyx-evening-gown',
          image: '/images/products/onyx-evening-gown.png',
          price: 28990,
          material: 'Silk Crepe'
        },
        {
          id: 2,
          name: 'Dusty Rose Silk Blouse',
          slug: 'dusty-rose-silk-blouse',
          image: '/images/products/dusty-rose-silk-blouse.png',
          price: 5290,
          material: 'Silk Charmeuse'
        }
      ],
      ivory: [
        {
          id: 1,
          name: 'Ivory Linen Dress',
          slug: 'ivory-linen-dress',
          image: '/images/products/ivory-linen-dress.png',
          price: 7490,
          material: '100% Belgian Linen'
        },
        {
          id: 5,
          name: 'Ecru Cotton Midi Dress',
          slug: 'ecru-cotton-midi-dress',
          image: '/images/products/ecru-cotton-midi-dress.png',
          price: 6490,
          material: 'Organic Cotton'
        },
        {
          id: 9,
          name: 'Oat Cashmere Cardigan',
          slug: 'oat-cashmere-cardigan',
          image: '/images/products/oat-cashmere-cardigan.png',
          price: 14990,
          material: 'Mongolian Cashmere'
        }
      ]
    },
    men: {
      terracotta: [
        {
          id: 21,
          name: 'Sand Linen Trousers',
          slug: 'mens-linen-drawstring-trousers',
          image: '/images/aere_premium_linen_trousers.png',
          price: 8990,
          material: 'European Linen'
        },
        {
          id: 26,
          name: 'Linen Button-Down',
          slug: 'mens-linen-overshirt',
          image: '/images/aere_premium_linen_overshirt.png',
          price: 9490,
          material: 'European Linen'
        },
        {
          id: 19,
          name: 'Classic White Oxford',
          slug: 'mens-white-oxford-shirt',
          image: '/images/aere_premium_white_shirt.png',
          price: 6490,
          material: 'Organic Cotton'
        }
      ],
      midnight: [
        {
          id: 17,
          name: 'Charcoal Double-Breasted Suit',
          slug: 'mens-charcoal-wool-suit',
          image: '/images/aere_premium_charcoal_suit.png',
          price: 34990,
          material: 'Italian Virgin Wool'
        },
        {
          id: 22,
          name: 'Slate Silk Knit Polo',
          slug: 'mens-slate-silk-polo',
          image: '/images/aere_premium_silk_polo_v2.png',
          price: 11490,
          material: '100% Spun Silk'
        },
        {
          id: 27,
          name: 'Classic Leather Chelsea Boots',
          slug: 'mens-leather-chelsea-boots',
          image: '/images/aere_single_chelsea_boot.png',
          price: 16990,
          material: 'Italian Calfskin'
        }
      ],
      ivory: [
        {
          id: 18,
          name: 'Navy Cashmere Sweater',
          slug: 'mens-navy-cashmere-sweater',
          image: '/images/aere_premium_navy_sweater.png',
          price: 18990,
          material: '100% Cashmere'
        },
        {
          id: 19,
          name: 'Classic White Oxford',
          slug: 'mens-white-oxford-shirt',
          image: '/images/aere_premium_white_shirt.png',
          price: 6490,
          material: 'Organic Cotton'
        },
        {
          id: 21,
          name: 'Sand Linen Trousers',
          slug: 'mens-linen-drawstring-trousers',
          image: '/images/aere_premium_linen_trousers.png',
          price: 8990,
          material: 'European Linen'
        }
      ]
    }
  };

  const getActiveCapsule = () => {
    const dept = selections.department;
    const vib = selections.vibe || 'ivory';
    return matches[dept][vib];
  };

  const capsuleItems = getActiveCapsule();
  const subtotal = capsuleItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddCapsule = () => {
    // Add all 3 items to cart context
    capsuleItems.forEach((item, index) => {
      const selectedSize = sizes[`item${index}`] || 'M';
      addToCart(item, selectedSize, '');
    });
    showToast('Atelier Capsule Wardrobe added to bag.');
    setIsDrawerOpen(true);
  };

  return (
    <>
      <div className="page-hero">
        <p className="eyebrow" style={{ color: 'var(--rose)' }}>Concierge Service</p>
        <h1>Atelier Capsule <em>Stylist</em></h1>
        <p>Answer three considered questions to curate a bespoke 3-piece quiet luxury capsule look, balanced for your lifestyle.</p>
      </div>

      <div className="page-content" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '8rem' }}>
        <AnimatePresence mode="wait">
          
          {/* STEP 0: DEPARTMENT SELECTION */}
          {step === 0 && (
            <motion.div
              key="step-dept"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', padding: '2rem 0' }}
            >
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '3rem' }}>
                Select your preferred <em>department</em>
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }} className="calculator-layout-wrap">
                <button
                  onClick={() => handleSelect('department', 'women')}
                  className="luxury-glass-panel hover-card-border"
                  style={{
                    padding: '4rem 3rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255, 248, 244, 0.1)',
                    fontFamily: 'var(--serif)',
                    fontSize: '2rem',
                    fontWeight: 300,
                    cursor: 'pointer',
                    borderRadius: 0,
                    width: '320px',
                    color: 'var(--ink)'
                  }}
                >
                  Women&apos;s Edition
                </button>
                <button
                  onClick={() => handleSelect('department', 'men')}
                  className="luxury-glass-panel hover-card-border"
                  style={{
                    padding: '4rem 3rem',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255, 248, 244, 0.1)',
                    fontFamily: 'var(--serif)',
                    fontSize: '2rem',
                    fontWeight: 300,
                    cursor: 'pointer',
                    borderRadius: 0,
                    width: '320px',
                    color: 'var(--ink)'
                  }}
                >
                  Men&apos;s Edition
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: VIBE / DRAPE CHOICE */}
          {step === 1 && (
            <motion.div
              key="step-vibe"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '3rem' }}>
                Select your fabric <em>drapery profile</em>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {[
                  {
                    key: 'ivory',
                    name: 'Ivory & Cream Minimalist',
                    desc: 'Clean, light Belgian linen and organic knits representing calm, unhurried atelier lounging.'
                  },
                  {
                    key: 'terracotta',
                    name: 'Terracotta Monochromatic',
                    desc: 'Rich Earth pigments, mid-weight linen shirts and trousers inspired by Jaipur sandstone architecture.'
                  },
                  {
                    key: 'midnight',
                    name: 'Midnight Silk & Crepe',
                    desc: 'Flowing bias-cuts, heavy virgin wools and lustrous Mulberry silk crepe designed for occasion elegance.'
                  }
                ].map(v => (
                  <button
                    key={v.key}
                    onClick={() => handleSelect('vibe', v.key)}
                    className="luxury-glass-panel hover-card-border"
                    style={{
                      padding: '3rem 2rem',
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(255, 248, 244, 0.1)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: 0,
                      color: 'var(--ink)'
                    }}
                  >
                    <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Vibe 0{v.key === 'ivory' ? 1 : v.key === 'terracotta' ? 2 : 3}
                    </span>
                    <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 400, marginBottom: '0.75rem', color: 'var(--ink)' }}>{v.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--taupe)', lineHeight: 1.5, margin: 0 }}>{v.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--taupe)', marginTop: '3rem', borderBottom: '1px solid var(--border-subtle)' }}>
                ← Back
              </button>
            </motion.div>
          )}

          {/* STEP 2: ATMOSPHERE / SCENARIO CHOICE */}
          {step === 2 && (
            <motion.div
              key="step-atmos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '3rem' }}>
                Select your styling <em>atmosphere</em>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {[
                  {
                    key: 'jaipur',
                    name: 'Jaipur Summer Garden',
                    desc: 'Breathable, protective layers suited for warm sunlight, shaded brick courtyards, and organic strolls.'
                  },
                  {
                    key: 'monsoon',
                    name: 'Monsoon Evening Dusk',
                    desc: 'Heavy-draped, structured outerwear layers offering warmth, sophisticated comfort, and clean shelter.'
                  },
                  {
                    key: 'resort',
                    name: 'Effortless Resort Escape',
                    desc: 'Loose, uninhibited outlines styled for complete physical ease, light ocean breezes, and pack-light holidays.'
                  }
                ].map(a => (
                  <button
                    key={a.key}
                    onClick={() => handleSelect('atmosphere', a.key)}
                    className="luxury-glass-panel hover-card-border"
                    style={{
                      padding: '3rem 2rem',
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(255, 248, 244, 0.1)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: 0,
                      color: 'var(--ink)'
                    }}
                  >
                    <span style={{ fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Atmosphere 0{a.key === 'jaipur' ? 1 : a.key === 'monsoon' ? 2 : 3}
                    </span>
                    <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 400, marginBottom: '0.75rem', color: 'var(--ink)' }}>{a.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--taupe)', lineHeight: 1.5, margin: 0 }}>{a.desc}</p>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--taupe)', marginTop: '3rem', borderBottom: '1px solid var(--border-subtle)' }}>
                ← Back
              </button>
            </motion.div>
          )}

          {/* STEP 3: CURATED RESULT EXHIBIT */}
          {step === 3 && (
            <motion.div
              key="step-result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Curated Match
                </span>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2.5rem', fontWeight: 300, color: 'var(--ink)' }}>
                  Your Bespoke <em>Capsule Wardrobe</em>
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--taupe)', maxWidth: '500px', margin: '1rem auto 0', lineHeight: 1.7 }}>
                  Three meticulously selected pieces harmonized in tone, texture, and silhouette to breathe together beautifully.
                </p>
              </div>

              {/* Curated Outfit Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4.5rem' }}>
                {capsuleItems.map((item, idx) => (
                  <div 
                    key={item.slug} 
                    className="luxury-glass-panel"
                    style={{
                      padding: '1.5rem',
                      borderRadius: 0,
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(255, 248, 244, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Image container */}
                      <div style={{ position: 'relative', height: '350px', width: '100%', overflow: 'hidden', marginBottom: '1.25rem' }}>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      
                      {/* Details */}
                      <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                        {item.material}
                      </span>
                      <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 400, color: 'var(--ink)', margin: '0 0 0.5rem', lineHeight: 1.3 }}>
                        {item.name}
                      </h4>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1.5rem' }}>
                      <span style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'var(--rose)', fontWeight: 500 }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {/* Sizing selector */}
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        {['S', 'M', 'L'].map(s => (
                          <button
                            key={s}
                            onClick={() => setSizes(prev => ({ ...prev, [`item${idx}`]: s }))}
                            style={{
                              border: '1px solid var(--border-subtle)',
                              background: (sizes[`item${idx}`] || 'M') === s ? 'var(--ink)' : 'transparent',
                              color: (sizes[`item${idx}`] || 'M') === s ? 'var(--cream)' : 'var(--stone)',
                              fontSize: '0.62rem',
                              padding: '0.2rem 0.5rem',
                              cursor: 'pointer',
                              borderRadius: 0,
                              transition: 'all 0.3s'
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic capsule action bar */}
              <div className="luxury-glass-panel" style={{
                padding: '3rem',
                borderRadius: 0,
                border: '1.5px solid var(--rose)',
                background: 'rgba(201, 146, 122, 0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '2rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>
                    Capsule Price
                  </span>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', color: 'var(--ink)', margin: 0, fontWeight: 300 }}>
                    ₹{subtotal.toLocaleString('en-IN')}
                  </h3>
                  <span style={{ fontSize: '0.68rem', color: 'var(--taupe)' }}>
                    Includes 3 pieces · Complimentary Artisan Packaging & Delivery
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    onClick={resetQuiz}
                    style={{
                      background: 'none',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--stone)',
                      padding: '1rem 2rem',
                      fontFamily: 'var(--sans)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      borderRadius: 0,
                      transition: 'all 0.3s'
                    }}
                    className="hover-bg-stone"
                  >
                    Reset Quiz
                  </button>
                  <button 
                    onClick={handleAddCapsule}
                    className="btn-primary"
                    style={{
                      padding: '1rem 3rem',
                      fontSize: '0.75rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase'
                    }}
                  >
                    Add Capsule to Bag
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </>
  );
}
