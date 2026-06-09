import { apiRequest } from "@/lib/api-client";
import type {
  BannerPageKey,
  BannerPayload,
  BannerRecord,
  EnquiryPayload,
  EnquiryRecord,
  EnquiryStatus,
  GalleryImagePayload,
  GalleryImageRecord,
  HolidayCategoryPayload,
  HolidayCategoryRecord,
  HolidayPackagePayload,
  HolidayPackageRecord,
  ServicePayload,
  ServiceRecord,
  TourPayload,
  TourRecord,
} from "@/lib/content-types";

export const fetchTours = async () => {
  const response = await apiRequest<{ tours: TourRecord[] }>("/tours");
  return response.tours;
};

export const fetchTourById = async (id: string) => {
  const response = await apiRequest<{ tour: TourRecord }>(`/tours/${id}`);
  return response.tour;
};

export const createTour = async (payload: TourPayload) => {
  const response = await apiRequest<{ tour: TourRecord }>("/admin/tours", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  });
  return response.tour;
};

export const updateTour = async (id: string, payload: TourPayload) => {
  const response = await apiRequest<{ tour: TourRecord }>(`/admin/tours/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    auth: true,
  });
  return response.tour;
};

export const removeTour = async (id: string) => {
  await apiRequest<void>(`/admin/tours/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

export const uploadTourImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await apiRequest<{ url: string; filename: string }>(
    "/admin/uploads/tour-image",
    {
      method: "POST",
      body: formData,
      auth: true,
    },
  );

  return response.url;
};

export const uploadTourImages = async (files: FileList | File[]) => {
  const selectedFiles = Array.from(files);
  const urls: string[] = [];

  for (const file of selectedFiles) {
    const url = await uploadTourImage(file);
    urls.push(url);
  }

  return urls;
};

export const fetchServices = async () => {
  const response = await apiRequest<{ services: ServiceRecord[] }>("/services");
  return response.services;
};

export const createService = async (payload: ServicePayload) => {
  const response = await apiRequest<{ service: ServiceRecord }>(
    "/admin/services",
    {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    },
  );
  return response.service;
};

export const updateService = async (id: string, payload: ServicePayload) => {
  const response = await apiRequest<{ service: ServiceRecord }>(
    `/admin/services/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      auth: true,
    },
  );
  return response.service;
};

export const removeService = async (id: string) => {
  await apiRequest<void>(`/admin/services/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

export const createEnquiry = async (payload: EnquiryPayload) => {
  const response = await apiRequest<{ enquiry: EnquiryRecord }>("/enquiries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.enquiry;
};

export const fetchEnquiries = async () => {
  const response = await apiRequest<{ enquiries: EnquiryRecord[] }>(
    "/admin/enquiries",
    {
      auth: true,
    },
  );
  return response.enquiries;
};

export const setEnquiryStatus = async (id: string, status: EnquiryStatus) => {
  const response = await apiRequest<{ enquiry: EnquiryRecord }>(
    `/admin/enquiries/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
      auth: true,
    },
  );
  return response.enquiry;
};

export const removeEnquiry = async (id: string) => {
  await apiRequest<void>(`/admin/enquiries/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

export const fetchDashboardStats = async () =>
  apiRequest<{
    packages?: number;
    categories?: number;
    banners?: number;
    galleryImages?: number;
    tours: number;
    services: number;
    enquiries: number;
    newEnquiries: number;
  }>("/admin/dashboard", { auth: true });

export const fetchBanners = async (
  page?: BannerPageKey,
  includeInactive = false,
) => {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (includeInactive) params.set("active", "0");

  const suffix = params.toString() ? `?${params.toString()}` : "";
  const response = await apiRequest<{ banners: BannerRecord[] }>(
    `/banners${suffix}`,
  );
  return response.banners;
};

export const fetchAdminBanners = async () => {
  const response = await apiRequest<{ banners: BannerRecord[] }>("/admin/banners", {
    auth: true,
  });
  return response.banners;
};

export const createBanner = async (payload: BannerPayload) => {
  const response = await apiRequest<{ banner: BannerRecord }>("/admin/banners", {
    method: "POST",
    body: JSON.stringify(payload),
    auth: true,
  });
  return response.banner;
};

export const updateBanner = async (id: string, payload: BannerPayload) => {
  const response = await apiRequest<{ banner: BannerRecord }>(
    `/admin/banners/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      auth: true,
    },
  );
  return response.banner;
};

export const removeBanner = async (id: string) => {
  await apiRequest<void>(`/admin/banners/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

export const fetchHolidayCategories = async (includeInactive = false) => {
  const suffix = includeInactive ? "?include_inactive=1" : "";
  const response = await apiRequest<{ categories: HolidayCategoryRecord[] }>(
    `/categories${suffix}`,
  );
  return response.categories;
};

export const fetchAdminHolidayCategories = async () => {
  const response = await apiRequest<{ categories: HolidayCategoryRecord[] }>(
    "/admin/categories",
    { auth: true },
  );
  return response.categories;
};

export const createHolidayCategory = async (payload: HolidayCategoryPayload) => {
  const response = await apiRequest<{ category: HolidayCategoryRecord }>(
    "/admin/categories",
    {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    },
  );
  return response.category;
};

export const updateHolidayCategory = async (
  id: string,
  payload: HolidayCategoryPayload,
) => {
  const response = await apiRequest<{ category: HolidayCategoryRecord }>(
    `/admin/categories/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      auth: true,
    },
  );
  return response.category;
};

export const removeHolidayCategory = async (id: string) => {
  await apiRequest<void>(`/admin/categories/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

export const fetchHolidayPackages = async (
  categorySlug?: string,
  includeInactive = false,
) => {
  const params = new URLSearchParams();
  if (categorySlug) params.set("category", categorySlug);
  if (includeInactive) params.set("include_inactive", "1");
  const suffix = params.toString() ? `?${params.toString()}` : "";
  const response = await apiRequest<{ packages: HolidayPackageRecord[] }>(
    `/packages${suffix}`,
  );
  return response.packages;
};

export const fetchHolidayPackageBySlug = async (slug: string) => {
  const response = await apiRequest<{ package: HolidayPackageRecord }>(
    `/packages/${slug}`,
  );
  return response.package;
};

export const fetchAdminHolidayPackages = async () => {
  const response = await apiRequest<{ packages: HolidayPackageRecord[] }>(
    "/admin/packages",
    { auth: true },
  );
  return response.packages;
};

export const fetchAdminHolidayPackage = async (id: string) => {
  const response = await apiRequest<{ package: HolidayPackageRecord }>(
    `/admin/packages/${id}`,
    { auth: true },
  );
  return response.package;
};

export const createHolidayPackage = async (payload: HolidayPackagePayload) => {
  const response = await apiRequest<{ package: HolidayPackageRecord }>(
    "/admin/packages",
    {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    },
  );
  return response.package;
};

export const updateHolidayPackage = async (
  id: string,
  payload: HolidayPackagePayload,
) => {
  const response = await apiRequest<{ package: HolidayPackageRecord }>(
    `/admin/packages/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      auth: true,
    },
  );
  return response.package;
};

export const removeHolidayPackage = async (id: string) => {
  await apiRequest<void>(`/admin/packages/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

export const fetchGalleryImages = async (includeInactive = false) => {
  const suffix = includeInactive ? "?include_inactive=1" : "";
  const response = await apiRequest<{ images: GalleryImageRecord[] }>(
    `/gallery-images${suffix}`,
  );
  return response.images;
};

export const fetchAdminGalleryImages = async () => {
  const response = await apiRequest<{ images: GalleryImageRecord[] }>(
    "/admin/gallery-images",
    { auth: true },
  );
  return response.images;
};

export const createGalleryImage = async (payload: GalleryImagePayload) => {
  const response = await apiRequest<{ image: GalleryImageRecord }>(
    "/admin/gallery-images",
    {
      method: "POST",
      body: JSON.stringify(payload),
      auth: true,
    },
  );
  return response.image;
};

export const updateGalleryImage = async (
  id: string,
  payload: GalleryImagePayload,
) => {
  const response = await apiRequest<{ image: GalleryImageRecord }>(
    `/admin/gallery-images/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
      auth: true,
    },
  );
  return response.image;
};

export const removeGalleryImage = async (id: string) => {
  await apiRequest<void>(`/admin/gallery-images/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

export const fetchPublicSettings = async () => {
  const response = await apiRequest<{ settings: Record<string, string | null> }>(
    "/settings/public",
  );
  return response.settings;
};

export const fetchAdminSettings = async () => {
  const response = await apiRequest<{
    settings: Array<{
      id: string;
      setting_key: string;
      setting_value: string | null;
      created_at: string;
      updated_at: string;
    }>;
  }>("/admin/settings", { auth: true });
  return response.settings;
};

export const upsertAdminSetting = async (
  setting_key: string,
  setting_value: string | null,
) => {
  const response = await apiRequest<{
    setting: {
      id: string;
      setting_key: string;
      setting_value: string | null;
      created_at: string;
      updated_at: string;
    };
  }>("/admin/settings", {
    method: "POST",
    body: JSON.stringify({ setting_key, setting_value }),
    auth: true,
  });
  return response.setting;
};

export const getTourImage = (
  tour: Pick<TourRecord, "image_url" | "name">,
  images: Record<string, string>,
  fallbackImage: string,
) => tour.image_url || images[tour.name] || fallbackImage;

export type {
  AdminUser,
  BannerPageKey,
  BannerRecord,
  EnquiryRecord,
  EnquiryStatus,
  GalleryImageRecord,
  HolidayCategoryRecord,
  HolidayPackageRecord,
  ServiceRecord,
  TourRecord,
} from "@/lib/content-types";
