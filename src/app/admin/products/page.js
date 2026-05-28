import { getDb } from '@/lib/db';
import AdminProductRow from '@/components/AdminProductRow';

export default async function AdminProducts() {
  const db = getDb();
  const products = db.prepare('SELECT p.*, c.name as collection_name FROM products p LEFT JOIN collections c ON p.collection_id = c.id ORDER BY p.id DESC').all();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--ink)' }}>Products</h2>
        <button className="btn-primary" style={{ padding: '.8rem 1.5rem', fontSize: '.7rem' }}>+ Add Product</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid rgba(158,139,124,.2)' }}>
        <thead>
          <tr style={{ background: 'var(--ivory)', borderBottom: '1px solid rgba(158,139,124,.2)', textAlign: 'left' }}>
            <th style={{ padding: '1rem', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--taupe)', fontWeight: 400 }}>Image</th>
            <th style={{ padding: '1rem', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--taupe)', fontWeight: 400 }}>Name</th>
            <th style={{ padding: '1rem', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--taupe)', fontWeight: 400 }}>Collection</th>
            <th style={{ padding: '1rem', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--taupe)', fontWeight: 400 }}>Price</th>
            <th style={{ padding: '1rem', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--taupe)', fontWeight: 400 }}>Status</th>
            <th style={{ padding: '1rem', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--taupe)', fontWeight: 400, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            const images = JSON.parse(p.images || '[]');
            return <AdminProductRow key={p.id} product={p} initialImages={images} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
