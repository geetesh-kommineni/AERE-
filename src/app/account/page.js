'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const { user, token, loading, logout, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/auth');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (token) fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => setOrders(d.orders || []));
  }, [token]);

  if (loading || !user) return <div style={{ padding: '10rem 4rem', textAlign: 'center', fontFamily: 'var(--serif)', color: 'var(--taupe)' }}>Loading...</div>;

  return (
    <div className="account-layout">
      <div className="account-header">
        <div>
          <h1>Welcome, {user.name}</h1>
          <p style={{ fontSize: '.8rem', color: 'var(--taupe)', marginTop: '.25rem' }}>{user.email}</p>
        </div>
        <button className="btn-ghost" onClick={() => { logout(); router.push('/'); }}>Sign Out</button>
      </div>
      <div className="account-grid">
        <div className="account-card">
          <h3>Recent Orders</h3>
          {orders.length === 0 ? <p>No orders yet. Start shopping to see your orders here.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
              {orders.slice(0, 3).map(o => (
                <Link href={`/orders/${o.id}`} key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '.75rem 0', borderBottom: '1px solid rgba(158,139,124,.15)', fontSize: '.82rem' }}>
                  <span>Order #{o.id}</span>
                  <span>₹{o.total?.toLocaleString('en-IN')}</span>
                </Link>
              ))}
              <Link href="/orders" className="section-link" style={{ marginTop: '.5rem' }}>View All Orders</Link>
            </div>
          )}
        </div>
        <div className="account-card">
          <h3>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', marginTop: '.5rem' }}>
            <Link href="/orders" style={{ fontSize: '.82rem', color: 'var(--stone)' }}>Order History</Link>
            <Link href="/wishlist" style={{ fontSize: '.82rem', color: 'var(--stone)' }}>My Wishlist</Link>
            <Link href="/sizing-guide" style={{ fontSize: '.82rem', color: 'var(--stone)' }}>Sizing Guide</Link>
            <Link href="/shipping-returns" style={{ fontSize: '.82rem', color: 'var(--stone)' }}>Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
