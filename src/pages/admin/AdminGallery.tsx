import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createGalleryImage,
  fetchAdminGalleryImages,
  removeGalleryImage,
  updateGalleryImage,
  uploadTourImage,
  type GalleryImageRecord,
} from "@/lib/travel-cms";

type GalleryFormState = {
  id?: string;
  image_url: string;
  title: string;
  category: string;
  alt_text: string;
  display_order: string;
  is_active: boolean;
};

const createBlankImage = (): GalleryFormState => ({
  image_url: "",
  title: "",
  category: "",
  alt_text: "",
  display_order: "0",
  is_active: true,
});

const createImageForm = (image?: GalleryImageRecord): GalleryFormState => ({
  id: image?.id,
  image_url: image?.image_url ?? "",
  title: image?.title ?? "",
  category: image?.category ?? "",
  alt_text: image?.alt_text ?? "",
  display_order: String(image?.display_order ?? 0),
  is_active: image?.is_active ?? true,
});

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImageRecord[]>([]);
  const [editing, setEditing] = useState<GalleryFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadImages = async () => {
    try {
      setImages(await fetchAdminGalleryImages());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load gallery images.";
      toast.error(message);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.image_url.trim()) {
      toast.error("Image URL is required.");
      return;
    }

    setSaving(true);

    const payload = {
      image_url: editing.image_url.trim(),
      title: editing.title.trim() || null,
      category: editing.category.trim() || null,
      alt_text: editing.alt_text.trim() || null,
      display_order: Number(editing.display_order) || 0,
      is_active: editing.is_active,
    };

    try {
      if (editing.id) {
        await updateGalleryImage(editing.id, payload);
        toast.success("Gallery image updated.");
      } else {
        await createGalleryImage(payload);
        toast.success("Gallery image created.");
      }

      setEditing(null);
      await loadImages();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save gallery image.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery image?")) return;

    try {
      await removeGalleryImage(id);
      toast.success("Gallery image deleted.");
      await loadImages();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete gallery image.";
      toast.error(message);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !editing) return;

    setUploading(true);

    try {
      const uploadedUrl = await uploadTourImage(file);
      setEditing({ ...editing, image_url: uploadedUrl });
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
            {editing.id ? "Edit Gallery Image" : "Add Gallery Image"}
          </h1>
          <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-4">
            <Input
              placeholder="Image URL *"
              value={editing.image_url}
              onChange={(event) =>
                setEditing({ ...editing, image_url: event.target.value })
              }
            />
            <label
              htmlFor="gallery-image-upload"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
            >
              <Upload size={16} />
              {uploading ? "Uploading..." : "Upload Image"}
            </label>
            <input
              id="gallery-image-upload"
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <Input
              placeholder="Title"
              value={editing.title}
              onChange={(event) =>
                setEditing({ ...editing, title: event.target.value })
              }
            />
            <Input
              placeholder="Category"
              value={editing.category}
              onChange={(event) =>
                setEditing({ ...editing, category: event.target.value })
              }
            />
            <Input
              placeholder="Alt text"
              value={editing.alt_text}
              onChange={(event) =>
                setEditing({ ...editing, alt_text: event.target.value })
              }
            />
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
              Active image
            </label>
            {editing.image_url && (
              <div className="overflow-hidden rounded-xl border bg-muted max-w-xl">
                <img
                  src={editing.image_url}
                  alt={editing.alt_text || editing.title || "Preview"}
                  className="h-60 w-full object-cover"
                />
              </div>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Image"}
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
            <h1 className="text-2xl font-bold text-foreground">Manage Gallery</h1>
          </div>
          <Button
            onClick={() => setEditing(createBlankImage())}
            className="gap-1"
          >
            <Plus size={16} /> Add Image
          </Button>
        </div>

        <div className="space-y-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-card rounded-xl shadow-card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={image.image_url}
                  alt={image.alt_text ?? image.title ?? "Gallery"}
                  className="h-14 w-24 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {image.title || "Untitled image"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {image.category || "No category"} | Order:{" "}
                    {image.display_order} |{" "}
                    {image.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(createImageForm(image))}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(image.id)}
                  className="text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No gallery images yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
