"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function AuthPage() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const { login, register, sendOtp } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setError("");
    setIsOtpSent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (tab === "login") {
        await login(email, password);
        showToast("Welcome back to Aére");
        router.push("/account");
      } else {
        if (password !== confirmPw) {
          setError("Passwords do not match");
          return;
        }

        if (!isOtpSent) {
          // Step 1: Send OTP
          const data = await sendOtp(email);
          setIsOtpSent(true);
          if (data._demoOtp) {
            showToast(`Mock OTP (demo only): ${data._demoOtp}`);
          } else {
            showToast("Verification code sent to your email");
          }
        } else {
          // Step 2: Verify OTP and create account
          await register(name, email, password, otp);
          showToast("Welcome to Aére");
          router.push("/account");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-image">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=85&auto=format"
          alt="AÉRE fashion"
        />
      </div>
      <div className="auth-form-wrap">
        <div
          className="auth-form luxury-glass-panel"
          style={{
            padding: "3.5rem 3rem",
            border: "1px solid rgba(158,139,124,.15)",
            background: "rgba(255,253,250,0.45)",
            backdropFilter: "blur(40px)",
            boxShadow: "0 25px 60px rgba(26,20,16,0.035)",
            maxWidth: "440px",
            width: "100%",
          }}
        >
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => handleTabChange("login")}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${tab === "register" ? "active" : ""}`}
              onClick={() => handleTabChange("register")}
            >
              Create Account
            </button>
          </div>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            {tab === "register" && !isOtpSent && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            {(!isOtpSent || tab === "login") && (
              <>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </>
            )}
            {tab === "register" && !isOtpSent && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                />
              </div>
            )}
            {tab === "register" && isOtpSent && (
              <div className="form-group">
                <label>Verification Code</label>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--taupe)",
                    marginBottom: "1rem",
                  }}
                >
                  We've sent a 6-digit code to {email}. Please enter it below.
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  placeholder="123456"
                  style={{ letterSpacing: "0.2em", textAlign: "center" }}
                />
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--taupe)",
                    textDecoration: "underline",
                    fontSize: "0.8rem",
                    marginTop: "1rem",
                    cursor: "pointer",
                  }}
                >
                  Edit email or resend code
                </button>
              </div>
            )}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", marginTop: "1rem" }}
            >
              {tab === "login"
                ? "Sign In"
                : isOtpSent
                  ? "Verify & Create Account"
                  : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
