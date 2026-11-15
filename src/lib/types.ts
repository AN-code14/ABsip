import type { MenuItem } from "@/db/schema";

/** Plain, serialisable shape handed to client components. */
export type CardItem = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  story: string | null;
  price: number;
  image: string;
  tags: string[];
  isVeg: boolean;
  isSignature: boolean;
  prepMinutes: number;
  kcal: number | null;
  pairing: string | null;
  origin: string | null;
};

export function toCard(item: MenuItem): CardItem {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    description: item.description,
    story: item.story ?? null,
    price: item.price,
    image: item.image,
    tags: item.tags ?? [],
    isVeg: item.isVeg,
    isSignature: item.isSignature,
    prepMinutes: item.prepMinutes,
    kcal: item.kcal ?? null,
    pairing: item.pairing ?? null,
    origin: item.origin ?? null,
  };
}
