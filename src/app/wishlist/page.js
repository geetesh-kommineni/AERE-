'use client';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="page-layout" style={{ minHeight: '80vh', padding: '6rem 4rem' }}>
      <ScrollReveal>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="eyebrow" style={{ fontSize: '.6rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '1rem' }}>Your Curated Collection</div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: '3rem', fontWeight: 300, color: 'var(--ink)' }}>Wishlist</h1>
        </div>
      </ScrollReveal>

      {wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--taupe)', padding: '4rem 0' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>You haven't saved any items yet.</p>
          <a href="/products" className="btn-primary">Explore Collection</a>
        </div>
      ) : (
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
