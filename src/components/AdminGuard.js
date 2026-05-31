"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();

  // Admin emails list - matches server fallback
  const adminEmails = ["admin@aere.com", "admin@aura.com"];
  const isAdmin = user && adminEmails.includes(user.email);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#FDFBF7",
          color: "var(--ink)",
          fontFamily: "var(--serif)",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            border: "1px solid rgba(158,139,124,.2)",
            borderTop: "1px solid #1A1410",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1.5rem",
          }}
        />
        <p
          style={{
            fontSize: ".8rem",
            letterSpacing: ".15em",
            textTransform: "uppercase",
            color: "var(--taupe)",
          }}
        >
          Verifying administrative credentials
        </p>
        <style jsx global>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#FDFBF7",
          padding: "2rem",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            background: "#FFFFFF",
            border: "1px solid rgba(158,139,124,.15)",
            padding: "3.5rem 3rem",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(26,20,16,0.02)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--serif)",
              fontSize: "2rem",
              color: "var(--rose)",
              fontWeight: 300,
              display: "block",
              marginBottom: "1.5rem",
            }}
          >
            Access Restricted
          </span>
          <p
            style={{
              fontSize: ".85rem",
              color: "var(--stone)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              letterSpacing: "0.01em",
            }}
          >
            This domain is restricted to authorized atelier personnel only.
            Please sign in with an administrator account to access the dashboard
            tools and database records.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Link
              href="/auth"
              style={{
                display: "block",
                background: "#1A1410",
                color: "#FAF7F3",
                padding: "1rem",
                fontSize: ".75rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
              onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              style={{
                display: "block",
                border: "1px solid #1A1410",
                color: "#1A1410",
                padding: "1rem",
                fontSize: ".75rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(26,20,16,0.02)")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "none")}
            >
              ← Return to Boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
