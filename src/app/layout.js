import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
  title: "AÉRE — Considered Fashion",
  description:
    "Garments designed for the considered woman. Unhurried silhouettes in fabrics that remember the earth they came from. Shop luxury sustainable fashion.",
  keywords:
    "luxury fashion, sustainable clothing, linen dresses, silk blouses, ethical fashion, Indian designer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
