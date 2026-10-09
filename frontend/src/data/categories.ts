export const categories = [
  {
    id: 1,
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Gaming",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    name: "Collectibles",
    image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    name: "Art",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    name: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
  },
] as const;

export const categoryNames = categories.map((category) => category.name);

export function resolveCategory(value: string | string[] | undefined) {
  if (typeof value !== "string") return "All";
  return categories.find((category) =>
    category.name.toLowerCase() === value.trim().toLowerCase()
  )?.name ?? "All";
}
