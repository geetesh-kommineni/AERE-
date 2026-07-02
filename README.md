# AÉRE — Considered Fashion

![AÉRE Banner](public/images/aere_premium_camel_trench.png)

AÉRE is a premium, full-stack e-commerce web application designed for a luxury sustainable fashion brand. It blends high-end editorial aesthetics with modern web performance, featuring buttery-smooth micro-animations, glassmorphic UI elements, and a completely responsive grid system.

## 🌟 Features

- **Premium UI/UX:** Custom-built glassmorphism panels, liquid mesh gradient backgrounds, and elegant scroll typography.
- **Dynamic E-Commerce Flows:** Fully functional shopping cart, wishlist, and product detail pages with size selection and image galleries.
- **Authentication:** Secure user login and registration system with OTP email verification (powered by Nodemailer) and encrypted JWT session cookies.
- **Admin Dashboard:** A protected administrative portal to manage products, view orders, and oversee inventory.
- **Database:** Local SQLite integration for fast, persistent storage of products, users, orders, and reviews.
- **Fully Responsive:** Meticulously crafted CSS grid and flexbox layouts that scale perfectly from 4k desktop monitors down to mobile screens.

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** Custom Vanilla CSS & CSS Modules (Zero external UI libraries for maximum control and performance)
- **Database:** `better-sqlite3`
- **Authentication:** `jose` (JWT) & `bcryptjs`
- **Email:** `nodemailer`
- **Deployment:** Vercel

## 🚀 Getting Started

To run this project locally, you will need Node.js installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/geetesh-kommineni/AERE-.git
   cd aere-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your secrets (never commit this file):
   ```env
   JWT_SECRET=your_super_secret_jwt_key
   ADMIN_PASSWORD=your_secure_admin_password
   EMAIL_USER=your_email@gmail.com
   EMAIL_APP_PASSWORD=your_app_password
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🔒 Security Note
All sensitive credentials, API keys, and database secrets have been completely removed from the source code and git history. The application relies entirely on secure environment variables for authentication and external services.

---
*Designed & Developed for the considered individual.*
