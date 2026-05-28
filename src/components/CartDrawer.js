'use client';
import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const FREE_SHIPPING_THRESHOLD = 5000;

function ShippingProgress({ subtotal }) {
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const isFree = remaining <= 0;

  return (
    <div className="shipping-progress-wrap">
      <div className="shipping-progress-label">
        {isFree ? (
          <span>✓ You've unlocked complimentary shipping</span>
        ) : (
          <>
            <span>₹{remaining.toLocaleString('en-IN')} away from free shipping</span>
          </>
        )}
      </div>
      <div className="shipping-progress-track">
        <div
          className="shipping-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, subtotal, shipping, total, isDrawerOpen, setIsDrawerOpen } = useCart();
  const [giftWrap, setGiftWrap] = useState(false);

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const isGiftWrapEligible = subtotal >= 5000;

  useEffect(() => {
    if (subtotal < 5000 && giftWrap) {
      setGiftWrap(false);
    }
  }, [subtotal, giftWrap]);

  return (
    <>
      <div className={`cart-overlay ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(false)} />
      <div className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Bag {itemCount > 0 && <span style={{ fontSize: '.75rem', fontWeight: 300, color: 'var(--taupe)', fontFamily: 'var(--sans)', letterSpacing: '.08em' }}>({itemCount})</span>}</h3>
          <button className="close-btn" onClick={() => setIsDrawerOpen(false)} aria-label="Close bag">✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.3 }}>♢</div>
              Your bag is beautifully empty.
              <div style={{ fontSize: '.7rem', fontStyle: 'normal', fontFamily: 'var(--sans)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: '1.5rem' }}>
                <Link href="/collections" onClick={() => setIsDrawerOpen(false)} style={{ color: 'var(--rose)', textDecoration: 'none', borderBottom: '1px solid var(--rose)', paddingBottom: '2px' }}>
                  Explore Collections
                </Link>
              </div>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.key}>
                <div className="cart-item-img">
                  {item.image && <Image src={item.image} alt={item.name} fill sizes="80px" style={{ objectFit: 'cover' }} />}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-detail">
                    {item.size && `Size: ${item.size}`}
                    {item.size && item.color && ' · '}
                    {item.color && `Color: ${item.color}`}
                  </div>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity">+</button>
                  </div>
                  <div className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  <button className="cart-item-remove" onClick={() => removeFromCart(item.key)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          {cart.length > 0 && <ShippingProgress subtotal={subtotal} />}

          {/* Artisan Gift Wrapping Selection */}
          {cart.length > 0 && (
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '1.25rem 0',
              margin: '1rem 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                cursor: isGiftWrapEligible ? 'pointer' : 'not-allowed',
                opacity: isGiftWrapEligible ? 1 : 0.6,
                userSelect: 'none'
              }}>
                <input
                  type="checkbox"
                  checked={giftWrap}
                  disabled={!isGiftWrapEligible}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  style={{
                    marginTop: '0.15rem',
                    accentColor: 'var(--rose)',
                    cursor: isGiftWrapEligible ? 'pointer' : 'not-allowed'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.05em',
                    fontWeight: 500,
                    color: 'var(--ink)',
                    display: 'block'
                  }}>
                    Artisan Gift Wrapping
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--stone)',
                    lineHeight: 1.4,
                    display: 'block',
                    marginTop: '0.2rem'
                  }}>
                    {isGiftWrapEligible 
                      ? "Complimentary Jaipur cotton paper & hand-tied dried botanical twig."
                      : `Add ₹${(5000 - subtotal).toLocaleString('en-IN')} more to unlock complimentary artisan packaging.`
                    }
                  </span>
                </div>
              </label>

              {/* Gift Wrap Micro-Animation */}
              {giftWrap && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(201, 146, 122, 0.05)',
                    padding: '0.75rem',
                    border: '1px dashed var(--rose)',
                    marginTop: '0.25rem',
                    gap: '1rem'
                  }}
                >
                  <svg width="50" height="35" viewBox="0 0 50 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="12" y="10" width="26" height="20" stroke="var(--stone)" strokeWidth="1" fill="none" opacity="0.3" />
                    <motion.path
                      d="M12 20H38"
                      stroke="var(--rose)"
                      strokeWidth="1.2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.path
                      d="M25 10V30"
                      stroke="var(--rose)"
                      strokeWidth="1.2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    />
                    <motion.path
                      d="M25 10C17 2 17 6 25 10C33 2 33 6 25 10"
                      stroke="var(--rose)"
                      strokeWidth="1.2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    />
                  </svg>
                  <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--rose)', fontWeight: 500 }}>
                    Artisan Box Prepared
                  </span>
                </motion.div>
              )}
            </div>
          )}

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span>
          </div>
          <div className="cart-total">
            <span>Total</span>
            <strong>₹{total.toLocaleString('en-IN')}</strong>
          </div>
          <Link href="/checkout" className="checkout-btn" onClick={() => setIsDrawerOpen(false)}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </>
  );
}
