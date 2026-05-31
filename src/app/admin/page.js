import { getDb } from "@/lib/db";

export default async function AdminDashboard() {
  const db = getDb();

  // Basic metrics
  const productCount = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
  const orderCount = db.prepare("SELECT COUNT(*) as c FROM orders").get().c;
  const totalRevenue =
    db.prepare("SELECT SUM(total) as t FROM orders").get().t || 0;

  return (
    <div>
      <h2
        style={{
          fontFamily: "var(--serif)",
          fontSize: "2rem",
          fontWeight: 300,
          color: "var(--ink)",
          marginBottom: "2rem",
        }}
      >
        Dashboard Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "2rem",
          marginBottom: "3rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            border: "1px solid rgba(158,139,124,.2)",
          }}
        >
          <div
            style={{
              fontSize: ".75rem",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--taupe)",
              marginBottom: ".5rem",
            }}
          >
            Total Products
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "2.5rem",
              color: "var(--ink)",
            }}
          >
            {productCount}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            border: "1px solid rgba(158,139,124,.2)",
          }}
        >
          <div
            style={{
              fontSize: ".75rem",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--taupe)",
              marginBottom: ".5rem",
            }}
          >
            Total Orders
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "2.5rem",
              color: "var(--ink)",
            }}
          >
            {orderCount}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            border: "1px solid rgba(158,139,124,.2)",
          }}
        >
          <div
            style={{
              fontSize: ".75rem",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--taupe)",
              marginBottom: ".5rem",
            }}
          >
            Total Revenue
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: "2.5rem",
              color: "var(--ink)",
            }}
          >
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </div>
  );
}
