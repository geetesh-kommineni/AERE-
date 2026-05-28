'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SizingGuidePage() {
  const [gender, setGender] = useState('women'); // 'women' or 'men'
  const [unit, setUnit] = useState('cm'); // 'cm' or 'in'
  
  // Interactive slider states (defaulting to middle values)
  const [bust, setBust] = useState(88); // Women: Bust (88), Men: Chest (98)
  const [waist, setWaist] = useState(70); // Women: Waist (70), Men: Waist (83)
  const [hips, setHips] = useState(96); // Women: Hips (96), Men: Collar (40)
  const [activeSlider, setActiveSlider] = useState(null); // 'bust' | 'waist' | 'hips'

  // Ranges
  const minCm = {
    women: { bust: 75, waist: 55, hips: 80 },
    men: { bust: 85, waist: 65, hips: 34 } // Collar/Neck ranges 34-48 cm
  };
  const maxCm = {
    women: { bust: 110, waist: 90, hips: 120 },
    men: { bust: 125, waist: 110, hips: 48 }
  };

  const minIn = {
    women: { bust: 29.5, waist: 21.5, hips: 31.5 },
    men: { bust: 33.5, waist: 25.6, hips: 13.4 }
  };
  const maxIn = {
    women: { bust: 43.3, waist: 35.4, hips: 47.2 },
    men: { bust: 49.2, waist: 43.3, hips: 18.9 }
  };

  // Conversions
  const toIn = (cm) => parseFloat((cm / 2.54).toFixed(1));
  const toCm = (inch) => Math.round(inch * 2.54);

  // Toggle gender department and reset slider defaults
  const handleGenderToggle = (newGender) => {
    if (newGender === gender) return;
    if (newGender === 'men') {
      if (unit === 'cm') {
        setBust(98);
        setWaist(83);
        setHips(40); // Collar/Neck
      } else {
        setBust(toIn(98));
        setWaist(toIn(83));
        setHips(toIn(40));
      }
    } else {
      if (unit === 'cm') {
        setBust(88);
        setWaist(70);
        setHips(96); // Hips
      } else {
        setBust(toIn(88));
        setWaist(toIn(70));
        setHips(toIn(96));
      }
    }
    setGender(newGender);
  };

  const handleUnitToggle = (newUnit) => {
    if (newUnit === unit) return;
    if (newUnit === 'in') {
      setBust(toIn(bust));
      setWaist(toIn(waist));
      setHips(toIn(hips));
    } else {
      setBust(toCm(bust));
      setWaist(toCm(waist));
      setHips(toCm(hips));
    }
    setUnit(newUnit);
  };

  // Convert current values to standard cm for internal calculation logic
  const currentBustCm = unit === 'cm' ? bust : toCm(bust);
  const currentWaistCm = unit === 'cm' ? waist : toCm(waist);
  const currentHipsCm = unit === 'cm' ? hips : toCm(hips);

  // Size Matching Logic based on standard AERE parameters
  const calculateSize = () => {
    if (gender === 'women') {
      let score = { XS: 0, S: 0, M: 0, L: 0, XL: 0 };
      
      // Bust scoring
      if (currentBustCm < 80) score.XS += 3;
      else if (currentBustCm <= 84) { score.XS += 3; score.S += 1; }
      else if (currentBustCm <= 88) { score.S += 3; score.XS += 1; score.M += 1; }
      else if (currentBustCm <= 92) { score.M += 3; score.S += 1; score.L += 1; }
      else if (currentBustCm <= 96) { score.L += 3; score.M += 1; score.XL += 1; }
      else { score.XL += 3; score.L += 1; }

      // Waist scoring
      if (currentWaistCm < 62) score.XS += 3;
      else if (currentWaistCm <= 66) { score.XS += 3; score.S += 1; }
      else if (currentWaistCm <= 70) { score.S += 3; score.XS += 1; score.M += 1; }
      else if (currentWaistCm <= 74) { score.M += 3; score.S += 1; score.L += 1; }
      else if (currentWaistCm <= 78) { score.L += 3; score.M += 1; score.XL += 1; }
      else { score.XL += 3; score.L += 1; }

      // Hips scoring
      if (currentHipsCm < 88) score.XS += 3;
      else if (currentHipsCm <= 92) { score.XS += 3; score.S += 1; }
      else if (currentHipsCm <= 96) { score.S += 3; score.XS += 1; score.M += 1; }
      else if (currentHipsCm <= 100) { score.M += 3; score.S += 1; score.L += 1; }
      else if (currentHipsCm <= 104) { score.L += 3; score.M += 1; score.XL += 1; }
      else { score.XL += 3; score.L += 1; }

      let recommended = 'M';
      let highestScore = -1;
      for (const size in score) {
        if (score[size] > highestScore) {
          highestScore = score[size];
          recommended = size;
        }
      }
      return recommended;
    } else {
      // Men's size matching logic (S, M, L, XL, XXL)
      let score = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
      
      // Chest scoring
      if (currentBustCm < 91) score.S += 3;
      else if (currentBustCm <= 96) { score.S += 3; score.M += 1; }
      else if (currentBustCm <= 101) { score.M += 3; score.S += 1; score.L += 1; }
      else if (currentBustCm <= 106) { score.L += 3; score.M += 1; score.XL += 1; }
      else if (currentBustCm <= 111) { score.XL += 3; score.L += 1; score.XXL += 1; }
      else { score.XXL += 3; score.XL += 1; }

      // Waist scoring
      if (currentWaistCm < 76) score.S += 3;
      else if (currentWaistCm <= 81) { score.S += 3; score.M += 1; }
      else if (currentWaistCm <= 86) { score.M += 3; score.S += 1; score.L += 1; }
      else if (currentWaistCm <= 91) { score.L += 3; score.M += 1; score.XL += 1; }
      else if (currentWaistCm <= 96) { score.XL += 3; score.L += 1; score.XXL += 1; }
      else { score.XXL += 3; score.XL += 1; }

      // Collar scoring
      if (currentHipsCm <= 38) score.S += 3;
      else if (currentHipsCm <= 40) { score.M += 3; score.S += 1; score.L += 1; }
      else if (currentHipsCm <= 42) { score.L += 3; score.M += 1; score.XL += 1; }
      else if (currentHipsCm <= 44) { score.XL += 3; score.L += 1; score.XXL += 1; }
      else { score.XXL += 3; score.XL += 1; }

      let recommended = 'M';
      let highestScore = -1;
      for (const size in score) {
        if (score[size] > highestScore) {
          highestScore = score[size];
          recommended = size;
        }
      }
      return recommended;
    }
  };

  const matchedSize = calculateSize();

  const getScale = (type, value) => {
    const minVal = unit === 'cm' ? minCm[gender][type] : minIn[gender][type];
    const maxVal = unit === 'cm' ? maxCm[gender][type] : maxIn[gender][type];
    const percentage = (value - minVal) / (maxVal - minVal || 1);
    return 0.82 + percentage * 0.36; // Scale between 0.82 and 1.18
  };

  const bustScale = getScale('bust', bust);
  const bustX1 = 50 - (gender === 'women' ? 23 : 25) * bustScale;
  const bustX2 = 50 + (gender === 'women' ? 23 : 25) * bustScale;

  const waistScale = getScale('waist', waist);
  const waistX1 = 50 - (gender === 'women' ? 18 : 16) * waistScale;
  const waistX2 = 50 + (gender === 'women' ? 18 : 16) * waistScale;

  const hipsScale = getScale('hips', hips);
  const hipsX1 = 50 - (gender === 'women' ? 24 : 11) * hipsScale;
  const hipsX2 = 50 + (gender === 'women' ? 24 : 11) * hipsScale;

  const getFitDescription = (size) => {
    if (gender === 'women') {
      switch (size) {
        case 'XS':
          return {
            fit: 'Fits petite frames beautifully.',
            advice: 'Perfect for a structured look. Select your standard size. If you prefer a highly fluid, draped flow, consider ordering a size S.',
            tips: 'Pair with our cropped linen trousers or structured silk blouses.'
          };
        case 'S':
          return {
            fit: 'Designed for a slender, tailored fit.',
            advice: 'True to size. Offers an unhurried, comfortable contour. Our standard S offers a relaxed chest outline suitable for everyday movement.',
            tips: 'Looks stunning with high-waisted silk trousers.'
          };
        case 'M':
          return {
            fit: 'Versatile relaxed-fit benchmark.',
            advice: 'Our benchmark medium offers a perfectly balanced silhouette. It breathes well, floats gracefully, and remembers natural lines.',
            tips: 'Highly recommended for our signature wrap dresses.'
          };
        case 'L':
          return {
            fit: 'Tailored drape with sophisticated breathing space.',
            advice: 'If your bust or hip measurement is on the higher end of our scale, our L provides a spacious, elegant look without compromising sleek shoulder seams.',
            tips: 'Pairs beautifully with our linen trench coats.'
          };
        case 'XL':
          return {
            fit: 'Relaxed ease for effortless elegance.',
            advice: 'Designed for ultimate comfort with extra fabric ease. Flows beautifully without clinging, ideal for quiet luxury layering.',
            tips: 'Perfect for our oversized linen tunics and relaxed knitwear.'
          };
        default:
          return { fit: '', advice: '', tips: '' };
      }
    } else {
      // Men's Fit Descriptions
      switch (size) {
        case 'S':
          return {
            fit: 'Tailored shoulder contours and crisp seams.',
            advice: 'Perfect for structured, custom linen shirt fits. Standard collar outline (38cm). If you prefer a relaxed, fluid drape, we recommend choosing size M.',
            tips: 'Looks incredibly sophisticated paired with our ivory natural-dyed linen trousers.'
          };
        case 'M':
          return {
            fit: 'Balanced classic fit and unhurried ease.',
            advice: 'Our benchmark medium offers a tailored armhole placement and an elegant 39-40cm collar outline. Moves with you comfortably.',
            tips: 'A perfect fit for our signature hand-spun cotton shirts.'
          };
        case 'L':
          return {
            fit: 'Broad-shouldered silhouette with luxurious breathing room.',
            advice: 'If your chest measurement borders on the higher end of the scale, our L delivers a powerful drape without slouching seams.',
            tips: 'Ideal for layering with our relaxed organic dye knitwear.'
          };
        case 'XL':
          return {
            fit: 'Generous drape with relaxed chest details.',
            advice: 'Designed for standard comfort and easy layering. Fits a 43-44cm collar comfortably without stiffness.',
            tips: 'Sophisticated when worn loose and open over our hand-woven tank tops.'
          };
        case 'XXL':
          return {
            fit: 'Relaxed oversized luxury.',
            advice: 'Offers ultimate ease and structural drape. Highly spacious across the chest and waist with a 45-46cm collar outline.',
            tips: 'Perfect for weekend lounging in our premium soft cotton co-ords.'
          };
        default:
          return { fit: '', advice: '', tips: '' };
      }
    }
  };

  const activeFit = getFitDescription(matchedSize);

  const curatedProducts = {
    women: [
      {
        name: 'Ivory Linen Dress',
        slug: 'ivory-linen-dress',
        image: '/images/products/ivory-linen-dress.png',
        price: 14990,
        material: '100% Belgian Linen'
      },
      {
        name: 'Dusty Rose Silk Blouse',
        slug: 'dusty-rose-silk-blouse',
        image: '/images/products/dusty-rose-silk-blouse.png',
        price: 12490,
        material: 'Mulberry Silk'
      },
      {
        name: 'Camel Wide-Leg Trousers',
        slug: 'camel-wide-leg-trousers',
        image: '/images/products/camel-wide-leg-trousers.png',
        price: 11990,
        material: 'Organic Cotton'
      }
    ],
    men: [
      {
        name: 'Classic White Oxford Shirt',
        slug: 'mens-white-oxford-shirt',
        image: '/images/aere_premium_white_shirt.png',
        price: 6490,
        material: 'Organic Cotton'
      },
      {
        name: 'Navy Cashmere Sweater',
        slug: 'mens-navy-cashmere-sweater',
        image: '/images/aere_premium_navy_sweater.png',
        price: 18990,
        material: '100% Cashmere'
      },
      {
        name: 'Classic Leather Chelsea Boots',
        slug: 'mens-leather-chelsea-boots',
        image: '/images/aere_single_chelsea_boot.png',
        price: 16990,
        material: 'Italian Calfskin'
      }
    ]
  };

  return (
    <>
      <div className="page-hero">
        <p className="eyebrow" style={{ color: 'var(--rose)' }}>Fit & Sizing</p>
        <h1>Smart Sizing <em>Calculator</em></h1>
        <p>Enter your measurements below for a bespoke fit recommendation. Designed for the unhurried silhouette.</p>
      </div>

      <div className="page-content" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Department Toggles (Women / Men) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
          <button 
            onClick={() => handleGenderToggle('women')} 
            style={{ 
              border: '1px solid var(--border-subtle)',
              background: gender === 'women' ? 'var(--ink)' : 'transparent', 
              color: gender === 'women' ? 'var(--cream)' : 'var(--stone)', 
              cursor: 'pointer', 
              fontFamily: 'var(--sans)', fontSize: '0.82rem', letterSpacing: '.15em', 
              textTransform: 'uppercase', 
              padding: '0.75rem 2.2rem', 
              borderRadius: 0,
              transition: 'all 0.3s'
            }}
          >
            Women&apos;s Edition
          </button>
          <button 
            onClick={() => handleGenderToggle('men')} 
            style={{ 
              border: '1px solid var(--border-subtle)',
              background: gender === 'men' ? 'var(--ink)' : 'transparent', 
              color: gender === 'men' ? 'var(--cream)' : 'var(--stone)', 
              cursor: 'pointer', 
              fontFamily: 'var(--sans)', fontSize: '0.82rem', letterSpacing: '.15em', 
              textTransform: 'uppercase', 
              padding: '0.75rem 2.2rem', 
              borderRadius: 0,
              transition: 'all 0.3s'
            }}
          >
            Men&apos;s Edition
          </button>
        </div>

        {/* INTERACTIVE ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', marginBottom: '8rem' }} className="calculator-layout-wrap">
          
          {/* SLIDERS COLUMN */}
          <div className="luxury-glass-panel" style={{ padding: '3.5rem', borderRadius: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 300 }}>Your Dimensions</h3>
              <div style={{ display: 'inline-flex', background: 'rgba(158,139,124,0.1)', borderRadius: 0, padding: '3px' }}>
                <button 
                  onClick={() => handleUnitToggle('cm')} 
                  style={{ 
                    border: 'none', background: unit === 'cm' ? 'var(--ink)' : 'transparent', 
                    color: unit === 'cm' ? 'var(--cream)' : 'var(--stone)', 
                    padding: '0.4rem 1.2rem', borderRadius: 0, fontSize: '0.65rem', 
                    letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s' 
                  }}
                >
                  CM
                </button>
                <button 
                  onClick={() => handleUnitToggle('in')} 
                  style={{ 
                    border: 'none', background: unit === 'in' ? 'var(--ink)' : 'transparent', 
                    color: unit === 'in' ? 'var(--cream)' : 'var(--stone)', 
                    padding: '0.4rem 1.2rem', borderRadius: 0, fontSize: '0.65rem', 
                    letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s' 
                  }}
                >
                  INCHES
                </button>
              </div>
            </div>

            {/* SLIDER 1: BUST / CHEST */}
            <div 
              style={{ marginBottom: '2.5rem' }}
              onMouseEnter={() => setActiveSlider('bust')}
              onMouseLeave={() => setActiveSlider(null)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--stone)' }}>
                  {gender === 'women' ? 'Bust / Chest' : 'Chest / Width'}
                </label>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--rose)' }}>
                  {bust} <span style={{ fontSize: '0.75rem', color: 'var(--taupe)' }}>{unit}</span>
                </span>
              </div>
              <input 
                type="range" 
                min={unit === 'cm' ? minCm[gender].bust : minIn[gender].bust} 
                max={unit === 'cm' ? maxCm[gender].bust : maxIn[gender].bust} 
                step={unit === 'cm' ? 1 : 0.5}
                value={bust} 
                onChange={(e) => setBust(parseFloat(e.target.value))}
                style={{ 
                  width: '100%', accentColor: 'var(--rose)', cursor: 'pointer', 
                  background: 'var(--border-subtle)', height: '2px', outline: 'none' 
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--taupe)', marginTop: '0.35rem' }}>
                <span>Min: {unit === 'cm' ? minCm[gender].bust : minIn[gender].bust}</span>
                <span>Max: {unit === 'cm' ? maxCm[gender].bust : maxIn[gender].bust}</span>
              </div>
            </div>

            {/* SLIDER 2: WAIST */}
            <div 
              style={{ marginBottom: '2.5rem' }}
              onMouseEnter={() => setActiveSlider('waist')}
              onMouseLeave={() => setActiveSlider(null)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--stone)' }}>
                  {gender === 'women' ? 'Natural Waist' : 'Waistline'}
                </label>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--rose)' }}>
                  {waist} <span style={{ fontSize: '0.75rem', color: 'var(--taupe)' }}>{unit}</span>
                </span>
              </div>
              <input 
                type="range" 
                min={unit === 'cm' ? minCm[gender].waist : minIn[gender].waist} 
                max={unit === 'cm' ? maxCm[gender].waist : maxIn[gender].waist} 
                step={unit === 'cm' ? 1 : 0.5}
                value={waist} 
                onChange={(e) => setWaist(parseFloat(e.target.value))}
                style={{ 
                  width: '100%', accentColor: 'var(--rose)', cursor: 'pointer', 
                  background: 'var(--border-subtle)', height: '2px', outline: 'none' 
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--taupe)', marginTop: '0.35rem' }}>
                <span>Min: {unit === 'cm' ? minCm[gender].waist : minIn[gender].waist}</span>
                <span>Max: {unit === 'cm' ? maxCm[gender].waist : maxIn[gender].waist}</span>
              </div>
            </div>

            {/* SLIDER 3: HIPS / COLLAR */}
            <div 
              style={{ marginBottom: '1.5rem' }}
              onMouseEnter={() => setActiveSlider('hips')}
              onMouseLeave={() => setActiveSlider(null)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--stone)' }}>
                  {gender === 'women' ? 'Fullest Hips' : 'Collar / Neck'}
                </label>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--rose)' }}>
                  {hips} <span style={{ fontSize: '0.75rem', color: 'var(--taupe)' }}>{unit}</span>
                </span>
              </div>
              <input 
                type="range" 
                min={unit === 'cm' ? minCm[gender].hips : minIn[gender].hips} 
                max={unit === 'cm' ? maxCm[gender].hips : maxIn[gender].hips} 
                step={unit === 'cm' ? 1 : 0.5}
                value={hips} 
                onChange={(e) => setHips(parseFloat(e.target.value))}
                style={{ 
                  width: '100%', accentColor: 'var(--rose)', cursor: 'pointer', 
                  background: 'var(--border-subtle)', height: '2px', outline: 'none' 
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'var(--taupe)', marginTop: '0.35rem' }}>
                <span>Min: {unit === 'cm' ? minCm[gender].hips : minIn[gender].hips}</span>
                <span>Max: {unit === 'cm' ? maxCm[gender].hips : maxIn[gender].hips}</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC RECOMMENDED SIZE DISPLAY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="luxury-glass-panel" style={{ flex: 1, padding: '3.5rem', borderRadius: 0, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--taupe)' }}>
                Bespoke Match
              </div>

              <div style={{ margin: '2rem 0' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${gender}-${matchedSize}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h2 style={{ fontFamily: 'var(--serif)', fontSize: '8rem', fontWeight: 300, color: 'var(--ink)', lineHeight: 1, margin: 0 }}>
                      {matchedSize}
                    </h2>
                  </motion.div>
                </AnimatePresence>
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rose)', marginTop: '-1rem' }}>
                  Recommended Size
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${gender}-${matchedSize}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  style={{ textAlign: 'left', marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '2rem' }}
                >
                  <p style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>
                    {activeFit.fit}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {activeFit.advice}
                  </p>
                  <div style={{ background: 'rgba(201, 146, 122, 0.04)', padding: '1rem', borderLeft: '2px solid var(--rose)' }}>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', color: 'var(--rose)', marginBottom: '0.25rem' }}>
                      Styling Note
                    </span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--stone)', fontStyle: 'italic', margin: 0 }}>
                      {activeFit.tips}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* MINIMALIST DRESS FORM VISUALIZER */}
            <div className="luxury-glass-panel" style={{ height: '220px', borderRadius: 0, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', position: 'relative' }}>
              <svg width="100" height="180" viewBox="0 0 100 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'all 0.3s' }}>
                <defs>
                  <filter id="mannequin-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Stand / Hanger */}
                <path d="M50 10V180M50 170L30 180H70L50 170" stroke="var(--taupe)" strokeWidth="1" strokeLinecap="round" opacity="0.3"/>
                <circle cx="50" cy="10" r="4" stroke="var(--taupe)" strokeWidth="1" opacity="0.3"/>
                
                {/* Mannequin Outline (Dynamic Gender Outline with breathing animations) */}
                <AnimatePresence mode="wait">
                  {gender === 'women' ? (
                    <motion.path 
                      key="mannequin-female"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ 
                        opacity: activeSlider ? 0.35 : 0.8,
                        scale: [0.98, 1.02, 0.98],
                        y: [0, -2, 0]
                      }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ 
                        scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.3 }
                      }}
                      d="M33 30C36 30 40 32 50 32C60 32 64 30 67 30C71 30 73 34 72 40C70 52 74 65 74 80C74 100 66 115 62 135C58 148 56 160 56 160H44C44 160 42 148 38 135C34 115 26 100 26 80C26 65 30 52 28 40C27 34 29 30 33 30Z" 
                      stroke="var(--stone)" 
                      strokeWidth="1.2" 
                      style={{ fill: 'none', transformOrigin: '50% 50%' }}
                    />
                  ) : (
                    <motion.path 
                      key="mannequin-male"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ 
                        opacity: activeSlider ? 0.35 : 0.8,
                        scale: [0.98, 1.02, 0.98],
                        y: [0, -2, 0]
                      }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ 
                        scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 0.3 }
                      }}
                      d="M30 25C34 25 38 27 50 27C62 27 66 25 70 25C75 25 78 30 76 38C74 52 76 68 76 82C76 100 70 115 66 135C62 148 60 160 60 160H40C40 160 38 148 34 135C30 115 24 100 24 82C24 68 26 52 24 38C22 30 25 25 30 25Z" 
                      stroke="var(--stone)" 
                      strokeWidth="1.2" 
                      style={{ fill: 'none', transformOrigin: '50% 50%' }}
                    />
                  )}
                </AnimatePresence>

                {/* Interactive Dynamic Highlights */}
                
                {/* BUST / CHEST LINE */}
                <motion.line 
                  x1={bustX1} 
                  y1="65" 
                  x2={bustX2} 
                  y2="65" 
                  stroke={activeSlider === 'bust' ? 'var(--rose)' : 'var(--stone)'} 
                  strokeWidth={activeSlider === 'bust' ? '3' : '0.8'}
                  opacity={activeSlider && activeSlider !== 'bust' ? 0.15 : 0.9}
                  filter={activeSlider === 'bust' ? 'url(#mannequin-glow)' : 'none'}
                  animate={{
                    stroke: activeSlider === 'bust' ? 'var(--rose)' : 'var(--stone)',
                    strokeWidth: activeSlider === 'bust' ? 3.5 : 0.8,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
                
                {/* WAIST LINE */}
                <motion.line 
                  x1={waistX1} 
                  y1="95" 
                  x2={waistX2} 
                  y2="95" 
                  stroke={activeSlider === 'waist' ? 'var(--rose)' : 'var(--stone)'} 
                  strokeWidth={activeSlider === 'waist' ? '3' : '0.8'}
                  opacity={activeSlider && activeSlider !== 'waist' ? 0.15 : 0.9}
                  filter={activeSlider === 'waist' ? 'url(#mannequin-glow)' : 'none'}
                  animate={{
                    stroke: activeSlider === 'waist' ? 'var(--rose)' : 'var(--stone)',
                    strokeWidth: activeSlider === 'waist' ? 3.5 : 0.8,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
                
                {/* HIPS (Y=125) OR COLLAR (Y=38) LINE */}
                {gender === 'women' ? (
                  <motion.line 
                    x1={hipsX1} 
                    y1="125" 
                    x2={hipsX2} 
                    y2="125" 
                    stroke={activeSlider === 'hips' ? 'var(--rose)' : 'var(--stone)'} 
                    strokeWidth={activeSlider === 'hips' ? '3' : '0.8'}
                    opacity={activeSlider && activeSlider !== 'hips' ? 0.15 : 0.9}
                    filter={activeSlider === 'hips' ? 'url(#mannequin-glow)' : 'none'}
                    animate={{
                      stroke: activeSlider === 'hips' ? 'var(--rose)' : 'var(--stone)',
                      strokeWidth: activeSlider === 'hips' ? 3.5 : 0.8,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                ) : (
                  <motion.line 
                    x1={hipsX1} 
                    y1="38" 
                    x2={hipsX2} 
                    y2="38" 
                    stroke={activeSlider === 'hips' ? 'var(--rose)' : 'var(--stone)'} 
                    strokeWidth={activeSlider === 'hips' ? '3' : '0.8'}
                    opacity={activeSlider && activeSlider !== 'hips' ? 0.15 : 0.9}
                    filter={activeSlider === 'hips' ? 'url(#mannequin-glow)' : 'none'}
                    animate={{
                      stroke: activeSlider === 'hips' ? 'var(--rose)' : 'var(--stone)',
                      strokeWidth: activeSlider === 'hips' ? 3.5 : 0.8,
                    }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                )}
              </svg>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--taupe)', display: 'block', marginBottom: '0.5rem' }}>
                  Visualization Form
                </span>
                <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.15rem', color: 'var(--ink)', fontWeight: 400, marginBottom: '0.5rem' }}>
                  {activeSlider ? `${activeSlider === 'hips' && gender === 'men' ? 'collar' : activeSlider.toUpperCase()} highlight` : 'AÉRE Silhouette'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--taupe)', lineHeight: 1.5, margin: 0 }}>
                  {activeSlider === 'bust' && (gender === 'women' ? 'Measuring around the fullest part of your bust, parallel to the ground.' : 'Measuring around the widest part of your chest, keeping tape snug under armpits.')}
                  {activeSlider === 'waist' && (gender === 'women' ? 'Measuring around your natural narrow waist, above the belly button.' : 'Measuring around your natural waistline, typically where trousers sit.')}
                  {activeSlider === 'hips' && (gender === 'women' ? 'Measuring around the widest point of your hips, roughly 20cm below waist.' : 'Measuring around the base of your neck where shirt collar sits comfortably.')}
                  {!activeSlider && 'Hover over or drag a slider to highlight the measurement points on our mannequin form.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CURATED SHOPPING FUNNEL */}
        <div style={{ marginBottom: '8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '6rem' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', fontWeight: 300, textAlign: 'center', marginBottom: '1rem' }}>
            Curated in Size <em>{matchedSize}</em>
          </h3>
          <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--taupe)', textTransform: 'uppercase', letterSpacing: '0.15em', textAlign: 'center', marginBottom: '4rem' }}>
            Bespoke recommendations selected for your silhouette and fit profile
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {curatedProducts[gender].map((item) => (
              <Link 
                href={`/products/${item.slug}`} 
                key={item.slug} 
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div style={{
                  padding: '1.5rem',
                  borderRadius: 0,
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(255, 248, 244, 0.15)',
                  transition: 'all 0.3s'
                }}
                className="hover-card-border"
                >
                  {/* Image container */}
                  <div style={{
                    position: 'relative',
                    height: '350px',
                    width: '100%',
                    overflow: 'hidden',
                    marginBottom: '1.25rem'
                  }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s'
                      }}
                      className="hover-scale-img"
                    />
                  </div>
                  {/* Details */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontFamily: 'var(--sans)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--ink)', margin: '0 0 0.25rem' }}>{item.name}</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--taupe)', fontFamily: 'var(--sans)' }}>{item.material}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--rose)', fontWeight: 500 }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ACCORDION HOW-TO */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 300, marginBottom: '2.5rem', textAlign: 'center' }}>
          How to measure <em>yourself</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '6rem' }}>
          <div className="luxury-glass-panel" style={{ padding: '2rem 2.5rem', borderRadius: 0 }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.75rem' }}>Step 01</span>
            <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '0.75rem' }}>Bust & Chest</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.7, margin: 0 }}>
              Thread a soft measuring tape under your arms, across your shoulder blades, and over the fullest part of your chest. Breathe naturally, keeping the tape comfortably snug but never tight.
            </p>
          </div>
          <div className="luxury-glass-panel" style={{ padding: '2rem 2.5rem', borderRadius: 0 }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.75rem' }}>Step 02</span>
            <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '0.75rem' }}>Natural Waist</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.7, margin: 0 }}>
              Find the narrowest part of your waistline, which typically sits just above your belly button and below your ribcage. Stand tall, relax your muscles, and measure without drawing the tape tight.
            </p>
          </div>
          <div className="luxury-glass-panel" style={{ padding: '2rem 2.5rem', borderRadius: 0 }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.75rem' }}>Step 03</span>
            <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '0.75rem' }}>{gender === 'women' ? 'Fullest Hips' : 'Collar / Neck'}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.7, margin: 0 }}>
              {gender === 'women' 
                ? 'Stand with your feet together on a flat surface. Wrap the measuring tape around the fullest, widest part of your hips and buttocks (usually about 18–22cm below your natural waistline).'
                : 'Wrap the tape around the base of your neck where the shirt collar sits. Place two fingers under the tape to ensure a comfortable breathing space.'}
            </p>
          </div>
          <div className="luxury-glass-panel" style={{ padding: '2rem 2.5rem', borderRadius: 0 }}>
            <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.75rem' }}>Step 04</span>
            <h4 style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', fontWeight: 400, color: 'var(--ink)', marginBottom: '0.75rem' }}>Need Consultation?</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--stone)', lineHeight: 1.7, margin: 0 }}>
              If you fall between sizes or have custom proportions, our Jaipur sizing artisans are happy to tailor a bespoke piece. Write to us at <a href="mailto:hello@aere.in" style={{ color: 'var(--rose)', borderBottom: '1px solid var(--rose)', fontWeight: 500 }}>hello@aere.in</a>.
            </p>
          </div>
        </div>

        {/* STANDARD TABLES FOR SEO & STRUCTURE */}
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 300, marginBottom: '2rem', textAlign: 'center' }}>
          Standard Size <em>Charts</em>
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem', marginBottom: '5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, marginBottom: '1.5rem', color: 'var(--ink)' }}>Women&apos;s Clothing</h3>
            <table className="size-table">
              <thead><tr><th>Size</th><th>Bust (cm)</th><th>Waist (cm)</th><th>Hips (cm)</th><th>UK Size</th></tr></thead>
              <tbody>
                <tr style={{ background: gender === 'women' && matchedSize === 'XS' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'women' && matchedSize === 'XS' ? '600' : '400' }}><td>XS</td><td>80-84</td><td>62-66</td><td>88-92</td><td>6-8</td></tr>
                <tr style={{ background: gender === 'women' && matchedSize === 'S' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'women' && matchedSize === 'S' ? '600' : '400' }}><td>S</td><td>84-88</td><td>66-70</td><td>92-96</td><td>8-10</td></tr>
                <tr style={{ background: gender === 'women' && matchedSize === 'M' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'women' && matchedSize === 'M' ? '600' : '400' }}><td>M</td><td>88-92</td><td>70-74</td><td>96-100</td><td>10-12</td></tr>
                <tr style={{ background: gender === 'women' && matchedSize === 'L' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'women' && matchedSize === 'L' ? '600' : '400' }}><td>L</td><td>92-96</td><td>74-78</td><td>100-104</td><td>12-14</td></tr>
                <tr style={{ background: gender === 'women' && matchedSize === 'XL' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'women' && matchedSize === 'XL' ? '600' : '400' }}><td>XL</td><td>96-102</td><td>78-84</td><td>104-110</td><td>14-16</td></tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.4rem', fontWeight: 400, marginBottom: '1.5rem', color: 'var(--ink)' }}>Men&apos;s Clothing</h3>
            <table className="size-table">
              <thead><tr><th>Size</th><th>Chest (cm)</th><th>Waist (cm)</th><th>Neck (cm)</th><th>UK/US Size</th></tr></thead>
              <tbody>
                <tr style={{ background: gender === 'men' && matchedSize === 'S' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'men' && matchedSize === 'S' ? '600' : '400' }}><td>S</td><td>91-96</td><td>76-81</td><td>38</td><td>36-38</td></tr>
                <tr style={{ background: gender === 'men' && matchedSize === 'M' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'men' && matchedSize === 'M' ? '600' : '400' }}><td>M</td><td>96-101</td><td>81-86</td><td>39-40</td><td>38-40</td></tr>
                <tr style={{ background: gender === 'men' && matchedSize === 'L' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'men' && matchedSize === 'L' ? '600' : '400' }}><td>L</td><td>101-106</td><td>86-91</td><td>41-42</td><td>40-42</td></tr>
                <tr style={{ background: gender === 'men' && matchedSize === 'XL' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'men' && matchedSize === 'XL' ? '600' : '400' }}><td>XL</td><td>106-111</td><td>91-96</td><td>43-44</td><td>42-44</td></tr>
                <tr style={{ background: gender === 'men' && matchedSize === 'XXL' ? 'rgba(201, 146, 122, 0.08)' : 'transparent', fontWeight: gender === 'men' && matchedSize === 'XXL' ? '600' : '400' }}><td>XXL</td><td>111-116</td><td>96-101</td><td>45-46</td><td>44-46</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fit Philosophy Notes */}
        <div className="info-grid" style={{ marginBottom: '6rem' }}>
          <div className="info-card" style={{ borderRadius: 0 }}><h3>Relaxed Fit</h3><p>Our linen pieces and co-ords are designed with extra ease. If between sizes, size down for a more tailored look.</p></div>
          <div className="info-card" style={{ borderRadius: 0 }}><h3>Tailored Fit</h3><p>Silk blouses and trousers follow a more structured fit. We recommend your true size for these pieces.</p></div>
          <div className="info-card" style={{ borderRadius: 0 }}><h3>Knitwear</h3><p>Our cashmere and wool knits have natural stretch. Size down for a closer fit, or take your usual size for oversized styling.</p></div>
          <div className="info-card" style={{ borderRadius: 0 }}><h3>Sustainability Focus</h3><p>Handcrafting to order prevents inventory overheads and textile waste. Knowing your perfect fit helps us maintain zero waste.</p></div>
        </div>
      </div>
    </>
  );
}
