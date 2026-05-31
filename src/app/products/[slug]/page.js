import ClientPage from "./ClientPage";
import { getDb } from "@/lib/db";

export async function generateMetadata({ params }) {
  const db = getDb();

  // AÉRE uses Next 16. Destructure the param carefully by awaiting.
  const { slug } = await params;

  const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);

  if (!product) {
    return {
      title: "Product Not Found — AÉRE",
      description: "The requested product could not be found.",
    };
  }

  let mainImage =
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format";
  try {
    const images = JSON.parse(product.images);
    if (images.length > 0) mainImage = images[0];
  } catch (e) {}

  return {
    title: `${product.name} — AÉRE`,
    description: product.description,
    openGraph: {
      title: `${product.name} — AÉRE`,
      description: product.description,
      images: [
        {
          url: mainImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — AÉRE`,
      description: product.description,
      images: [mainImage],
    },
  };
}

export default function ProductPage({ params }) {
  // Pass the params down to the Client Component
  return <ClientPage params={params} />;
}
