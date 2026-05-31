"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { totalItems, setIsDrawerOpen } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scrolled state for visual transition
      setScrolled(currentScrollY > 60);

      // Smart hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`nav ${scrolled ? "scrolled" : ""} ${visible ? "" : "hidden"}`}
        id="main-nav"
      >
        <Link href="/" className="nav-logo" aria-label="AÉRE Home">
          AÉRE
        </Link>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`hamburger ${mobileOpen ? "open" : ""}`}></span>
        </button>

        <ul className={`nav-links ${mobileOpen ? "mobile-open" : ""}`}>
          <li>
            <Link href="/" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/products?department=Women"
              onClick={() => setMobileOpen(false)}
            >
              Women
            </Link>
          </li>
          <li>
            <Link
              href="/products?department=Men"
              onClick={() => setMobileOpen(false)}
            >
              Men
            </Link>
          </li>
          <li>
            <Link href="/collections" onClick={() => setMobileOpen(false)}>
              Collections
            </Link>
          </li>
          <li>
            <Link href="/our-story" onClick={() => setMobileOpen(false)}>
              Our Story
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <button
            onClick={() => setSearchOpen(true)}
            className="icon-action"
            aria-label="Search"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {isAuthenticated ? (
            <Link href="/account" className="icon-action" aria-label="Account">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          ) : (
            <Link href="/auth" className="icon-action" aria-label="Sign In">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          )}

          <button
            className="icon-action"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Cart"
            style={{ position: "relative" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span
              className="cart-count"
              id="cartCount"
              style={{
                position: "absolute",
                top: "-4px",
                right: "-6px",
                fontSize: "0.55rem",
                minWidth: "14px",
                height: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 2px",
                background: "var(--rose)",
                color: "var(--cream)",
                fontWeight: "bold",
                lineHeight: 1,
              }}
            >
              {totalItems}
            </span>
          </button>
        </div>
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
