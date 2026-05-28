export const metadata = { title: 'Shipping & Returns — AÉRE' };

export default function ShippingReturnsPage() {
  return (
    <div className="info-page">
      <p style={{ fontSize: '.6rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '1rem' }}>Policies</p>
      <h1>Shipping & <em>Returns</em></h1>

      <h2>Shipping</h2>
      <table className="size-table">
        <thead><tr><th>Method</th><th>Delivery</th><th>Cost</th></tr></thead>
        <tbody>
          <tr><td>Standard</td><td>5-7 business days</td><td>₹299 (Free over ₹4,999)</td></tr>
          <tr><td>Express</td><td>2-3 business days</td><td>₹499</td></tr>
          <tr><td>International</td><td>7-14 business days</td><td>Calculated at checkout</td></tr>
        </tbody>
      </table>
      <p>All orders are carefully wrapped in our signature recycled packaging. You&apos;ll receive tracking details via email once your order ships.</p>

      <h2>Returns</h2>
      <p>We want you to love every piece. If something doesn&apos;t feel right, we offer hassle-free returns within 30 days of delivery.</p>
      <ul>
        <li>Items must be unworn, unwashed, and with all tags attached</li>
        <li>Sale items are eligible for exchange or store credit only</li>
        <li>Intimate apparel and accessories are final sale</li>
        <li>Return shipping is complimentary for domestic orders</li>
      </ul>

      <h2>Exchanges</h2>
      <p>Need a different size? We&apos;re happy to exchange. Simply initiate a return and place a new order for the correct size. We&apos;ll prioritise processing your exchange.</p>

      <h2>Frequently Asked Questions</h2>
      <div className="info-grid">
        <div className="info-card"><h3>How do I track my order?</h3><p>You&apos;ll receive a tracking link via email once your order ships. You can also check your order status in your account.</p></div>
        <div className="info-card"><h3>Can I change my order?</h3><p>Please contact us within 2 hours of placing your order if you need to make changes. After that, we may not be able to modify it.</p></div>
        <div className="info-card"><h3>Do you ship internationally?</h3><p>Yes, we ship to 46 countries. International shipping rates are calculated at checkout based on weight and destination.</p></div>
        <div className="info-card"><h3>How long do refunds take?</h3><p>Refunds are processed within 5-7 business days of us receiving your return. You&apos;ll receive a confirmation email once processed.</p></div>
      </div>
    </div>
  );
}
