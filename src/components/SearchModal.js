'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
      } catch { setResults([]); }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrap">
          <input ref={inputRef} type="text" placeholder="Search for garments, fabrics, collections..." value={query} onChange={(e) => setQuery(e.target.value)} className="search-input" />
          <button className="search-close" onClick={onClose}>✕</button>
        </div>

        {loading && <div className="search-loading">Searching...</div>}

        {results.length > 0 && (
          <div className="search-results">
            {results.map(product => (
              <Link href={`/products/${product.slug}`} key={product.id} className="search-result-item" onClick={onClose}>
                <div className="search-result-img">
                  <Image src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80&auto=format'} alt={product.name} fill sizes="50px" style={{ objectFit: 'cover' }} />
                </div>
                <div className="search-result-info">
                  <div className="search-result-name">{product.name}</div>
                  <div className="search-result-meta">{product.material} · ₹{product.price.toLocaleString('en-IN')}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="search-empty">No garments found for &ldquo;{query}&rdquo;</div>
        )}
      </div>
    </div>
  );
}
