'use client';
import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';

// High-Fidelity Weave density interactive Canvas simulation
function WeaveCanvas({ type }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    let mouse = { x: null, y: null };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);
    
    let stepSize = 12;
    let slubs = [];
    let leatherPebbles = [];
    
    if (type === 'linen') {
      stepSize = 14;
      for (let i = 0; i < 40; i++) {
        slubs.push({
          isWarp: Math.random() > 0.5,
          index: Math.floor(Math.random() * 30),
          length: Math.random() * 80 + 30,
          pos: Math.random() * 200,
          thickness: Math.random() * 4 + 2
        });
      }
    } else if (type === 'leather') {
      for (let i = 0; i < 200; i++) {
        leatherPebbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 3 + 1,
          pulseSpeed: Math.random() * 0.02 + 0.005,
          angle: Math.random() * Math.PI * 2
        });
      }
    }
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (type === 'leather') {
        ctx.fillStyle = 'rgba(49, 38, 31, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(158, 139, 124, 0.15)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < leatherPebbles.length; i++) {
          const p = leatherPebbles[i];
          p.angle += p.pulseSpeed;
          const currentRadius = p.r + Math.sin(p.angle) * 0.4;
          
          let scale = 1;
          if (mouse.x && mouse.y) {
            const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            if (dist < 40) {
              scale = 1.3 - (dist / 40) * 0.3;
            }
          }
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(158, 139, 124, ${0.12 * scale})`;
          ctx.fill();
          ctx.stroke();
        }
      } else {
        ctx.lineWidth = 0.8;
        const cols = Math.ceil(width / stepSize) + 1;
        const rows = Math.ceil(height / stepSize) + 1;
        
        for (let c = 0; c < cols; c++) {
          const xBase = c * stepSize;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(158, 139, 124, 0.12)';
          ctx.lineWidth = 2;
          ctx.moveTo(xBase, 0);
          ctx.lineTo(xBase, height);
          ctx.stroke();
        }
        
        for (let r = 0; r < rows; r++) {
          const yBase = r * stepSize;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(158, 139, 124, 0.12)';
          ctx.lineWidth = 2;
          ctx.moveTo(0, yBase);
          ctx.lineTo(width, yBase);
          ctx.stroke();
        }
        
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const x = c * stepSize;
            const y = r * stepSize;
            
            let xOffset = 0;
            let yOffset = 0;
            if (mouse.x && mouse.y) {
              const dist = Math.hypot(x - mouse.x, y - mouse.y);
              if (dist < 50) {
                const angle = Math.atan2(y - mouse.y, x - mouse.x);
                const push = (50 - dist) * 0.15;
                xOffset = Math.cos(angle) * push;
                yOffset = Math.sin(angle) * push;
              }
            }
            
            let weaveOver = false;
            if (type === 'linen' || type === 'cotton' || type === 'tencel') {
              weaveOver = (c + r) % 2 === 0;
            } else if (type === 'silk') {
              weaveOver = (c + r * 4) % 5 === 0;
            } else if (type === 'wool') {
              weaveOver = ((c - r) % 4 === 0 || (c - r) % 4 === 1);
            }
            
            ctx.beginPath();
            if (weaveOver) {
              ctx.strokeStyle = 'var(--rose)';
              ctx.lineWidth = type === 'linen' ? (c % 3 === 0 ? 3.2 : 2.0) : (type === 'tencel' ? 1.2 : 2.5);
              ctx.moveTo(x + xOffset, y - stepSize/2 + yOffset);
              ctx.lineTo(x + xOffset, y + stepSize/2 + yOffset);
            } else {
              ctx.strokeStyle = 'var(--taupe)';
              ctx.lineWidth = type === 'linen' ? (r % 4 === 0 ? 3.0 : 1.8) : (type === 'tencel' ? 1.0 : 2.2);
              ctx.moveTo(x - stepSize/2 + xOffset, y + yOffset);
              ctx.lineTo(x + stepSize/2 + xOffset, y + yOffset);
            }
            ctx.stroke();
          }
        }
        
        if (type === 'linen') {
          ctx.strokeStyle = 'rgba(201, 146, 122, 0.4)';
          slubs.forEach(s => {
            ctx.lineWidth = s.thickness;
            ctx.beginPath();
            if (s.isWarp) {
              const x = s.index * stepSize;
              ctx.moveTo(x, s.pos);
              ctx.lineTo(x, s.pos + s.length);
            } else {
              const y = s.index * stepSize;
              ctx.moveTo(s.pos, y);
              ctx.lineTo(s.pos + s.length, y);
            }
            ctx.stroke();
          });
        }
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [type]);
  
  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'pointer' }} />;
}

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState('description');
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(null);
  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { isAuthenticated, user, token } = useAuth();
  const router = useRouter();
  
  const { scrollY } = useScroll();
  const [showSticky, setShowSticky] = useState(false);

  const getProductImages = () => {
    if (!product) return [];
    let rawImages = [];
    if (Array.isArray(product.images)) {
      rawImages = product.images;
    } else if (product.images && typeof product.images === 'object') {
      rawImages = product.images[selectedColor] || Object.values(product.images)[0] || [];
    }

    // Dynamically upgrade all Unsplash image URLs to high definition (retina-ready w=2048, q=100)
    return rawImages.map(img => {
      if (img && img.includes('unsplash.com')) {
        try {
          const url = new URL(img);
          url.searchParams.set('w', '2048');
          url.searchParams.set('q', '100');
          return url.toString();
        } catch (e) {
          return img.replace(/w=\d+/, 'w=2048').replace(/q=\d+/, 'q=100');
        }
      }
      return img;
    });
  };

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setShowSticky(latest > 600);
    });
  }, [scrollY]);

  useEffect(() => {
    fetch(`/api/products/${slug}`).then(r => r.json()).then(d => {
      setProduct(d.product);
      setReviews(d.reviews || []);
      setRelated(d.related || []);
      setAvgRating(d.avgRating || 0);
      if (d.product?.sizes?.length) setSelectedSize(d.product.sizes[1] || d.product.sizes[0]);
      if (d.product?.colors?.length) setSelectedColor(d.product.colors[0]?.name || '');
    });
  }, [slug]);

  if (!product) return <div style={{ padding: '10rem 4rem', textAlign: 'center', fontFamily: 'var(--serif)', fontSize: '1.2rem', color: 'var(--taupe)' }}>Loading...</div>;

  const handleAdd = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your bag.');
      router.push('/auth');
      return;
    }
    addToCart(product, selectedSize, selectedColor, qty);
    showToast(`${product.name} added to bag`);
  };

  const stars = (r) => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

  const isOliveColor = selectedColor?.toLowerCase() === 'olive';
  const isMidnightBlackColor = selectedColor?.toLowerCase() === 'midnight black';

  let dynamicFilterStyle = {};
  if (isOliveColor) {
    dynamicFilterStyle = { filter: 'sepia(0.55) hue-rotate(65deg) saturate(1.15) brightness(0.85) contrast(1.05)' };
  }

  const getLensFilter = () => {
    if (isOliveColor) return 'sepia(0.55) hue-rotate(65deg) saturate(1.15) brightness(0.85) contrast(1.05)';
    return 'none';
  };

  return (
    <>
      <div className="pd-layout">
        <div className="pd-gallery">
          <div className="pd-thumbs">
            {getProductImages().map((img, i) => (
              <div key={i} className={`pd-thumb ${mainImage === i ? 'active' : ''}`} onClick={() => setMainImage(i)}>
                <Image src={img} alt={`${product.name} ${i + 1}`} fill unoptimized={true} style={{ objectFit: 'cover', ...dynamicFilterStyle }} />
              </div>
            ))}
          </div>
          <motion.div 
            className="pd-main-img"
            transition={{ type: 'tween', duration: 0.4 }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setZoom({ x, y });
            }}
            onMouseLeave={() => setZoom(null)}
            style={{ position: 'relative', overflow: 'hidden', cursor: 'crosshair' }}
          >
            {getProductImages()[mainImage] && (
              <Image src={getProductImages()[mainImage]} alt={product.name} fill unoptimized={true} style={{ objectFit: 'cover', ...dynamicFilterStyle }} priority />
            )}
            
            {/* Fabric Zoom Magnifier Lens */}
            {zoom && getProductImages()[mainImage] && (
              <>
                <div
                  style={{
                    position: 'absolute',
                    left: `${zoom.x}%`,
                    top: `${zoom.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255, 255, 255, 0.7)',
                    pointerEvents: 'none',
                    boxShadow: '0 20px 50px rgba(26, 20, 16, 0.35), inset 0 0 25px rgba(255, 255, 255, 0.25)',
                    backgroundImage: `url(${getProductImages()[mainImage]})`,
                    backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                    backgroundSize: '300%',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 10,
                    filter: getLensFilter(),
                    backdropFilter: 'blur(3px)',
                    transition: 'left 0.12s cubic-bezier(0.215, 0.610, 0.355, 1.000), top 0.12s cubic-bezier(0.215, 0.610, 0.355, 1.000), background-position 0.12s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
                  }}
                >
                  {/* Subtle crosshair indicator */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', top: '0', left: '5px', width: '1px', height: '12px', background: 'rgba(255, 255, 255, 0.5)' }} />
                    <div style={{ position: 'absolute', top: '5px', left: '0', width: '12px', height: '1px', background: 'rgba(255, 255, 255, 0.5)' }} />
                  </div>
                </div>
                
                {/* Floating active watermark */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  background: 'var(--ink)',
                  color: 'var(--cream)',
                  padding: '0.4rem 0.8rem',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  zIndex: 15,
                  border: '1px solid var(--border-subtle)'
                }}>
                  Fabric Zoom 3.0x
                </div>
              </>
            )}
          </motion.div>
        </div>

        <div className="pd-info">
          {product.collection_name && <p className="pd-collection">{product.collection_name}</p>}
          <h1>{product.name}</h1>
          <div className="pd-price">
            {product.original_price && <s>₹{product.original_price.toLocaleString('en-IN')}</s>}
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <div className="pd-material" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <span>{product.material}</span>
            {product.weaveSpecs && (
              <button 
                onClick={() => setIsSpecDrawerOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--rose)',
                  fontFamily: 'var(--sans)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.2rem 0',
                  borderBottom: '1px dashed var(--rose)',
                  fontWeight: 500
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Atelier Weave & Specs
              </button>
            )}
          </div>
          {avgRating > 0 && <div style={{ marginTop: '.5rem', color: 'var(--rose)', fontSize: '.85rem' }}>{stars(avgRating)} <span style={{ color: 'var(--taupe)', fontSize: '.72rem' }}>({reviews.length} reviews)</span></div>}
          <p className="pd-desc">{product.description}</p>

          {product.colors?.length > 0 && (
            <>
              <div style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--taupe)', marginTop: '1.5rem' }}>Color — {selectedColor}</div>
              <div className="pd-colors">
                {product.colors.map((c, i) => (
                  <div key={c.name ? `${c.name}-${i}` : i} className={`pd-color ${selectedColor === c.name ? 'active' : ''}`} onClick={() => { setSelectedColor(c.name); setMainImage(0); }} title={c.name}>
                    <span style={{ background: c.hex }} />
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--taupe)', marginTop: '1.5rem' }}>Size — {selectedSize}</div>
          <div className="pd-sizes">
            {product.sizes?.map(s => (
              <button key={s} className={`pd-size ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
            ))}
          </div>

          <div className="pd-actions">
            <div className="cart-item-qty" style={{ border: '1px solid rgba(158,139,124,.3)', padding: '.2rem' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            <button className="btn-primary" onClick={handleAdd}>Add to Bag</button>
            <button onClick={() => { toggleWishlist(product.id); showToast(isWishlisted(product.id) ? 'Removed from wishlist' : 'Added to wishlist'); }}
              style={{ width: '48px', height: '48px', border: '1px solid rgba(158,139,124,.3)', background: 'none', cursor: 'pointer', fontSize: '1.2rem', color: isWishlisted(product.id) ? 'var(--rose)' : 'var(--taupe)' }}>
              {isWishlisted(product.id) ? '♥' : '♡'}
            </button>
          </div>

          <div className="pd-accordion">
            {[
              { key: 'description', label: 'Description', content: product.description },
              { key: 'fit', label: 'Size & Fit', content: product.fit || 'Please refer to our sizing guide for detailed measurements.' },
              { key: 'care', label: 'Care Instructions', content: product.care || 'Please follow the care label inside the garment.' },
              { key: 'shipping', label: 'Shipping', content: 'Complimentary shipping on orders over ₹4,999. Standard delivery: 5-7 business days. Express delivery: 2-3 business days (₹299).' }
            ].map(a => (
              <div className="pd-accordion-item" key={a.key}>
                <button className="pd-accordion-header" onClick={() => setOpenAccordion(openAccordion === a.key ? '' : a.key)}>
                  {a.label} <span>{openAccordion === a.key ? '−' : '+'}</span>
                </button>
                <div className={`pd-accordion-body ${openAccordion === a.key ? 'open' : ''}`}>{a.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <ScrollReveal>
        <div style={{ padding: '0 4rem 4rem' }}>
          <h2 className="section-title" style={{ marginBottom: '2rem' }}>Customer <em>Reviews</em></h2>
          
          {reviews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
              {reviews.map(r => (
                <div key={r.id} style={{ border: '1px solid rgba(158,139,124,.2)', padding: '1.5rem' }}>
                  <div style={{ color: 'var(--rose)', marginBottom: '.5rem' }}>{stars(r.rating)}</div>
                  <p style={{ fontSize: '.82rem', lineHeight: '1.8', color: 'var(--taupe)' }}>{r.comment}</p>
                  <p style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--stone)', marginTop: '.75rem' }}>— {r.user_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--taupe)', marginBottom: '3rem' }}>No reviews yet. Be the first to review this garment.</p>
          )}

          <div style={{ maxWidth: '600px', borderTop: '1px solid rgba(158,139,124,.2)', paddingTop: '3rem' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.5rem' }}>Write a Review</h3>
            
            {!isAuthenticated ? (
              <div style={{
                padding: '2.5rem',
                border: '1px solid rgba(158, 139, 124, 0.2)',
                background: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.2rem',
                boxShadow: '0 8px 32px 0 rgba(158, 139, 124, 0.05)'
              }}>
                <p style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--taupe)', margin: 0 }}>
                  Share your experience with this artisan piece.
                </p>
                <p style={{ fontFamily: 'var(--sans)', fontSize: '0.75rem', color: 'var(--stone)', letterSpacing: '0.08em', margin: 0 }}>
                  Please sign in to write a review.
                </p>
                <Link href="/auth" className="btn-primary" style={{ marginTop: '0.5rem', textDecoration: 'none', display: 'inline-block', padding: '0.8rem 2.5rem' }}>
                  Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                try {
                  const headers = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  
                  const res = await fetch('/api/reviews', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ product_id: product.id, rating: parseInt(fd.get('rating')), comment: fd.get('comment'), user_name: fd.get('name') })
                  });
                  if (res.ok) {
                    showToast('Review submitted successfully');
                    e.target.reset();
                    fetch(`/api/products/${slug}`).then(r => r.json()).then(d => { setReviews(d.reviews || []); setAvgRating(d.avgRating || 0); });
                  } else {
                    const errData = await res.json();
                    showToast(errData.error || 'Error submitting review');
                  }
                } catch { showToast('Error submitting review'); }
              }}>
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" defaultValue={user?.name || ''} required style={{ width: '100%', padding: '1rem', border: '1px solid rgba(158,139,124,.3)', background: 'transparent' }} />
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Rating</label>
                  <select name="rating" required style={{ width: '100%', padding: '1rem', border: '1px solid rgba(158,139,124,.3)', background: 'transparent', color: 'var(--ink)' }}>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Review</label>
                  <textarea name="comment" required rows="4" style={{ width: '100%', padding: '1rem', border: '1px solid rgba(158,139,124,.3)', background: 'transparent' }}></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>Submit Review</button>
              </form>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* RELATED */}
      {related.length > 0 && (
        <ScrollReveal>
          <div className="section-header"><h2 className="section-title">You May Also <em>Love</em></h2></div>
          <div className="products-grid" style={{ paddingBottom: '4rem' }}>
            {related.map((p, i) => <ProductCard key={p.id} product={p} delay={i * 0.1} />)}
          </div>
        </ScrollReveal>
      )}
      
      {/* STICKY ADD TO CART */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: showSticky ? 0 : "100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        style={{
          position: 'fixed',
          bottom: 0, left: 0, right: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(158,139,124,.2)',
          padding: '1rem 4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {getProductImages()[0] && (
            <img src={getProductImages()[0]} alt={product.name} style={{ width: '40px', height: '50px', objectFit: 'cover' }} />
          )}
          <div>
            <h4 style={{ fontFamily: 'var(--serif)', margin: 0, color: 'var(--ink)' }}>{product.name}</h4>
            <p style={{ margin: 0, fontSize: '.75rem', color: 'var(--stone)' }}>₹{product.price.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn-primary" onClick={handleAdd} style={{ padding: '.8rem 2.5rem' }}>Add to Bag</button>
        </div>
      </motion.div>

      {/* ATELIER WEAVE SPECIFICATION DRAWER */}
      <AnimatePresence>
        {isSpecDrawerOpen && product.weaveSpecs && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSpecDrawerOpen(false)}
              className="cart-overlay open"
              style={{ zIndex: 199 }}
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 170 }}
              className="spec-drawer open"
            >
              <div className="spec-header">
                <h3>Atelier Specification</h3>
                <button className="close-btn" onClick={() => setIsSpecDrawerOpen(false)} aria-label="Close panel">✕</button>
              </div>
              
              <div className="spec-body">
                <p className="spec-section-title">Fabric Weave Simulation</p>
                
                <div className="spec-canvas-container">
                  <WeaveCanvas type={product.weaveSpecs.type} />
                  <span className="spec-canvas-caption">
                    10x Weave Zoom — {product.weaveSpecs.type} Weaving
                  </span>
                </div>
                
                <p className="spec-section-title">Technical Specifications</p>
                <div className="spec-grid-list">
                  <div className="spec-grid-item">
                    <h5>Weave Structure</h5>
                    <p>{product.weaveSpecs.construction}</p>
                  </div>
                  <div className="spec-grid-item">
                    <h5>Yarn Weight / Gauge</h5>
                    <p>{product.weaveSpecs.yarnWeight}</p>
                  </div>
                  <div className="spec-grid-item" style={{ gridColumn: 'span 2' }}>
                    <h5>Fiber Provenance</h5>
                    <p>{product.weaveSpecs.provenance}</p>
                  </div>
                  <div className="spec-grid-item" style={{ gridColumn: 'span 2' }}>
                    <h5>Environmental Standards</h5>
                    <p>{product.weaveSpecs.certification}</p>
                  </div>
                </div>
                
                <p className="spec-section-title">Performance Metrics</p>
                {[
                  { name: 'Thermal Breathability', val: product.weaveSpecs.breathability },
                  { name: 'Drape Fluidity', val: product.weaveSpecs.drape },
                  { name: 'Tactile Softness', val: product.weaveSpecs.softness }
                ].map(bar => (
                  <div key={bar.name} className="spec-performance-bar">
                    <div className="spec-performance-label">
                      <span>{bar.name}</span>
                      <span>{bar.val}%</span>
                    </div>
                    <div className="spec-performance-track">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${bar.val}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        className="spec-performance-fill"
                      />
                    </div>
                  </div>
                ))}
                
                <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: 'rgba(201, 146, 122, 0.03)', border: '1px dashed var(--rose)' }}>
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--rose)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Makers Note
                  </span>
                  <p style={{ fontSize: '0.78rem', color: 'var(--stone)', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                    "{product.weaveSpecs.details}"
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
