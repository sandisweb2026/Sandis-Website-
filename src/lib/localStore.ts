import { services as seedServices, tours as seedTours, type Tour as SeedTour } from "@/data/tours";

export type LocalTour = {
  id: string;
  name: string;
  duration: string;
  price: string;
  category: "domestic" | "international" | string;
  description: string | null;
  image_url: string | null;
  inclusions: string[] | null;
  itinerary: unknown | null;
  created_at: string;
  updated_at: string;
};

export type LocalService = {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  created_at: string;
  updated_at: string;
};

export type LocalEnquiry = {
  id: string;
  name: string;
  phone: string;
  destination: string | null;
  message: string | null;
  travel_date: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

const TOURS_KEY = "sandis_local_tours_v1";
const SERVICES_KEY = "sandis_local_services_v1";
const ENQUIRIES_KEY = "sandis_local_enquiries_v1";

const nowIso = () => new Date().toISOString();

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const safeRead = <T,>(key: string, fallback: T): T => {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const safeWrite = (key: string, value: unknown) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

const seedTours = (): LocalTour[] => {
  const timestamp = nowIso();
  return seedTours.map((tour: SeedTour) => ({
    id: tour.id,
    name: tour.name,
    duration: tour.duration,
    price: tour.price,
    category: tour.category,
    description: tour.description ?? null,
    image_url: null,
    inclusions: tour.inclusions ?? null,
    itinerary: { itinerary: tour.itinerary ?? [] },
    created_at: timestamp,
    updated_at: timestamp,
  }));
};

const seedServices = (): LocalService[] => {
  const timestamp = nowIso();
  return seedServices.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description ?? null,
    icon: service.icon,
    created_at: timestamp,
    updated_at: timestamp,
  }));
};

export const getTours = (): LocalTour[] => safeRead(TOURS_KEY, seedTours());

export const saveTours = (tours: LocalTour[]) => {
  safeWrite(TOURS_KEY, tours);
};

export const upsertTour = (tour: Partial<LocalTour> & { id?: string }) => {
  const tours = getTours();
  const timestamp = nowIso();
  if (tour.id) {
    const updated = tours.map((item) =>
      item.id === tour.id
        ? { ...item, ...tour, updated_at: timestamp }
        : item
    );
    saveTours(updated);
    return updated;
  }

  const newTour: LocalTour = {
    id: createId(),
    name: tour.name || "Untitled Tour",
    duration: tour.duration || "",
    price: tour.price || "",
    category: tour.category || "domestic",
    description: tour.description ?? null,
    image_url: tour.image_url ?? null,
    inclusions: tour.inclusions ?? null,
    itinerary: tour.itinerary ?? null,
    created_at: timestamp,
    updated_at: timestamp,
  };
  const next = [newTour, ...tours];
  saveTours(next);
  return next;
};

export const deleteTour = (id: string) => {
  const next = getTours().filter((t) => t.id !== id);
  saveTours(next);
  return next;
};

export const getServices = (): LocalService[] => safeRead(SERVICES_KEY, seedServices());

export const saveServices = (services: LocalService[]) => {
  safeWrite(SERVICES_KEY, services);
};

export const upsertService = (service: Partial<LocalService> & { id?: string }) => {
  const services = getServices();
  const timestamp = nowIso();
  if (service.id) {
    const updated = services.map((item) =>
      item.id === service.id
        ? { ...item, ...service, updated_at: timestamp }
        : item
    );
    saveServices(updated);
    return updated;
  }

  const newService: LocalService = {
    id: createId(),
    title: service.title || "Untitled Service",
    description: service.description ?? null,
    icon: service.icon || "Plane",
    created_at: timestamp,
    updated_at: timestamp,
  };
  const next = [newService, ...services];
  saveServices(next);
  return next;
};

export const deleteService = (id: string) => {
  const next = getServices().filter((s) => s.id !== id);
  saveServices(next);
  return next;
};

export const getEnquiries = (): LocalEnquiry[] => safeRead(ENQUIRIES_KEY, []);

export const saveEnquiries = (enquiries: LocalEnquiry[]) => {
  safeWrite(ENQUIRIES_KEY, enquiries);
};

export const addEnquiry = (payload: Omit<LocalEnquiry, "id" | "created_at" | "status"> & { status?: LocalEnquiry["status"] }) => {
  const enquiries = getEnquiries();
  const next: LocalEnquiry = {
    id: createId(),
    name: payload.name,
    phone: payload.phone,
    destination: payload.destination ?? null,
    message: payload.message ?? null,
    travel_date: payload.travel_date ?? null,
    status: payload.status ?? "new",
    created_at: nowIso(),
  };
  const updated = [next, ...enquiries];
  saveEnquiries(updated);
  return updated;
};

export const updateEnquiryStatus = (id: string, status: LocalEnquiry["status"]) => {
  const updated = getEnquiries().map((item) =>
    item.id === id ? { ...item, status } : item
  );
  saveEnquiries(updated);
  return updated;
};

export const deleteEnquiry = (id: string) => {
  const updated = getEnquiries().filter((item) => item.id !== id);
  saveEnquiries(updated);
  return updated;
};
