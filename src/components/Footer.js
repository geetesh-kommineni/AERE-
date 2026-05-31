"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <Link href="/" className="footer-logo-link" aria-label="AÉRE Home">
              AÉRE
            </Link>
          </div>
          <p>
            Considered fashion for the unhurried woman. Designed in India, worn
            everywhere.
          </p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li>
              <Link href="/products">New Arrivals</Link>
            </li>
            <li>
              <Link href="/collections">Collections</Link>
            </li>
            <li>
              <Link href="/products?sort=price-asc">Best Value</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <Link href="/our-story">Our Story</Link>
            </li>
            <li>
              <Link href="/sustainability">Sustainability</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            <li>
              <Link href="/sizing-guide">Sizing Guide</Link>
            </li>
            <li>
              <Link href="/shipping-returns">Shipping & Returns</Link>
            </li>
            <li>
              <Link href="/contact">Care Instructions</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Aére. All rights reserved.</p>
        <div className="footer-socials">
          <Link href="/contact">Newsletter</Link>
        </div>
      </div>
    </footer>
  );
}
