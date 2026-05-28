'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function CheckoutPage() {
  const { cart, subtotal, shipping, total } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const { clearCart } = useCart();
  const { isAuthenticated, token, loading, user } = useAuth();
  
  // Basic Form Steps
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  
  // Payment States
  const [payMethod, setPayMethod] = useState('cod');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [biometricState, setBiometricState] = useState('idle'); // idle | scanning | success
  
  // Promo States
  const [promoInput, setPromoInput] = useState('');
  const [activePromo, setActivePromo] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);

  // Authenticated Check & Populate
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        showToast('Please sign in to complete checkout.');
        router.push('/auth');
      } else if (user?.email && !form.email) {
        setForm(f => ({ ...f, email: user.email, name: user.name || f.name }));
      }
    }
  }, [loading, isAuthenticated, user, router, showToast, form.email]);

  // UPI Timer logic
  useEffect(() => {
    let interval = null;
    if (payMethod === 'upi' && step === 3) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            showToast('UPI Session expired. Please re-initiate payment.');
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(300);
    }
    return () => clearInterval(interval);
  }, [payMethod, step]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Card validation helpers
  const getCardType = (num) => {
    const cleanNum = num.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(cleanNum)) return 'Mastercard';
    if (/^3[47]/.test(cleanNum)) return 'American Express';
    return 'Atelier';
  };

  const getCardThemeGradient = (num) => {
    const type = getCardType(num);
    if (type === 'Visa') return 'linear-gradient(135deg, #132247 0%, #15100d 100%)';
    if (type === 'Mastercard') return 'linear-gradient(135deg, #421118 0%, #15100d 100%)';
    if (type === 'American Express') return 'linear-gradient(135deg, #0c3329 0%, #15100d 100%)';
    return 'linear-gradient(135deg, #2b201a 0%, #15100d 100%)';
  };

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  
  const updateCard = (k, v) => {
    let val = v;
    if (k === 'number') val = formatCardNumber(v);
    if (k === 'expiry') val = formatExpiry(v);
    setCard(p => ({ ...p, [k]: val }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length > 0 ? parts.join(' ') : v;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  // Promo handling
  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    
    if (code === 'AERE10') {
      setActivePromo(code);
      setDiscountPercent(10);
      showToast('Salon Code Applied: 10% Off');
    } else if (code === 'ATELIER20') {
      setActivePromo(code);
      setDiscountPercent(20);
      showToast('Atelier Code Applied: 20% Off');
    } else if (code === 'VIP50') {
      setActivePromo(code);
      setDiscountPercent(50);
      showToast('VIP Privilege Applied: 50% Off');
    } else {
      showToast('Invalid Salon Code');
    }
  };

  const handleRemovePromo = () => {
    setActivePromo('');
    setDiscountPercent(0);
    setPromoInput('');
    showToast('Promo Code Removed');
  };

  // Step Nav validation
  const handleContactNext = () => {
    if (!form.email || !form.email.includes('@')) {
      return showToast('Please enter a valid email containing @');
    }
    if (!/^\d{10}$/.test(form.phone)) {
      return showToast('Phone number must be exactly 10 digits');
    }
    setStep(2);
  };

  const handleShippingNext = () => {
    if (!form.name.trim()) return showToast('Full Name is required');
    if (!form.address.trim()) return showToast('Address is required');
    if (!form.city.trim()) return showToast('City is required');
    if (!form.state.trim()) return showToast('State is required');
    if (!form.pincode.trim() || !/^\d+$/.test(form.pincode)) return showToast('Pincode is required and must be numeric');
    
    setStep(3);
  };

  // Express Biometric scanning trigger
  const handleBiometricPay = () => {
    setBiometricState('scanning');
    setTimeout(() => {
      setBiometricState('success');
      setTimeout(async () => {
        await handlePlaceOrder();
      }, 1000);
    }, 2000);
  };

  // Discount calculation
  const discountVal = Math.round(subtotal * (discountPercent / 100));
  const finalSubtotal = subtotal - discountVal;
  const finalShipping = finalSubtotal >= 4999 ? 0 : 299;
  const finalTotal = finalSubtotal + finalShipping;

  const handlePlaceOrder = async () => {
    if (payMethod === 'card') {
      const cleanNum = card.number.replace(/\s/g, '');
      if (cleanNum.length !== 16 || !/^\d+$/.test(cleanNum)) {
        return showToast('Please enter a valid 16-digit card number');
      }
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
        return showToast('Please enter expiry date in MM/YY format');
      }
      const [month, year] = card.expiry.split('/');
      const m = parseInt(month);
      if (m < 1 || m > 12) {
        return showToast('Expiry month must be between 01 and 12');
      }
      if (card.cvv.length < 3 || card.cvv.length > 4 || !/^\d+$/.test(card.cvv)) {
        return showToast('Please enter a valid 3 or 4-digit CVV');
      }
      if (!card.name.trim()) {
        return showToast('Cardholder name is required');
      }
    }

    if (payMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        return showToast('Please enter a valid UPI ID (e.g. user@okaxis)');
      }
    }

    setIsProcessing(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cart,
          shipping: { name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, state: form.state, pincode: form.pincode },
          email: form.email,
          payment_method: payMethod === 'biometric' ? 'AÉRE Express Pay' : payMethod,
          promo_code: activePromo || null
        })
      });
      const data = await res.json();
      if (res.ok && data.order) {
        clearCart();
        router.push(`/order-confirmation?id=${data.order.id}`);
      } else {
        showToast(data.error || 'Failed to place order');
        setIsProcessing(false);
      }
    } catch {
      showToast('An error occurred while placing order');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) return (
    <div className="confirm-wrap">
      <h1>Your bag is empty</h1>
      <p>Add some beautiful pieces before checking out.</p>
      <a href="/products" className="btn-primary" style={{ marginTop: '2rem' }}>Shop Now</a>
    </div>
  );

  return (
    <div className="checkout-layout">
      <div>
        <div className="checkout-steps">
          <button className={`checkout-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`} onClick={() => setStep(1)}>1. Contact</button>
          <button className={`checkout-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`} onClick={() => step > 1 && setStep(2)}>2. Shipping</button>
          <button className={`checkout-step ${step >= 3 ? 'active' : ''}`} disabled>3. Payment</button>
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '2rem' }}>Contact Information</h2>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="10-digit mobile number" maxLength="10" />
            </div>
            <button className="btn-primary" onClick={handleContactNext}>Continue to Shipping</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '2rem' }}>Shipping Address</h2>
            <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={e => update('name', e.target.value)} /></div>
            <div className="form-group"><label>Address *</label><input value={form.address} onChange={e => update('address', e.target.value)} /></div>
            <div className="form-row">
              <div className="form-group"><label>City *</label><input value={form.city} onChange={e => update('city', e.target.value)} /></div>
              <div className="form-group"><label>State *</label><input value={form.state} onChange={e => update('state', e.target.value)} /></div>
            </div>
            <div className="form-group"><label>Pincode *</label><input value={form.pincode} onChange={e => update('pincode', e.target.value)} maxLength="6" /></div>
            <button className="btn-primary" onClick={handleShippingNext}>Continue to Payment</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 300, marginBottom: '2rem' }}>Review & Place Order</h2>
            
            <div style={{ padding: '2.5rem', border: '1px solid rgba(158,139,124,.2)', background: '#16120f', color: '#faf7f3', marginBottom: '2rem' }}>
              <p style={{ fontFamily: 'var(--sans)', color: '#ffffff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Delivery Details</p>
              
              <div style={{ display: 'grid', gap: '0.75rem', fontFamily: 'var(--sans)', color: '#dbd2c9', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
                <div><strong style={{ color: '#d69f87', fontWeight: 500 }}>Name:</strong> {form.name}</div>
                <div><strong style={{ color: '#d69f87', fontWeight: 500 }}>Email:</strong> {form.email}</div>
                <div><strong style={{ color: '#d69f87', fontWeight: 500 }}>Phone:</strong> {form.phone}</div>
                <div><strong style={{ color: '#d69f87', fontWeight: 500 }}>Address:</strong> {form.address}, {form.city}, {form.state} — {form.pincode}</div>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(158,139,124,.15)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--sans)', color: '#ffffff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Payment Method</p>
                
                {/* Method selector tabs */}
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid rgba(158,139,124,.15)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    onClick={() => setPayMethod('cod')} 
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--sans)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: '0.5rem 0',
                      color: payMethod === 'cod' ? 'var(--ink)' : 'var(--taupe)',
                      borderBottom: payMethod === 'cod' ? '2px solid var(--rose)' : '2px solid transparent',
                      fontWeight: payMethod === 'cod' ? '600' : '400',
                      transition: 'all 0.3s'
                    }}
                  >
                    Cash on Delivery
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPayMethod('card')} 
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--sans)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: '0.5rem 0',
                      color: payMethod === 'card' ? 'var(--ink)' : 'var(--taupe)',
                      borderBottom: payMethod === 'card' ? '2px solid var(--rose)' : '2px solid transparent',
                      fontWeight: payMethod === 'card' ? '600' : '400',
                      transition: 'all 0.3s'
                    }}
                  >
                    Credit / Debit Card
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPayMethod('upi')} 
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--sans)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: '0.5rem 0',
                      color: payMethod === 'upi' ? 'var(--ink)' : 'var(--taupe)',
                      borderBottom: payMethod === 'upi' ? '2px solid var(--rose)' : '2px solid transparent',
                      fontWeight: payMethod === 'upi' ? '600' : '400',
                      transition: 'all 0.3s'
                    }}
                  >
                    UPI QR Code
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setPayMethod('biometric')} 
                    style={{
                      background: 'none',
                      border: 'none',
                      fontFamily: 'var(--sans)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: '0.5rem 0',
                      color: payMethod === 'biometric' ? 'var(--ink)' : 'var(--taupe)',
                      borderBottom: payMethod === 'biometric' ? '2px solid var(--rose)' : '2px solid transparent',
                      fontWeight: payMethod === 'biometric' ? '600' : '400',
                      transition: 'all 0.3s'
                    }}
                  >
                    AÉRE Biometric Pay
                  </button>
                </div>

                {payMethod === 'cod' && (
                  <p style={{ fontFamily: 'var(--sans)', color: '#dbd2c9', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                    Cash on Delivery (COD). You may pay via cash or secure UPI/QR code once the shipment arrives at your doorstep.
                  </p>
                )}

                {payMethod === 'card' && (
                  <div>
                    {/* Interactive 3D Card Mockup */}
                    <div className="payment-card-3d-wrap">
                      <div className={`payment-card-3d ${isCardFlipped ? 'flipped' : ''}`}>
                        
                        {/* Front Face */}
                        <div 
                          className="card-3d-face card-face-front" 
                          style={{ background: getCardThemeGradient(card.number) }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>AÉRE Platinum Atelier</span>
                            <span className="card-brand-logo">{getCardType(card.number)}</span>
                          </div>
                          
                          <div className="card-chip"></div>
                          
                          <div className="card-number-display">
                            {card.number || '•••• •••• •••• ••••'}
                          </div>
                          
                          <div className="card-meta-wrap">
                            <div className="card-holder-display">
                              <span className="card-meta-label">Cardholder</span>
                              <span className="card-meta-value">{card.name || 'Your Name'}</span>
                            </div>
                            <div className="card-expiry-display">
                              <span className="card-meta-label">Expires</span>
                              <span className="card-meta-value">{card.expiry || 'MM/YY'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Back Face */}
                        <div className="card-3d-face card-face-back">
                          <div className="card-magnetic-strip"></div>
                          <div className="card-signature-area">
                            <span className="card-signature-label">Authorized Signature</span>
                            <div className="card-signature-strip">
                              <div className="card-cvv-display">{card.cvv || '•••'}</div>
                            </div>
                          </div>
                          <div style={{ padding: '0 1.5rem', textAlign: 'right', fontSize: '0.45rem', opacity: 0.4 }}>
                            Atelier Express Secure Node
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Card fields */}
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Card Number</label>
                        <input 
                          type="text" 
                          value={card.number} 
                          onChange={e => updateCard('number', e.target.value)} 
                          placeholder="4111 2222 3333 4444" 
                          maxLength="19" 
                          required 
                          onFocus={() => setIsCardFlipped(false)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Cardholder Name</label>
                        <input 
                          type="text" 
                          value={card.name} 
                          onChange={e => updateCard('name', e.target.value)} 
                          placeholder="As printed on card" 
                          required 
                          onFocus={() => setIsCardFlipped(false)}
                        />
                      </div>
                      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input 
                            type="text" 
                            value={card.expiry} 
                            onChange={e => updateCard('expiry', e.target.value)} 
                            placeholder="MM/YY" 
                            maxLength="5" 
                            required 
                            onFocus={() => setIsCardFlipped(false)}
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input 
                            type="password" 
                            value={card.cvv} 
                            onChange={e => updateCard('cvv', e.target.value.replace(/[^0-9]/g, ''))} 
                            placeholder="•••" 
                            maxLength="4" 
                            required 
                            onFocus={() => setIsCardFlipped(true)}
                            onBlur={() => setIsCardFlipped(false)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {payMethod === 'upi' && (
                  <div>
                    {/* SVG QR code and countdown laser scanner */}
                    <div className="upi-qr-container">
                      <div className="upi-qr-wrapper">
                        <div className="laser-scan-line"></div>
                        <svg viewBox="0 0 100 100" fill="#15100d">
                          <rect x="0" y="0" width="25" height="25" fill="#15100d" />
                          <rect x="3" y="3" width="19" height="19" fill="#fff" />
                          <rect x="6" y="6" width="13" height="13" fill="#15100d" />
                          
                          <rect x="75" y="0" width="25" height="25" fill="#15100d" />
                          <rect x="78" y="3" width="19" height="19" fill="#fff" />
                          <rect x="81" y="6" width="13" height="13" fill="#15100d" />
                          
                          <rect x="0" y="75" width="25" height="25" fill="#15100d" />
                          <rect x="3" y="78" width="19" height="19" fill="#fff" />
                          <rect x="6" y="81" width="13" height="13" fill="#15100d" />
                          
                          <rect x="30" y="5" width="8" height="8" fill="#15100d" />
                          <rect x="42" y="12" width="6" height="6" fill="#15100d" />
                          <rect x="55" y="2" width="10" height="4" fill="#15100d" />
                          <rect x="35" y="20" width="12" height="4" fill="#15100d" />
                          
                          <rect x="5" y="35" width="14" height="6" fill="#15100d" />
                          <rect x="15" y="45" width="8" height="8" fill="#15100d" />
                          <rect x="2" y="60" width="10" height="4" fill="#15100d" />
                          
                          <rect x="35" y="35" width="30" height="30" fill="#15100d" />
                          <rect x="40" y="40" width="20" height="20" fill="#fff" />
                          <rect x="47" y="47" width="6" height="6" fill="#15100d" />
                          
                          <rect x="70" y="35" width="8" height="12" fill="#15100d" />
                          <rect x="82" y="42" width="12" height="6" fill="#15100d" />
                          
                          <rect x="35" y="75" width="12" height="8" fill="#15100d" />
                          <rect x="52" y="80" width="15" height="12" fill="#15100d" />
                          <rect x="75" y="75" width="8" height="8" fill="#15100d" />
                          <rect x="87" y="85" width="10" height="10" fill="#15100d" />
                        </svg>
                      </div>
                      <div className="upi-countdown-timer">
                        <span>⏳</span> Session expires in {formatTime(timeLeft)}
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label>UPI ID (e.g. mobile@upi)</label>
                      <input 
                        type="text" 
                        value={upiId} 
                        onChange={e => setUpiId(e.target.value)} 
                        placeholder="yourname@okaxis" 
                        required 
                      />
                    </div>
                  </div>
                )}

                {payMethod === 'biometric' && (
                  <div className="biometric-scanner-wrap">
                    <div className={`biometric-scanner-ring ${biometricState === 'scanning' ? 'scanning' : ''} ${biometricState === 'success' ? 'success' : ''}`}>
                      <div className="biometric-scanner-center">
                        {biometricState === 'success' ? '✓' : '👤'}
                      </div>
                    </div>
                    <p style={{
                      fontFamily: 'var(--sans)',
                      fontSize: '0.75rem',
                      color: biometricState === 'scanning' ? 'var(--rose)' : 'var(--taupe)',
                      letterSpacing: '0.05em',
                      marginTop: '1.2rem',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      lineHeight: 1.4
                    }}>
                      {biometricState === 'idle' && 'Position face for AÉRE Express Secure Pay'}
                      {biometricState === 'scanning' && 'SECURE BIOMETRIC SCANNING... PLEASE HOLD'}
                      {biometricState === 'success' && 'AUTHENTICATION SUCCESSFUL'}
                    </p>
                    {biometricState === 'idle' && (
                      <button 
                        type="button" 
                        onClick={handleBiometricPay}
                        className="btn-ghost" 
                        style={{ marginTop: '1rem', padding: '0.8rem 2rem', fontSize: '0.62rem' }}
                      >
                        Initiate FaceID Scan
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(158,139,124,0.15)' }}>
                <span style={{ fontSize: '0.8rem', color: '#dbd2c9' }}>🔒</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: '0.68rem', color: '#dbd2c9', letterSpacing: '0.05em' }}>
                  Secure 256-bit SSL encrypted connection
                </span>
              </div>
              
              {payMethod !== 'biometric' && (
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={isProcessing}
                  className="btn-primary" 
                  style={{ width: '100%' }}
                >
                  {isProcessing 
                    ? (payMethod === 'card' ? 'PROCESSING SECURE DEBIT...' : 'PLACING ORDER...') 
                    : `CONFIRM & PLACE ORDER — ₹${finalTotal.toLocaleString('en-IN')}`
                  }
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="order-summary">
        <h3>Order Summary</h3>
        {cart.map(item => (
          <div className="order-summary-item" key={item.key}>
            {item.image && <img src={item.image} alt={item.name} />}
            <div>
              <div className="name">{item.name}</div>
              <div className="meta">Qty: {item.quantity}{item.size ? ` · ${item.size}` : ''}</div>
              <div className="price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
            </div>
          </div>
        ))}
        
        <div className="cart-summary-row" style={{ marginTop: '1.5rem' }}><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
        
        {activePromo && (
          <div className="cart-summary-row" style={{ color: 'var(--rose)' }}>
            <span>Atelier Salon Code ({activePromo})</span>
            <span>- ₹{discountVal.toLocaleString('en-IN')}</span>
          </div>
        )}
        
        <div className="cart-summary-row"><span>Shipping</span><span>{finalShipping === 0 ? 'Complimentary' : `₹${finalShipping}`}</span></div>
        
        <div className="cart-total"><span>Total</span><strong>₹{finalTotal.toLocaleString('en-IN')}</strong></div>

        {/* Collapsible Atelier Promo Box */}
        <div className="atelier-promo-box">
          <label style={{
            display: 'block',
            fontFamily: 'var(--sans)',
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--taupe)',
            marginBottom: '0.4rem'
          }}>
            Atelier Salon Code
          </label>
          <div className="promo-input-row">
            <input 
              type="text" 
              value={promoInput} 
              onChange={e => setPromoInput(e.target.value)} 
              placeholder="e.g. ATELIER20" 
              style={{
                flex: 1,
                padding: '0.6rem',
                border: '1px solid rgba(158, 139, 124, 0.25)',
                background: 'none',
                color: 'var(--ink)',
                fontFamily: 'var(--sans)',
                fontSize: '0.78rem',
                outline: 'none',
                textTransform: 'uppercase'
              }}
              disabled={!!activePromo}
            />
            {!activePromo ? (
              <button 
                type="button" 
                onClick={handleApplyPromo}
                className="promo-btn-apply"
              >
                Apply
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleRemovePromo}
                className="promo-btn-remove"
                title="Remove Coupon"
              >
                ✕
              </button>
            )}
          </div>
          {activePromo && (
            <div className="promo-tag-active">
              <span>✨ Applied: {activePromo} (-{discountPercent}%)</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
