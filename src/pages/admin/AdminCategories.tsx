import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createHolidayCategory,
  fetchAdminHolidayCategories,
  removeHolidayCategory,
  updateHolidayCategory,
  type HolidayCategoryRecord,
} from "@/lib/travel-cms";

type CategoryFormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  display_order: string;
  is_active: boolean;
};

const createBlankCategory = (): CategoryFormState => ({
  name: "",
  slug: "",
  description: "",
  display_order: "0",
  is_active: true,
});

const createCategoryForm = (
  category?: HolidayCategoryRecord,
): CategoryFormState => ({
  id: category?.id,
  name: category?.name ?? "",
  slug: category?.slug ?? "",
  description: category?.description ?? "",
  display_order: String(category?.display_order ?? 0),
  is_active: category?.is_active ?? true,
});

const AdminCategories = () => {
  const [categories, setCategories] = useState<HolidayCategoryRecord[]>([]);
  const [editing, setEditing] = useState<CategoryFormState | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setCategories(await fetchAdminHolidayCategories());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load categories.";
      toast.error(message);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setSaving(true);

    const payload = {
      name: editing.name.trim(),
      slug: editing.slug.trim() || undefined,
      description: editing.description.trim() || null,
      display_order: Number(editing.display_order) || 0,
      is_active: editing.is_active,
    };

    try {
      if (editing.id) {
        await updateHolidayCategory(editing.id, payload);
        toast.success("Category updated.");
      } else {
        await createHolidayCategory(payload);
        toast.success("Category created.");
      }

      setEditing(null);
      await loadCategories();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save category.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    try {
      await removeHolidayCategory(id);
      toast.success("Category deleted.");
      await loadCategories();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete category.";
      toast.error(message);
    }
  };

  if (editing) {
    return (
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold mb-6 text-foreground">
            {editing.id ? "Edit Category" : "Add Category"}
          </h1>
          <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-4">
            <Input
              placeholder="Category Name *"
              value={editing.name}
              onChange={(event) =>
                setEditing({ ...editing, name: event.target.value })
              }
            />
            <Input
              placeholder="Slug (optional)"
              value={editing.slug}
              onChange={(event) =>
                setEditing({ ...editing, slug: event.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={editing.description}
              onChange={(event) =>
                setEditing({ ...editing, description: event.target.value })
              }
              rows={4}
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
              Active category
            </label>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Category"}
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
            <h1 className="text-2xl font-bold text-foreground">
              Manage Holiday Categories
            </h1>
          </div>
          <Button
            onClick={() => setEditing(createBlankCategory())}
            className="gap-1"
          >
            <Plus size={16} /> Add Category
          </Button>
        </div>

        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-card rounded-xl shadow-card p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.slug} | Order: {category.display_order} |{" "}
                  {category.is_active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(createCategoryForm(category))}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(category.id)}
                  className="text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No categories yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
