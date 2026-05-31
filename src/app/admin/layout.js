import Link from "next/link";
import "../globals.css"; // Just in case, though it's inherited
import AdminGuard from "@/components/AdminGuard";

export const metadata = { title: "AÉRE Admin" };

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div
        style={{ display: "flex", minHeight: "100vh", background: "#FDFBF7" }}
      >
        <aside
          style={{
            width: "250px",
            background: "#1A1410",
            color: "#FAF7F3",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--serif)",
              fontSize: "1.5rem",
              fontWeight: 300,
              letterSpacing: ".1em",
              marginBottom: "3rem",
            }}
          >
            AÉRE Admin
          </h1>
          <nav
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              flex: 1,
            }}
          >
            <Link
              href="/admin"
              style={{
                color: "#FAF7F3",
                textDecoration: "none",
                fontSize: ".85rem",
                letterSpacing: ".05em",
                opacity: 0.8,
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              style={{
                color: "#FAF7F3",
                textDecoration: "none",
                fontSize: ".85rem",
                letterSpacing: ".05em",
                opacity: 0.8,
              }}
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              style={{
                color: "#FAF7F3",
                textDecoration: "none",
                fontSize: ".85rem",
                letterSpacing: ".05em",
                opacity: 0.8,
              }}
            >
              Orders
            </Link>
          </nav>
          <Link
            href="/"
            style={{
              color: "#C9927A",
              textDecoration: "none",
              fontSize: ".75rem",
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            ← Back to Store
          </Link>
        </aside>
        <main
          style={{
            flex: 1,
            padding: "3rem 4rem",
            overflowY: "auto",
            background: "#FDFBF7",
          }}
        >
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
