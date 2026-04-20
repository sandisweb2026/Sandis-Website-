export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type TourCategory =
  | "maharashtra"
  | "india"
  | "international"
  | "domestic"
  | string;
export type EnquiryStatus = "new" | "contacted" | "closed";

export type TourItineraryItem = {
  day: string;
  title: string;
  description: string;
};

export type TourFaqItem = {
  q: string;
  a: string;
};

export type TourExtras = {
  itinerary: TourItineraryItem[];
  highlights: string[];
  exclusions: string[];
  terms: string[];
  heroGallery: string[];
  gallery: string[];
  faqs: TourFaqItem[];
};

export type TourRecord = {
  id: string;
  name: string;
  duration: string;
  price: string;
  category: TourCategory;
  description: string | null;
  image_url: string | null;
  inclusions: string[] | null;
  itinerary: Json | null;
  created_at: string;
  updated_at: string;
};

export type TourPayload = {
  name: string;
  duration: string;
  price: string;
  category: TourCategory;
  description: string | null;
  image_url: string | null;
  inclusions: string[] | null;
  itinerary: Json | null;
};

export type ServiceRecord = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  created_at: string;
  updated_at: string;
};

export type ServicePayload = {
  title: string;
  description: string | null;
  icon: string;
};

export type EnquiryRecord = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  destination: string | null;
  message: string | null;
  travel_date: string | null;
  status: EnquiryStatus;
  created_at: string;
};

export type EnquiryPayload = {
  name: string;
  email?: string | null;
  phone: string;
  destination?: string | null;
  message?: string | null;
  travel_date?: string | null;
  status?: EnquiryStatus;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
};

export const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

export const joinLines = (value: string[] | null | undefined) =>
  value?.join("\n") ?? "";

export const createEmptyItineraryItem = (
  position = 1,
): TourItineraryItem => ({
  day: `Day ${position}`,
  title: "",
  description: "",
});

export const createEmptyFaqItem = (): TourFaqItem => ({
  q: "",
  a: "",
});

export const createEmptyTourExtras = (): TourExtras => ({
  itinerary: [],
  highlights: [],
  exclusions: [],
  terms: [],
  heroGallery: [],
  gallery: [],
  faqs: [],
});

const isFaqItem = (value: unknown): value is TourFaqItem => {
  if (!value || typeof value !== "object") return false;
  const faq = value as Record<string, unknown>;
  return typeof faq.q === "string" || typeof faq.a === "string";
};

const normalizeItineraryItems = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const title =
        typeof record.title === "string" ? record.title.trim() : "";
      const description =
        typeof record.description === "string"
          ? record.description.trim()
          : "";
      const day =
        typeof record.day === "string" && record.day.trim()
          ? record.day.trim()
          : `Day ${index + 1}`;

      if (!title && !description) return null;

      return {
        day,
        title,
        description,
      };
    })
    .filter((item): item is TourItineraryItem => Boolean(item));
};

const normalizeStringList = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
};

const normalizeFaqs = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") {
        const question = item.trim();
        return question ? { q: question, a: "" } : null;
      }
      if (!isFaqItem(item)) return null;
      const question = typeof item.q === "string" ? item.q.trim() : "";
      const answer = typeof item.a === "string" ? item.a.trim() : "";
      if (!question && !answer) return null;
      return { q: question, a: answer };
    })
    .filter((item): item is TourFaqItem => Boolean(item));
};

export const extractTourExtras = (value: Json | null): TourExtras => {
  const extras = createEmptyTourExtras();

  if (Array.isArray(value)) {
    extras.itinerary = normalizeItineraryItems(value);
    return extras;
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    extras.itinerary = normalizeItineraryItems(record.itinerary);
    extras.highlights = normalizeStringList(record.highlights);
    extras.exclusions = normalizeStringList(record.exclusions);
    extras.terms = normalizeStringList(record.terms);
    extras.heroGallery = normalizeStringList(record.heroGallery);
    extras.gallery = normalizeStringList(record.gallery);
    extras.faqs = normalizeFaqs(record.faqs);
  }

  return extras;
};

export const buildTourExtras = (extras: TourExtras): Json => ({
  itinerary: normalizeItineraryItems(extras.itinerary),
  highlights: normalizeStringList(extras.highlights),
  exclusions: normalizeStringList(extras.exclusions),
  terms: normalizeStringList(extras.terms),
  heroGallery: normalizeStringList(extras.heroGallery),
  gallery: normalizeStringList(extras.gallery),
  faqs: normalizeFaqs(extras.faqs),
});
