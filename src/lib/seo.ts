export const SITE_ORIGIN = (
  import.meta.env.VITE_SITE_URL?.trim() || "https://www.sandis.com"
).replace(/\/+$/, "");

const absoluteUrl = (value: string) => {
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
};

export const createBreadcrumbSchema = (
  items: Array<{ name: string; path: string }>,
) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
