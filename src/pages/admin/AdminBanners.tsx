import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createBanner,
  fetchAdminBanners,
  removeBanner,
  updateBanner,
  uploadTourImage,
  type BannerPageKey,
  type BannerRecord,
} from "@/lib/travel-cms";

const pageOptions: BannerPageKey[] = [
  "home",
  "holidays",
  "holiday-detail",
  "about",
  "contact",
  "gallery",
];

type BannerFormState = {
  id?: string;
  page_key: BannerPageKey;
  title: string;
  subtitle: string;
  image_url: string;
  mobile_image_url: string;
  cta_label: string;
  cta_link: string;
  display_order: string;
  is_active: boolean;
};

const createBlankBanner = (): BannerFormState => ({
  page_key: "home",
  title: "",
  subtitle: "",
  image_url: "",
  mobile_image_url: "",
  cta_label: "",
  cta_link: "",
  display_order: "0",
  is_active: true,
});

const createBannerForm = (banner?: BannerRecord): BannerFormState => ({
  id: banner?.id,
  page_key: banner?.page_key ?? "home",
  title: banner?.title ?? "",
  subtitle: banner?.subtitle ?? "",
  image_url: banner?.image_url ?? "",
  mobile_image_url: banner?.mobile_image_url ?? "",
  cta_label: banner?.cta_label ?? "",
  cta_link: banner?.cta_link ?? "",
  display_order: String(banner?.display_order ?? 0),
  is_active: banner?.is_active ?? true,
});

const AdminBanners = () => {
  const [banners, setBanners] = useState<BannerRecord[]>([]);
  const [editing, setEditing] = useState<BannerFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadBanners = async () => {
    try {
      setBanners(await fetchAdminBanners());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load banners.";
      toast.error(message);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.image_url.trim()) {
      toast.error("Banner image is required.");
      return;
    }

    setSaving(true);

    const payload = {
      page_key: editing.page_key,
      title: editing.title.trim() || null,
      subtitle: editing.subtitle.trim() || null,
      image_url: editing.image_url.trim(),
      mobile_image_url: editing.mobile_image_url.trim() || null,
      cta_label: editing.cta_label.trim() || null,
      cta_link: editing.cta_link.trim() || null,
      display_order: Number(editing.display_order) || 0,
      is_active: editing.is_active,
    };

    try {
      if (editing.id) {
        await updateBanner(editing.id, payload);
        toast.success("Banner updated.");
      } else {
        await createBanner(payload);
        toast.success("Banner created.");
      }

      setEditing(null);
      await loadBanners();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save banner.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;

    try {
      await removeBanner(id);
      toast.success("Banner deleted.");
      await loadBanners();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete banner.";
      toast.error(message);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "image_url" | "mobile_image_url",
  ) => {
    const file = event.target.files?.[0];
    if (!file || !editing) return;

    setUploading(true);

    try {
      const uploadedUrl = await uploadTourImage(file);
      setEditing({ ...editing, [field]: uploadedUrl });
      toast.success("Image uploaded.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to upload image.";
      toast.error(message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  if (editing) {
    return (
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            {editing.id ? "Edit Banner" : "Add Banner"}
          </h1>
          <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-4">
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={editing.page_key}
              onChange={(event) =>
                setEditing({
                  ...editing,
                  page_key: event.target.value as BannerPageKey,
                })
              }
            >
              {pageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <Input
              placeholder="Title"
              value={editing.title}
              onChange={(event) =>
                setEditing({ ...editing, title: event.target.value })
              }
            />
            <Textarea
              placeholder="Subtitle"
              value={editing.subtitle}
              onChange={(event) =>
                setEditing({ ...editing, subtitle: event.target.value })
              }
              rows={3}
            />

            <Input
              placeholder="Banner Image URL *"
              value={editing.image_url}
              onChange={(event) =>
                setEditing({ ...editing, image_url: event.target.value })
              }
            />
            <label
              htmlFor="banner-image-upload"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Banner Image"}
            </label>
            <input
              id="banner-image-upload"
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              className="hidden"
              onChange={(event) => handleImageUpload(event, "image_url")}
              disabled={uploading}
            />

            <Input
              placeholder="Mobile Banner Image URL"
              value={editing.mobile_image_url}
              onChange={(event) =>
                setEditing({ ...editing, mobile_image_url: event.target.value })
              }
            />
            <label
              htmlFor="banner-mobile-image-upload"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Mobile Banner Image"}
            </label>
            <input
              id="banner-mobile-image-upload"
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              className="hidden"
              onChange={(event) => handleImageUpload(event, "mobile_image_url")}
              disabled={uploading}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="CTA Label"
                value={editing.cta_label}
                onChange={(event) =>
                  setEditing({ ...editing, cta_label: event.target.value })
                }
              />
              <Input
                placeholder="CTA Link"
                value={editing.cta_link}
                onChange={(event) =>
                  setEditing({ ...editing, cta_link: event.target.value })
                }
              />
            </div>

            <Input
              placeholder="Display Order"
              type="number"
              value={editing.display_order}
              onChange={(event) =>
                setEditing({ ...editing, display_order: event.target.value })
              }
            />

            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={editing.is_active}
                onChange={(event) =>
                  setEditing({ ...editing, is_active: event.target.checked })
                }
              />
              Active banner
            </label>

            {editing.image_url && (
              <div className="overflow-hidden rounded-xl border bg-muted max-w-xl">
                <img
                  src={editing.image_url}
                  alt="Banner preview"
                  className="h-52 w-full object-cover"
                />
              </div>
            )}

            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Banner"}
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
            <h1 className="text-2xl font-bold text-foreground">Manage Banners</h1>
          </div>
          <Button
            onClick={() => setEditing(createBlankBanner())}
            className="gap-1"
          >
            <Plus size={16} /> Add Banner
          </Button>
        </div>

        <div className="space-y-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-card rounded-xl shadow-card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={banner.image_url}
                  alt={banner.title ?? banner.page_key}
                  className="h-14 w-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {banner.title || "Untitled banner"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {banner.page_key} | Order: {banner.display_order} |{" "}
                    {banner.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(createBannerForm(banner))}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(banner.id)}
                  className="text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No banners yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;
