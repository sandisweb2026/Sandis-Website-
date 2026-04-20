import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  buildTourExtras,
  createEmptyFaqItem,
  createEmptyItineraryItem,
  extractTourExtras,
  joinLines,
  splitLines,
  type TourFaqItem,
  type TourItineraryItem,
} from "@/lib/content-types";
import {
  createTour,
  fetchTours,
  removeTour,
  updateTour,
  uploadTourImage,
  uploadTourImages,
  type TourRecord,
} from "@/lib/travel-cms";

type TourFormState = {
  id?: string;
  name: string;
  duration: string;
  price: string;
  category: "maharashtra" | "india" | "international";
  description: string;
  image_url: string;
  heroGalleryText: string;
  inclusionsText: string;
  highlightsText: string;
  exclusionsText: string;
  termsText: string;
  galleryText: string;
  itinerary: TourItineraryItem[];
  faqs: TourFaqItem[];
};

const createBlankTourForm = (): TourFormState => ({
  name: "",
  duration: "",
  price: "",
  category: "india",
  description: "",
  image_url: "",
  heroGalleryText: "",
  inclusionsText: "",
  highlightsText: "",
  exclusionsText: "",
  termsText: "",
  galleryText: "",
  itinerary: [createEmptyItineraryItem()],
  faqs: [createEmptyFaqItem()],
});

const createTourForm = (tour?: TourRecord): TourFormState => {
  if (!tour) return createBlankTourForm();

  const extras = extractTourExtras(tour.itinerary ?? null);
  const haystack = `${tour.name} ${tour.description ?? ""}`.toLowerCase();
  const maharashtraKeywords = [
    "maharashtra",
    "mumbai",
    "pune",
    "shirdi",
    "nagpur",
    "nashik",
    "aurangabad",
    "kolhapur",
  ];
  const isMaharashtraTour = maharashtraKeywords.some((keyword) =>
    haystack.includes(keyword),
  );

  return {
    id: tour.id,
    name: tour.name,
    duration: tour.duration,
    price: tour.price,
    category:
      tour.category === "international"
        ? "international"
        : tour.category === "maharashtra"
          ? "maharashtra"
          : tour.category === "india"
            ? "india"
            : isMaharashtraTour
              ? "maharashtra"
              : "india",
    description: tour.description ?? "",
    image_url: tour.image_url ?? "",
    heroGalleryText: joinLines(extras.heroGallery),
    inclusionsText: joinLines(tour.inclusions),
    highlightsText: joinLines(extras.highlights),
    exclusionsText: joinLines(extras.exclusions),
    termsText: joinLines(extras.terms),
    galleryText: joinLines(extras.gallery),
    itinerary:
      extras.itinerary.length > 0
        ? extras.itinerary
        : [createEmptyItineraryItem()],
    faqs: extras.faqs.length > 0 ? extras.faqs : [createEmptyFaqItem()],
  };
};

const normalizeFaqs = (faqs: TourFaqItem[]) =>
  faqs
    .map((faq) => ({
      q: faq.q.trim(),
      a: faq.a.trim(),
    }))
    .filter((faq) => faq.q || faq.a);

const normalizeItinerary = (itinerary: TourItineraryItem[]) =>
  itinerary
    .map((item, index) => ({
      day: item.day.trim() || `Day ${index + 1}`,
      title: item.title.trim(),
      description: item.description.trim(),
    }))
    .filter((item) => item.title || item.description);

const toNullableList = (value: string) => {
  const lines = splitLines(value);
  return lines.length > 0 ? lines : null;
};

const AdminTours = () => {
  const [tours, setTours] = useState<TourRecord[]>([]);
  const [editing, setEditing] = useState<TourFormState | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingHeroGallery, setUploadingHeroGallery] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const loadTours = async () => {
    try {
      setTours(await fetchTours());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load tours.";
      toast.error(message);
    }
  };

  useEffect(() => {
    loadTours();
  }, []);

  const handleSave = async () => {
    if (!editing) return;

    const name = editing.name.trim();
    const duration = editing.duration.trim();
    const price = editing.price.trim();
    const category = editing.category;

    const missing: string[] = [];
    if (!name) missing.push("Tour Name");
    if (!duration) missing.push("Duration");
    if (!price) missing.push("Price");
    if (!category) missing.push("Category");

    if (missing.length > 0) {
      toast.error(`Please fill required: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);

    const itinerary = normalizeItinerary(editing.itinerary);
    const faqs = normalizeFaqs(editing.faqs);
    const heroGallery = splitLines(editing.heroGalleryText);

    if (heroGallery.length > 0 && heroGallery.length < 3) {
      toast.error("Please add at least 3 hero carousel images.");
      setLoading(false);
      return;
    }

    if (heroGallery.length > 5) {
      toast.error("Hero carousel supports a maximum of 5 images.");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      duration,
      price,
      category,
      description: editing.description.trim() || null,
      image_url: editing.image_url.trim() || null,
      inclusions: toNullableList(editing.inclusionsText),
      itinerary: buildTourExtras({
        itinerary,
        highlights: splitLines(editing.highlightsText),
        exclusions: splitLines(editing.exclusionsText),
        terms: splitLines(editing.termsText),
        heroGallery,
        gallery: splitLines(editing.galleryText),
        faqs,
      }),
    };

    try {
      if (editing.id) {
        await updateTour(editing.id, payload);
        toast.success("Tour updated.");
      } else {
        await createTour(payload);
        toast.success("Tour created.");
      }

      setEditing(null);
      await loadTours();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save the tour.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tour?")) return;

    try {
      await removeTour(id);
      toast.success("Tour deleted.");
      await loadTours();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete the tour.";
      toast.error(message);
    }
  };

  const updateItineraryItem = (
    index: number,
    field: keyof TourItineraryItem,
    value: string,
  ) => {
    if (!editing) return;

    const next = editing.itinerary.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    );
    setEditing({ ...editing, itinerary: next });
  };

  const updateFaqItem = (
    index: number,
    field: keyof TourFaqItem,
    value: string,
  ) => {
    if (!editing) return;

    const next = editing.faqs.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    );
    setEditing({ ...editing, faqs: next });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !editing) return;

    const allowedTypes = new Set(["image/png", "image/jpeg"]);
    if (!allowedTypes.has(file.type)) {
      toast.error("Please upload a PNG, JPG, or JPEG image.");
      event.target.value = "";
      return;
    }

    setUploadingImage(true);

    try {
      const uploadedUrl = await uploadTourImage(file);
      setEditing({ ...editing, image_url: uploadedUrl });
      toast.success("Image uploaded.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload image.";
      toast.error(message);
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleGalleryUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files?.length || !editing) return;

    const allowedTypes = new Set(["image/png", "image/jpeg"]);
    const invalidFile = Array.from(files).find(
      (file) => !allowedTypes.has(file.type),
    );

    if (invalidFile) {
      toast.error("Please upload only PNG, JPG, or JPEG images.");
      event.target.value = "";
      return;
    }

    setUploadingGallery(true);

    try {
      const urls = await uploadTourImages(files);
      const nextGallery = [...splitLines(editing.galleryText), ...urls];
      setEditing({ ...editing, galleryText: joinLines(nextGallery) });
      toast.success(`${urls.length} gallery image(s) uploaded.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to upload gallery images.";
      toast.error(message);
    } finally {
      setUploadingGallery(false);
      event.target.value = "";
    }
  };

  const handleHeroGalleryUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files?.length || !editing) return;

    const allowedTypes = new Set(["image/png", "image/jpeg"]);
    const invalidFile = Array.from(files).find(
      (file) => !allowedTypes.has(file.type),
    );

    if (invalidFile) {
      toast.error("Please upload only PNG, JPG, or JPEG images.");
      event.target.value = "";
      return;
    }

    const currentHeroGallery = splitLines(editing.heroGalleryText);
    if (currentHeroGallery.length + files.length > 5) {
      toast.error("Hero carousel supports up to 5 images.");
      event.target.value = "";
      return;
    }

    setUploadingHeroGallery(true);

    try {
      const urls = await uploadTourImages(files);
      const nextHeroGallery = [...currentHeroGallery, ...urls];
      setEditing({
        ...editing,
        heroGalleryText: joinLines(nextHeroGallery),
      });
      toast.success(`${urls.length} hero image(s) uploaded.`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to upload hero images.";
      toast.error(message);
    } finally {
      setUploadingHeroGallery(false);
      event.target.value = "";
    }
  };

  const removeLineItem = (value: string, indexToRemove: number) =>
    joinLines(
      splitLines(value).filter((_, currentIndex) => currentIndex !== indexToRemove),
    );

  if (editing) {
    return (
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold mb-2 text-foreground">
            {editing.id ? "Edit Tour" : "Add Tour"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Fill the same content blocks that appear on the Holidays package
            detail page.
          </p>

          <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Tour Name *"
                value={editing.name}
                onChange={(event) =>
                  setEditing({ ...editing, name: event.target.value })
                }
              />
              <select
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={editing.category}
                onChange={(event) =>
                  setEditing({
                    ...editing,
                    category: event.target.value as TourFormState["category"],
                  })
                }
              >
                <option value="maharashtra">Maharashtra</option>
                <option value="india">India</option>
                <option value="international">International</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Duration *"
                value={editing.duration}
                onChange={(event) =>
                  setEditing({ ...editing, duration: event.target.value })
                }
              />
              <Input
                placeholder="Price *"
                value={editing.price}
                onChange={(event) =>
                  setEditing({ ...editing, price: event.target.value })
                }
              />
            </div>

            <div className="space-y-4 rounded-2xl border p-4">
              <div>
                <h2 className="font-semibold text-foreground">Hero Image</h2>
                <p className="text-sm text-muted-foreground">
                  Upload a PNG, JPG, or JPEG image from your computer, or paste
                  an image URL manually.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1.2fr,0.8fr] gap-4 items-start">
                <Input
                  placeholder="Hero Image URL"
                  value={editing.image_url}
                  onChange={(event) =>
                    setEditing({ ...editing, image_url: event.target.value })
                  }
                />
                <div className="space-y-2">
                  <label
                    htmlFor="tour-image-upload"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
                  >
                    <Upload size={16} />
                    {uploadingImage ? "Uploading..." : "Upload From Computer"}
                  </label>
                  <input
                    id="tour-image-upload"
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PNG, JPG, JPEG. Max size: 4 MB.
                  </p>
                </div>
              </div>

              {editing.image_url && (
                <div className="overflow-hidden rounded-xl border bg-muted max-w-md">
                  <img
                    src={editing.image_url}
                    alt="Tour preview"
                    className="h-56 w-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-2xl border p-4 bg-background">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">
                    Hero Carousel Images
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Upload 3 to 5 images for the top hero carousel on the tour
                    detail page. If you leave this empty, the single hero image
                    above will be used.
                  </p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="tour-hero-gallery-upload"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
                  >
                    {uploadingHeroGallery
                      ? "Uploading..."
                      : "Upload Hero Carousel Images"}
                  </label>
                  <input
                    id="tour-hero-gallery-upload"
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    multiple
                    className="hidden"
                    onChange={handleHeroGalleryUpload}
                    disabled={uploadingHeroGallery}
                  />
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PNG, JPG, JPEG. Use 3 to 5 images. Max
                    size: 4 MB per file.
                  </p>
                </div>
              </div>

              <Textarea
                placeholder="Hero carousel image URLs (one URL per line)"
                value={editing.heroGalleryText}
                onChange={(event) =>
                  setEditing({ ...editing, heroGalleryText: event.target.value })
                }
                rows={4}
              />

              {splitLines(editing.heroGalleryText).length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {splitLines(editing.heroGalleryText).length} hero image(s)
                    selected
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {splitLines(editing.heroGalleryText).map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="overflow-hidden rounded-xl border bg-muted"
                      >
                        <img
                          src={src}
                          alt={`Hero carousel ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />
                        <div className="flex items-center justify-between border-t bg-background px-3 py-2">
                          <span className="text-xs text-muted-foreground">
                            Image {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setEditing({
                                ...editing,
                                heroGalleryText: removeLineItem(
                                  editing.heroGalleryText,
                                  index,
                                ),
                              })
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Textarea
              placeholder="Description"
              value={editing.description}
              onChange={(event) =>
                setEditing({ ...editing, description: event.target.value })
              }
              rows={4}
            />

            <Textarea
              placeholder="Inclusions (one item per line)"
              value={editing.inclusionsText}
              onChange={(event) =>
                setEditing({ ...editing, inclusionsText: event.target.value })
              }
              rows={4}
            />

            <div className="space-y-4 rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">Itinerary</h2>
                  <p className="text-sm text-muted-foreground">
                    Add each day exactly as you want it shown on the tour page.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      itinerary: [
                        ...editing.itinerary,
                        createEmptyItineraryItem(editing.itinerary.length + 1),
                      ],
                    })
                  }
                  className="gap-1"
                >
                  <Plus size={16} /> Add Day
                </Button>
              </div>

              <div className="space-y-4">
                {editing.itinerary.map((item, index) => (
                  <div
                    key={`itinerary-${index}`}
                    className="rounded-xl border bg-muted/40 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-foreground">
                        Itinerary Item {index + 1}
                      </p>
                      {editing.itinerary.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              itinerary: editing.itinerary.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            })
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Day label"
                        value={item.day}
                        onChange={(event) =>
                          updateItineraryItem(index, "day", event.target.value)
                        }
                      />
                      <Input
                        placeholder="Title"
                        value={item.title}
                        onChange={(event) =>
                          updateItineraryItem(index, "title", event.target.value)
                        }
                      />
                    </div>
                    <Textarea
                      placeholder="Description"
                      value={item.description}
                      onChange={(event) =>
                        updateItineraryItem(
                          index,
                          "description",
                          event.target.value,
                        )
                      }
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                placeholder="Highlights (one item per line)"
                value={editing.highlightsText}
                onChange={(event) =>
                  setEditing({ ...editing, highlightsText: event.target.value })
                }
                rows={5}
              />
              <Textarea
                placeholder="Exclusions (one item per line)"
                value={editing.exclusionsText}
                onChange={(event) =>
                  setEditing({ ...editing, exclusionsText: event.target.value })
                }
                rows={5}
              />
              <Textarea
                placeholder="Terms & Conditions (one item per line)"
                value={editing.termsText}
                onChange={(event) =>
                  setEditing({ ...editing, termsText: event.target.value })
                }
                rows={5}
              />
              <Textarea
                placeholder="Gallery image URLs (one URL per line)"
                value={editing.galleryText}
                onChange={(event) =>
                  setEditing({ ...editing, galleryText: event.target.value })
                }
                rows={5}
              />
            </div>

            <div className="rounded-2xl border p-4 bg-background">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">
                    Upload Gallery Images
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Select one or more images from your computer to add to the
                    gallery.
                  </p>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="tour-gallery-upload"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
                  >
                    {uploadingGallery ? "Uploading..." : "Upload Gallery Images"}
                  </label>
                  <input
                    id="tour-gallery-upload"
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                    disabled={uploadingGallery}
                  />
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PNG, JPG, JPEG. Max size: 4 MB per file.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">FAQs</h2>
                  <p className="text-sm text-muted-foreground">
                    Add common customer questions and answers for this package.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      faqs: [...editing.faqs, createEmptyFaqItem()],
                    })
                  }
                  className="gap-1"
                >
                  <Plus size={16} /> Add FAQ
                </Button>
              </div>

              <div className="space-y-4">
                {editing.faqs.map((faq, index) => (
                  <div
                    key={`faq-${index}`}
                    className="rounded-xl border bg-muted/40 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-foreground">
                        FAQ {index + 1}
                      </p>
                      {editing.faqs.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditing({
                              ...editing,
                              faqs: editing.faqs.filter(
                                (_, itemIndex) => itemIndex !== index,
                              ),
                            })
                          }
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <Input
                      placeholder="Question"
                      value={faq.q}
                      onChange={(event) =>
                        updateFaqItem(index, "q", event.target.value)
                      }
                    />
                    <Textarea
                      placeholder="Answer"
                      value={faq.a}
                      onChange={(event) =>
                        updateFaqItem(index, "a", event.target.value)
                      }
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Tour"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Manage Tours</h1>
          </div>
          <Button
            onClick={() => setEditing(createBlankTourForm())}
            className="gap-1"
          >
            <Plus size={16} /> Add Tour
          </Button>
        </div>

        <div className="space-y-3">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-card rounded-xl shadow-card p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-foreground">{tour.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {tour.duration} | {tour.price} | {tour.category}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(createTourForm(tour))}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(tour.id)}
                  className="text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          {tours.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No tours yet. Add your first tour.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTours;
