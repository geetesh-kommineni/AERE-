<div align="center">
  <img src="public/images/aere_premium_camel_trench.png" alt="AÉRE Banner" width="100%" />
  
  <br />
  <br />

  <h1>AÉRE — Considered Fashion</h1>

  <p>
    <strong>A premium, high-performance e-commerce experience designed for the considered individual.</strong>
  </p>

  <p>
    <a href="https://aere-app.vercel.app/"><b>✨ View Live Demo</b></a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-features">Features</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>

  <br />
</div>

## 🌐 Live Application
The fully functional production build is live and deployed on Vercel:
👉 **[https://aere-app.vercel.app/](https://aere-app.vercel.app/)**

---

## 💎 The Vision

AÉRE is more than just a storefront; it is a meticulously crafted digital experience. Designed with a luxury aesthetic, the application features buttery-smooth micro-animations, cinematic preloaders, and custom liquid glassmorphic mesh gradients. Every pixel has been refined to reflect the quality of the sustainable garments it showcases.

Built on a robust, full-stack Next.js architecture, AÉRE ensures zero compromise between breathtaking design and lightning-fast web performance.

---

## ✨ Features

### 🎨 Premium UI & User Experience
- **Cinematic Interactions:** Custom Framer Motion-inspired scroll reveals and page transitions.
- **Bespoke Design System:** Zero external UI libraries. 100% custom Vanilla CSS and CSS Modules ensuring ultimate performance and a unique visual identity.
- **Dynamic Responsiveness:** Fluid grid and flexbox layouts that scale elegantly from 4K ultrawide monitors down to mobile devices.
- **Micro-interactions:** Liquid mesh gradients, frosted glass panels, and bespoke hover effects.

### 🛍️ E-Commerce Engine
- **Intelligent Cart System:** Persistent state management utilizing React Context for immediate, optimistic UI updates.
- **Product Exploration:** Comprehensive product galleries, categorized collections, and size selection logic.
- **Favorites & Wishlists:** Users can curate their own collections seamlessly.

### 🔐 Security & Authentication
- **Secure Sessions:** Encrypted JWT (JSON Web Tokens) handled securely via `HttpOnly` cookies.
- **Email Verification:** OTP (One-Time Password) email flows powered by Nodemailer for bulletproof registration.
- **Password Encryption:** Industry-standard `bcryptjs` hashing for all user credentials.
- **Admin Protection:** Middleware-protected routes to ensure only authorized personnel can access the backend dashboard.

### 📊 Administrative Dashboard
- **Inventory Management:** Full CRUD operations for the product catalog.
- **Order Tracking:** Comprehensive view of all transactions and order statuses.
- **Analytics:** At-a-glance metrics of store performance.

---

## 🏗 Architecture & Tech Stack

AÉRE leverages the absolute cutting-edge of the React ecosystem:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router & React Server Components)
- **Database:** `better-sqlite3` for hyper-fast, low-latency local persistent storage.
- **Authentication:** `jose` (JWT) & `bcryptjs`
- **Email Infrastructure:** `nodemailer`
- **Payment Processing:** Stripe Integration (Configured)
- **Deployment:** Vercel

---

## 🚀 Getting Started (Local Development)

To run this masterpiece locally, ensure you have Node.js installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/geetesh-kommineni/AERE-.git
cd aere-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory. *Note: All sensitive data has been rigorously purged from the source code.*
```env
# Authentication
JWT_SECRET=your_super_secret_jwt_key
ADMIN_PASSWORD=your_secure_admin_password

# Email Service (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
```

### 4. Initialize the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience AÉRE.

---

## 🔒 Security Statement
Security is a top priority. All API keys, database secrets, and sensitive credentials have been completely removed from the Git history. The application relies entirely on secure environment variables (`process.env`) to interact with external services, ensuring the codebase remains pristine and impenetrable.

---
<div align="center">
  <p><i>Garments designed for the considered woman. Unhurried silhouettes in fabrics that remember the earth they came from.</i></p>
  <p><b>AÉRE</b></p>
</div>
