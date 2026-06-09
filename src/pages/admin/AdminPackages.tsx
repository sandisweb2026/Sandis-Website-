import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  HolidayCategoryRecord,
  HolidayPackageItineraryItem,
  HolidayPackageRecord,
} from "@/lib/content-types";
import {
  createHolidayPackage,
  fetchAdminHolidayCategories,
  fetchAdminHolidayPackage,
  fetchAdminHolidayPackages,
  removeHolidayPackage,
  updateHolidayPackage,
  uploadTourImage,
  uploadTourImages,
} from "@/lib/travel-cms";

type PackageFormState = {
  id?: string;
  title: string;
  slug: string;
  category_id: string;
  location: string;
  banner_image_url: string;
  short_description: string;
  duration: string;
  trip_type: string;
  price_label: string;
  about_tour: string;
  good_for_title: string;
  good_for_description: string;
  vehicles_title: string;
  vehicles_description: string;
  attraction_title: string;
  attraction_description: string;
  comfort_title: string;
  comfort_description: string;
  itinerary: HolidayPackageItineraryItem[];
  highlightsText: string;
  includedText: string;
  excludedText: string;
  termsText: string;
  galleryText: string;
  whatsapp_enquiry_message: string;
  email_enquiry_subject: string;
  email_enquiry_message: string;
  seo_title: string;
  seo_description: string;
  is_active: boolean;
};

const splitLines = (value: string) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const joinLines = (value: string[] | undefined) => value?.join("\n") ?? "";
const MAX_ITINERARY_DAYS = 15;

const createEmptyItineraryItem = (
  index = 1,
): HolidayPackageItineraryItem => ({
  day: `Day ${index}`,
  title: "",
  description: "",
});

const renumberItineraryDays = (items: HolidayPackageItineraryItem[]) =>
  items.map((item, index) => ({
    ...item,
    day: `Day ${index + 1}`,
  }));

const FieldHeading = ({ text }: { text: string }) => (
  <p className="text-sm font-medium text-foreground">{text}</p>
);

const createBlankPackage = (categoryId = ""): PackageFormState => ({
  title: "",
  slug: "",
  category_id: categoryId,
  location: "",
  banner_image_url: "",
  short_description: "",
  duration: "",
  trip_type: "",
  price_label: "",
  about_tour: "",
  good_for_title: "",
  good_for_description: "",
  vehicles_title: "",
  vehicles_description: "",
  attraction_title: "",
  attraction_description: "",
  comfort_title: "",
  comfort_description: "",
  itinerary: [createEmptyItineraryItem()],
  highlightsText: "",
  includedText: "",
  excludedText: "",
  termsText: "",
  galleryText: "",
  whatsapp_enquiry_message: "",
  email_enquiry_subject: "",
  email_enquiry_message: "",
  seo_title: "",
  seo_description: "",
  is_active: true,
});

const createPackageForm = (packageItem: HolidayPackageRecord): PackageFormState => ({
  id: packageItem.id,
  title: packageItem.title ?? "",
  slug: packageItem.slug ?? "",
  category_id: packageItem.category?.id ?? "",
  location: packageItem.location ?? "",
  banner_image_url: packageItem.banner_image_url ?? "",
  short_description: packageItem.short_description ?? "",
  duration: packageItem.duration ?? "",
  trip_type: packageItem.trip_type ?? "",
  price_label: packageItem.price_label ?? "",
  about_tour: packageItem.about_tour ?? "",
  good_for_title: packageItem.good_for_title ?? "",
  good_for_description: packageItem.good_for_description ?? "",
  vehicles_title: packageItem.vehicles_title ?? "",
  vehicles_description: packageItem.vehicles_description ?? "",
  attraction_title: packageItem.attraction_title ?? "",
  attraction_description: packageItem.attraction_description ?? "",
  comfort_title: packageItem.comfort_title ?? "",
  comfort_description: packageItem.comfort_description ?? "",
  itinerary:
    packageItem.itinerary && packageItem.itinerary.length > 0
      ? packageItem.itinerary.map((item, index) => ({
          day: `Day ${index + 1}`,
          title: item.title,
          description: item.description ?? "",
        }))
      : [createEmptyItineraryItem()],
  highlightsText: joinLines(packageItem.highlights),
  includedText: joinLines(packageItem.included_items),
  excludedText: joinLines(packageItem.excluded_items),
  termsText: joinLines(packageItem.terms),
  galleryText: joinLines(
    packageItem.gallery_images?.map((item) => item.image_url),
  ),
  whatsapp_enquiry_message: packageItem.whatsapp_enquiry_message ?? "",
  email_enquiry_subject: packageItem.email_enquiry_subject ?? "",
  email_enquiry_message: packageItem.email_enquiry_message ?? "",
  seo_title: packageItem.seo_title ?? "",
  seo_description: packageItem.seo_description ?? "",
  is_active: packageItem.is_active ?? true,
});

const AdminPackages = () => {
  const [packages, setPackages] = useState<HolidayPackageRecord[]>([]);
  const [categories, setCategories] = useState<HolidayCategoryRecord[]>([]);
  const [editing, setEditing] = useState<PackageFormState | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [loadingEditor, setLoadingEditor] = useState(false);

  const loadData = async () => {
    const [packagesResult, categoriesResult] = await Promise.allSettled([
      fetchAdminHolidayPackages(),
      fetchAdminHolidayCategories(),
    ]);

    if (packagesResult.status === "fulfilled") {
      setPackages(packagesResult.value);
    }

    if (categoriesResult.status === "fulfilled") {
      setCategories(categoriesResult.value);
    }

    if (
      packagesResult.status === "rejected" ||
      categoriesResult.status === "rejected"
    ) {
      const error =
        categoriesResult.status === "rejected"
          ? categoriesResult.reason
          : packagesResult.status === "rejected"
            ? packagesResult.reason
            : null;
      const message =
        error instanceof Error ? error.message : "Unable to load package data.";
      toast.error(message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    const firstActiveCategory = categories.find((item) => item.is_active);
    setEditing(createBlankPackage(firstActiveCategory?.id ?? ""));
  };

  const openEdit = async (id: string) => {
    try {
      setLoadingEditor(true);
      const record = await fetchAdminHolidayPackage(id);
      setEditing(createPackageForm(record));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load package.";
      toast.error(message);
    } finally {
      setLoadingEditor(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    const title = editing.title.trim();
    if (!title) {
      toast.error("Package title is required.");
      return;
    }

    if (!editing.category_id) {
      toast.error("Please select a category.");
      return;
    }

    const itinerary = editing.itinerary
      .map((item, index) => ({
        day: `Day ${index + 1}`,
        title: item.title.trim(),
        description: item.description?.trim() || "",
      }))
      .filter((item) => item.title || item.description);

    if (itinerary.length > MAX_ITINERARY_DAYS) {
      toast.error(`Only up to ${MAX_ITINERARY_DAYS} itinerary days are allowed.`);
      return;
    }

    setLoading(true);

    const payload = {
      title,
      slug: editing.slug.trim() || undefined,
      category_id: editing.category_id,
      location: editing.location.trim() || null,
      banner_image_url: editing.banner_image_url.trim() || null,
      short_description: editing.short_description.trim() || null,
      duration: editing.duration.trim() || null,
      trip_type: editing.trip_type.trim() || null,
      price_label: editing.price_label.trim() || null,
      about_tour: editing.about_tour.trim() || null,
      good_for_title: editing.good_for_title.trim() || null,
      good_for_description: editing.good_for_description.trim() || null,
      vehicles_title: editing.vehicles_title.trim() || null,
      vehicles_description: editing.vehicles_description.trim() || null,
      attraction_title: editing.attraction_title.trim() || null,
      attraction_description: editing.attraction_description.trim() || null,
      comfort_title: editing.comfort_title.trim() || null,
      comfort_description: editing.comfort_description.trim() || null,
      itinerary,
      highlights: splitLines(editing.highlightsText),
      included_items: splitLines(editing.includedText),
      excluded_items: splitLines(editing.excludedText),
      terms: splitLines(editing.termsText),
      gallery_images: splitLines(editing.galleryText).map((image_url, index) => ({
        image_url,
        title: null,
        alt_text: null,
        display_order: index,
        is_active: true,
      })),
      whatsapp_enquiry_message: editing.whatsapp_enquiry_message.trim() || null,
      email_enquiry_subject: editing.email_enquiry_subject.trim() || null,
      email_enquiry_message: editing.email_enquiry_message.trim() || null,
      seo_title: editing.seo_title.trim() || null,
      seo_description: editing.seo_description.trim() || null,
      is_active: editing.is_active,
    };

    try {
      if (editing.id) {
        await updateHolidayPackage(editing.id, payload);
        toast.success("Package updated.");
      } else {
        await createHolidayPackage(payload);
        toast.success("Package created.");
      }

      setEditing(null);
      await loadData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save package.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this package?")) return;

    try {
      await removeHolidayPackage(id);
      toast.success("Package deleted.");
      await loadData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete package.";
      toast.error(message);
    }
  };

  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !editing) return;

    setUploadingBanner(true);
    try {
      const url = await uploadTourImage(file);
      setEditing({ ...editing, banner_image_url: url });
      toast.success("Banner image uploaded.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload image.";
      toast.error(message);
    } finally {
      setUploadingBanner(false);
      event.target.value = "";
    }
  };

  const handleGalleryUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files?.length || !editing) return;

    setUploadingGallery(true);
    try {
      const urls = await uploadTourImages(files);
      const nextGallery = [...splitLines(editing.galleryText), ...urls];
      setEditing({ ...editing, galleryText: joinLines(nextGallery) });
      toast.success(`${urls.length} gallery image(s) uploaded.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload gallery.";
      toast.error(message);
    } finally {
      setUploadingGallery(false);
      event.target.value = "";
    }
  };

  const updateItinerary = (
    index: number,
    field: "title" | "description",
    value: string,
  ) => {
    if (!editing) return;
    const next = editing.itinerary.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    );
    setEditing({ ...editing, itinerary: next });
  };

  const handleAddItineraryDay = () => {
    if (!editing) return;
    if (editing.itinerary.length >= MAX_ITINERARY_DAYS) {
      toast.error(`You can add up to ${MAX_ITINERARY_DAYS} itinerary days only.`);
      return;
    }

    const next = [
      ...editing.itinerary,
      createEmptyItineraryItem(editing.itinerary.length + 1),
    ];
    setEditing({
      ...editing,
      itinerary: renumberItineraryDays(next),
    });
  };

  const handleRemoveItineraryDay = (index: number) => {
    if (!editing) return;
    const next = editing.itinerary.filter(
      (_, itineraryIndex) => itineraryIndex !== index,
    );
    setEditing({
      ...editing,
      itinerary:
        next.length > 0
          ? renumberItineraryDays(next)
          : [createEmptyItineraryItem(1)],
    });
  };

  if (editing) {
    return (
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            {editing.id ? "Edit Holiday Package" : "Add Holiday Package"}
          </h1>
          <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldHeading text="Package Title *" />
                <Input
                  placeholder="Package Title *"
                  value={editing.title}
                  onChange={(event) =>
                    setEditing({ ...editing, title: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Slug / URL" />
                <Input
                  placeholder="Slug / URL"
                  value={editing.slug}
                  onChange={(event) =>
                    setEditing({ ...editing, slug: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Category" />
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={editing.category_id}
                  onChange={(event) =>
                    setEditing({ ...editing, category_id: event.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.length === 0 ? (
                    <option value="" disabled>
                      No categories found
                    </option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Location / State / Country" />
                <Input
                  placeholder="Location / State / Country"
                  value={editing.location}
                  onChange={(event) =>
                    setEditing({ ...editing, location: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Duration" />
                <Input
                  placeholder="Duration"
                  value={editing.duration}
                  onChange={(event) =>
                    setEditing({ ...editing, duration: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Trip Type" />
                <Input
                  placeholder="Trip Type"
                  value={editing.trip_type}
                  onChange={(event) =>
                    setEditing({ ...editing, trip_type: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Price / On Request" />
                <Input
                  placeholder="Price / On Request"
                  value={editing.price_label}
                  onChange={(event) =>
                    setEditing({ ...editing, price_label: event.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <FieldHeading text="Banner Image URL" />
              <Input
                placeholder="Banner Image URL"
                value={editing.banner_image_url}
                onChange={(event) =>
                  setEditing({ ...editing, banner_image_url: event.target.value })
                }
              />
            </div>
            <FieldHeading text="Upload Banner Image" />
            <label
              htmlFor="package-banner-upload"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              <Upload size={16} />
              {uploadingBanner ? "Uploading..." : "Upload Banner Image"}
            </label>
            <input
              id="package-banner-upload"
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              className="hidden"
              onChange={handleBannerUpload}
              disabled={uploadingBanner}
            />

            {editing.banner_image_url && (
              <div className="overflow-hidden rounded-xl border bg-muted max-w-xl">
                <img
                  src={editing.banner_image_url}
                  alt="Banner preview"
                  className="h-56 w-full object-cover"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <FieldHeading text="Short Description" />
              <Textarea
                placeholder="Short Description"
                value={editing.short_description}
                onChange={(event) =>
                  setEditing({ ...editing, short_description: event.target.value })
                }
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <FieldHeading text="About Tour" />
              <Textarea
                placeholder="About Tour"
                value={editing.about_tour}
                onChange={(event) =>
                  setEditing({ ...editing, about_tour: event.target.value })
                }
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldHeading text="Good For Title" />
                <Input
                  placeholder="Good For Title"
                  value={editing.good_for_title}
                  onChange={(event) =>
                    setEditing({ ...editing, good_for_title: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Vehicles Title" />
                <Input
                  placeholder="Vehicles Title"
                  value={editing.vehicles_title}
                  onChange={(event) =>
                    setEditing({ ...editing, vehicles_title: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Good For Description" />
                <Textarea
                  placeholder="Good For Description"
                  value={editing.good_for_description}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      good_for_description: event.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Vehicles Description" />
                <Textarea
                  placeholder="Vehicles Description"
                  value={editing.vehicles_description}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      vehicles_description: event.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Attraction / Darshan Title" />
                <Input
                  placeholder="Attraction / Darshan Title"
                  value={editing.attraction_title}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      attraction_title: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Safe Trip / Comfort Title" />
                <Input
                  placeholder="Safe Trip / Comfort Title"
                  value={editing.comfort_title}
                  onChange={(event) =>
                    setEditing({ ...editing, comfort_title: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Attraction / Darshan Description" />
                <Textarea
                  placeholder="Attraction / Darshan Description"
                  value={editing.attraction_description}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      attraction_description: event.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Safe Trip / Comfort Description" />
                <Textarea
                  placeholder="Safe Trip / Comfort Description"
                  value={editing.comfort_description}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      comfort_description: event.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Itinerary</h2>
                <p className="text-xs text-muted-foreground">
                  {editing.itinerary.length}/{MAX_ITINERARY_DAYS} days
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItineraryDay}
                  disabled={editing.itinerary.length >= MAX_ITINERARY_DAYS}
                >
                  <Plus size={14} className="mr-1" /> Add Day
                </Button>
              </div>
              {editing.itinerary.map((item, index) => (
                <div key={`itinerary-${index}`} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="text-sm font-medium text-foreground">
                        Day {index + 1}
                      </p>
                    </div>
                    {editing.itinerary.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItineraryDay(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <FieldHeading text="Itinerary Title" />
                    <Input
                      placeholder="Itinerary Title"
                      value={item.title}
                      onChange={(event) =>
                        updateItinerary(index, "title", event.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldHeading text="Description" />
                    <Textarea
                      placeholder="Description"
                      value={item.description ?? ""}
                      onChange={(event) =>
                        updateItinerary(index, "description", event.target.value)
                      }
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldHeading text="Highlights (one item per line)" />
                <Textarea
                  placeholder="Highlights (one item per line)"
                  value={editing.highlightsText}
                  onChange={(event) =>
                    setEditing({ ...editing, highlightsText: event.target.value })
                  }
                  rows={5}
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="What's Included (one item per line)" />
                <Textarea
                  placeholder="What's Included (one item per line)"
                  value={editing.includedText}
                  onChange={(event) =>
                    setEditing({ ...editing, includedText: event.target.value })
                  }
                  rows={5}
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="What's Excluded (one item per line)" />
                <Textarea
                  placeholder="What's Excluded (one item per line)"
                  value={editing.excludedText}
                  onChange={(event) =>
                    setEditing({ ...editing, excludedText: event.target.value })
                  }
                  rows={5}
                />
              </div>
              <div className="space-y-1.5">
                <FieldHeading text="Terms & Conditions (one item per line)" />
                <Textarea
                  placeholder="Terms & Conditions (one item per line)"
                  value={editing.termsText}
                  onChange={(event) =>
                    setEditing({ ...editing, termsText: event.target.value })
                  }
                  rows={5}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <FieldHeading text="Gallery Image URLs (one URL per line)" />
              <Textarea
                placeholder="Gallery Image URLs (one URL per line)"
                value={editing.galleryText}
                onChange={(event) =>
                  setEditing({ ...editing, galleryText: event.target.value })
                }
                rows={5}
              />
            </div>
            <FieldHeading text="Upload Gallery Images" />
            <label
              htmlFor="package-gallery-upload"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              <Upload size={16} />
              {uploadingGallery ? "Uploading..." : "Upload Gallery Images"}
            </label>
            <input
              id="package-gallery-upload"
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              multiple
              className="hidden"
              onChange={handleGalleryUpload}
              disabled={uploadingGallery}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FieldHeading text="WhatsApp Enquiry Message" />
                <Textarea
                  placeholder="WhatsApp Enquiry Message"
                  value={editing.whatsapp_enquiry_message}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      whatsapp_enquiry_message: event.target.value,
                    })
                  }
                  rows={4}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldHeading text="Email Enquiry Subject" />
                  <Input
                    placeholder="Email Enquiry Subject"
                    value={editing.email_enquiry_subject}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        email_enquiry_subject: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldHeading text="Email Enquiry Message" />
                  <Textarea
                    placeholder="Email Enquiry Message"
                    value={editing.email_enquiry_message}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        email_enquiry_message: event.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <FieldHeading text="SEO Title" />
              <Input
                placeholder="SEO Title"
                value={editing.seo_title}
                onChange={(event) =>
                  setEditing({ ...editing, seo_title: event.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <FieldHeading text="SEO Description" />
              <Textarea
                placeholder="SEO Description"
                value={editing.seo_description}
                onChange={(event) =>
                  setEditing({ ...editing, seo_description: event.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <FieldHeading text="Status" />
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(event) =>
                    setEditing({ ...editing, is_active: event.target.checked })
                  }
                />
                Active package
              </label>
            </div>

            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Package"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">
              Manage Holiday Packages
            </h1>
          </div>
          <Button onClick={openCreate} className="gap-1">
            <Plus size={16} /> Add Package
          </Button>
        </div>

        {loadingEditor && (
          <div className="text-sm text-muted-foreground mb-4">
            Loading package...
          </div>
        )}

        <div className="space-y-3">
          {packages.map((packageItem) => (
            <div
              key={packageItem.id}
              className="bg-card rounded-xl shadow-card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                {packageItem.banner_image_url && (
                  <img
                    src={packageItem.banner_image_url}
                    alt={packageItem.title}
                    className="h-14 w-24 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">
                    {packageItem.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {packageItem.category.name} | {packageItem.duration || "No duration"}{" "}
                    | {packageItem.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(packageItem.id)}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(packageItem.id)}
                  className="text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          {packages.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No holiday packages yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPackages;
