export const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Laptops, headphones and everyday tech.",
    popular: true,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    name: "Fashion",
    description: "Clothing, shoes and accessories.",
    popular: true,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Gaming",
    description: "Consoles, games and gaming accessories.",
    popular: true,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    name: "Collectibles",
    description: "Rare finds and special editions.",
    popular: true,
    image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    name: "Art",
    description: "Paintings, prints and handmade pieces.",
    popular: true,
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    name: "Home",
    description: "Decor, lighting and home essentials.",
    popular: true,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 7,
    name: "Books",
    description: "Fiction, non-fiction and special editions.",
    popular: false,
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 8,
    name: "Sports",
    description: "Equipment for training and outdoor activities.",
    popular: false,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 9,
    name: "Music",
    description: "Instruments, records and audio equipment.",
    popular: false,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 10,
    name: "Photography",
    description: "Cameras, lenses and photography equipment.",
    popular: false,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 11,
    name: "Jewelry",
    description: "Necklaces, rings and elegant accessories.",
    popular: false,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 12,
    name: "Watches",
    description: "Classic, modern and collectible timepieces.",
    popular: false,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 13,
    name: "Toys",
    description: "Building sets, board games and playful finds.",
    popular: false,
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 14,
    name: "Furniture",
    description: "Desks, chairs and pieces for every room.",
    popular: false,
    image: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 15,
    name: "Garden",
    description: "Plants, planters and outdoor essentials.",
    popular: false,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 16,
    name: "Tools",
    description: "Hand tools and equipment for your next project.",
    popular: false,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 17,
    name: "Beauty",
    description: "Beauty accessories and personal care tools.",
    popular: false,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 18,
    name: "Automotive",
    description: "Vehicle accessories and maintenance equipment.",
    popular: false,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 19,
    name: "Antiques",
    description: "Objects with history and vintage character.",
    popular: false,
    image: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 20,
    name: "Travel",
    description: "Luggage and accessories for your next trip.",
    popular: false,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80",
  },
] as const;

export const categoryNames = categories.map((category) => category.name);

export function resolveCategory(value: string | string[] | undefined) {
  if (typeof value !== "string") return "All";
  return categories.find((category) =>
    category.name.toLowerCase() === value.trim().toLowerCase()
  )?.name ?? "All";
}
