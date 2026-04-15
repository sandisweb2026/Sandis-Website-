import { apiRequest } from "@/lib/api-client";
import type {
  EnquiryPayload,
  EnquiryRecord,
  EnquiryStatus,
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
    tours: number;
    services: number;
    enquiries: number;
    newEnquiries: number;
  }>("/admin/dashboard", { auth: true });

export const getTourImage = (
  tour: Pick<TourRecord, "image_url" | "name">,
  images: Record<string, string>,
  fallbackImage: string,
) => tour.image_url || images[tour.name] || fallbackImage;

export type {
  AdminUser,
  EnquiryRecord,
  EnquiryStatus,
  ServiceRecord,
  TourRecord,
} from "@/lib/content-types";
