'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';

export default function OrderDetailPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(d => setOrder(d.order));
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(prev => ({ ...prev, status: data.order.status }));
        showToast(`Order status updated to: ${newStatus.toUpperCase()}`);
      } else {
        showToast(data.error || 'Failed to update order status');
      }
    } catch {
      showToast('An error occurred while updating status');
    }
  };

  if (!order) return <div style={{ padding: '10rem 4rem', textAlign: 'center', fontFamily: 'var(--serif)', color: 'var(--taupe)' }}>Loading...</div>;

  const statuses = ['confirmed', 'tailoring', 'shipped', 'delivered'];
  const stepLabels = [
    { label: 'Ordered', desc: 'Order received & confirmed' },
    { label: 'Atelier Tailoring', desc: 'Bespoke hand-tailoring' },
    { label: 'Dispatched', desc: 'In transit via luxury air mail' },
    { label: 'Delivered', desc: 'Delivered with artisan care' }
  ];

  const currentStepIndex = statuses.indexOf(order.status) !== -1 ? statuses.indexOf(order.status) : 0;

  return (
    <div className="account-layout">
      <div className="account-header">
        <h1>Order #{order.id}</h1>
        <Link href="/orders" className="btn-ghost">Back to Orders</Link>
      </div>

      {/* High-Fidelity Transit Timeline Card */}
      <div style={{
        padding: '2.5rem',
        border: '1px solid rgba(158,139,124,0.18)',
        background: '#16120f',
        marginBottom: '3rem',
        borderRadius: 0,
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
      }}>
        <h3 style={{
          fontFamily: 'var(--serif)',
          fontSize: '1.35rem',
          fontWeight: 300,
          marginBottom: '2.5rem',
          letterSpacing: '0.04em',
          color: 'var(--ink)',
          textTransform: 'uppercase'
        }}>
          Atelier Transit Timeline
        </h3>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          margin: '2rem auto 4rem',
          maxWidth: '900px',
          padding: '0 10px'
        }}>
          {/* Timeline track line background */}
          <div style={{
            position: 'absolute',
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'rgba(250,247,243,0.06)',
            zIndex: 1
          }}></div>

          {/* Active progress color track line */}
          <div style={{
            position: 'absolute',
            left: '10%',
            width: `${(currentStepIndex / (statuses.length - 1)) * 80}%`,
            height: '2px',
            background: 'var(--rose)',
            boxShadow: '0 0 8px var(--rose)',
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 2
          }}></div>

          {stepLabels.map((s, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isActive = idx === currentStepIndex;
            return (
              <div key={idx} style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '20%'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCompleted ? 'var(--rose)' : '#16120f',
                  border: `2px solid ${isCompleted ? 'var(--rose)' : 'rgba(158,139,124,0.25)'}`,
                  boxShadow: isActive ? '0 0 10px var(--rose)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isCompleted ? '#0f0c09' : 'var(--taupe)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  {isCompleted ? '✓' : idx + 1}
                </div>

                <div style={{
                  position: 'absolute',
                  top: '42px',
                  textAlign: 'center',
                  width: '180px'
                }}>
                  <div style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '0.65rem',
                    fontWeight: isCompleted ? '600' : '400',
                    color: isCompleted ? 'var(--ink)' : 'var(--taupe)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    transition: 'color 0.5s'
                  }}>
                    {s.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--serif)',
                    fontSize: '0.68rem',
                    fontStyle: 'italic',
                    color: 'var(--taupe)',
                    marginTop: '0.2rem'
                  }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Concierge simulation options */}
        <div style={{
          borderTop: '1px dashed rgba(158,139,124,0.15)',
          paddingTop: '2rem',
          marginTop: '1rem'
        }}>
          <p style={{
            fontFamily: 'var(--sans)',
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--rose)',
            marginBottom: '1rem',
            fontWeight: 600
          }}>
            Atelier Concierge Simulator Controls
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {['confirmed', 'tailoring', 'shipped', 'delivered'].map((st) => (
              <button
                key={st}
                onClick={() => updateStatus(st)}
                style={{
                  padding: '0.5rem 1.2rem',
                  border: '1px solid rgba(158,139,124,0.25)',
                  background: order.status === st ? 'var(--rose)' : 'transparent',
                  color: order.status === st ? '#0f0c09' : 'var(--stone)',
                  fontFamily: 'var(--sans)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {st === 'confirmed' ? 'Placed' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="account-grid">
        <div>
          <div className="account-card" style={{ marginBottom: '1.5rem' }}>
            <h3>Items</h3>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(158,139,124,.12)' }}>
                {item.product_image && <img src={item.product_image} alt={item.product_name} style={{ width: '60px', height: '75px', objectFit: 'cover' }} />}
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '.95rem' }}>{item.product_name}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--taupe)' }}>Qty: {item.quantity}{item.size ? ` · ${item.size}` : ''}{item.color ? ` · ${item.color}` : ''}</div>
                  <div style={{ fontSize: '.85rem', marginTop: '.25rem' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="account-card" style={{ marginBottom: '1.5rem' }}>
            <h3>Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', fontSize: '.82rem', color: 'var(--taupe)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{order.shipping === 0 ? 'Complimentary' : `₹${order.shipping}`}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)', paddingTop: '.5rem', borderTop: '1px solid rgba(158,139,124,.2)' }}><span>Total</span><span>₹{order.total?.toLocaleString('en-IN')}</span></div>
            </div>
          </div>
          <div className="account-card">
            <h3>Shipping</h3>
            <p>{order.shipping_name}<br />{order.shipping_address}<br />{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
