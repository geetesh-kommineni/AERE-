'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function AdminProductRow({ product, initialImages }) {
  const [deleted, setDeleted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(product.price);
  const { token } = useAuth();

  if (deleted) return null;

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setDeleted(true);
    }
  };

  const handleSave = async () => {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ price: parseFloat(price) })
    });
    setEditing(false);
  };


  const getDisplayImage = () => {
    if (!initialImages) return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80';
    if (Array.isArray(initialImages)) {
      return initialImages[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80';
    }
    if (typeof initialImages === 'object') {
      const firstColorKey = Object.keys(initialImages)[0];
      const imagesForColor = initialImages[firstColorKey] || [];
      return imagesForColor[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80';
    }
    return 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80';
  };

  return (
    <tr style={{ borderBottom: '1px solid rgba(158,139,124,.1)' }}>
      <td style={{ padding: '1rem' }}>
        <div style={{ width: '40px', height: '50px', position: 'relative', background: 'var(--ivory)' }}>
          <Image src={getDisplayImage()} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="40px" />
        </div>
      </td>
      <td style={{ padding: '1rem', fontFamily: 'var(--serif)', fontSize: '1rem', color: 'var(--ink)' }}>{product.name}</td>
      <td style={{ padding: '1rem', fontSize: '.85rem', color: 'var(--stone)' }}>{product.collection_name || 'N/A'}</td>
      <td style={{ padding: '1rem', fontSize: '.85rem', color: 'var(--stone)' }}>
        {editing ? (
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={{ width: '80px', padding: '.2rem' }} />
        ) : (
          `₹${parseFloat(price).toLocaleString('en-IN')}`
        )}
      </td>
      <td style={{ padding: '1rem' }}>
        <span style={{ fontSize: '.65rem', padding: '.2rem .6rem', background: 'rgba(29,59,49,.1)', color: '#1D3B31', letterSpacing: '.1em', textTransform: 'uppercase' }}>Active</span>
      </td>
      <td style={{ padding: '1rem', textAlign: 'right' }}>
        {editing ? (
          <button onClick={handleSave} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.1em', marginRight: '1rem' }}>Save</button>
        ) : (
          <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--taupe)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.1em', marginRight: '1rem' }}>Edit</button>
        )}
        <button onClick={handleDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--rose)', fontSize: '.75rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Delete</button>
      </td>
    </tr>
  );
}
