import ClientPage from "./ClientPage";
import { getDb } from "@/lib/db";

export async function generateMetadata({ params }) {
  const db = getDb();

  // AÉRE uses Next 16. Destructure the param carefully by awaiting.
  const { slug } = await params;

  const collection = db
    .prepare("SELECT * FROM collections WHERE slug = ?")
    .get(slug);

  if (!collection) {
    return {
      title: "Collection Not Found — AÉRE",
      description: "The requested collection could not be found.",
    };
  }

  let mainImage =
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80&auto=format";
  try {
    if (collection.image) mainImage = collection.image;
  } catch (e) {}

  return {
    title: `${collection.name} — AÉRE`,
    description: collection.description,
    openGraph: {
      title: `${collection.name} — AÉRE`,
      description: collection.description,
      images: [
        {
          url: mainImage,
          width: 800,
          height: 600,
          alt: collection.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.name} — AÉRE`,
      description: collection.description,
      images: [mainImage],
    },
  };
}

export default function CollectionPage({ params }) {
  // Pass the params down to the Client Component
  return <ClientPage params={params} />;
}
