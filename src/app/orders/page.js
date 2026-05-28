'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function OrdersPage() {
  const { token, loading, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const router = useRouter();
  useEffect(() => { if (!loading && !isAuthenticated) router.push('/auth'); }, [loading, isAuthenticated, router]);
  useEffect(() => {
    if (token) fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(d => setOrders(d.orders || []));
  }, [token]);
  return (
    <div className="account-layout">
      <div className="account-header"><h1>Order History</h1><Link href="/account" className="btn-ghost">Back to Account</Link></div>
      {orders.length === 0 ? <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'var(--serif)', color: 'var(--taupe)', fontStyle: 'italic' }}>No orders yet.</div> : (
        <div className="orders-list">
          {orders.map(o => (
            <Link href={`/orders/${o.id}`} key={o.id} className="order-card">
              <div><div className="order-id">Order #{o.id}</div><div className="order-date">{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
              <div className="order-status">{o.status}</div>
              <div className="order-amount">₹{o.total?.toLocaleString('en-IN')}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
