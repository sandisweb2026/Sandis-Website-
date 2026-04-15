import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createService,
  fetchServices,
  removeService,
  updateService,
  type ServiceRecord,
} from "@/lib/travel-cms";

const iconOptions = ["Plane", "Bus", "Train", "Hotel", "FileText", "Car"];

type ServiceFormState = {
  id?: string;
  title: string;
  description: string;
  icon: string;
};

const createBlankService = (): ServiceFormState => ({
  title: "",
  description: "",
  icon: "Plane",
});

const createServiceForm = (service?: ServiceRecord): ServiceFormState => ({
  id: service?.id,
  title: service?.title ?? "",
  description: service?.description ?? "",
  icon: service?.icon ?? "Plane",
});

const AdminServices = () => {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [editing, setEditing] = useState<ServiceFormState | null>(null);
  const [loading, setLoading] = useState(false);

  const loadServices = async () => {
    try {
      setServices(await fetchServices());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load services.";
      toast.error(message);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSave = async () => {
    if (!editing?.title.trim()) {
      toast.error("Service title is required.");
      return;
    }

    setLoading(true);

    const payload = {
      title: editing.title.trim(),
      description: editing.description.trim() || null,
      icon: editing.icon || "Plane",
    };

    try {
      if (editing.id) {
        await updateService(editing.id, payload);
        toast.success("Service updated.");
      } else {
        await createService(payload);
        toast.success("Service created.");
      }

      setEditing(null);
      await loadServices();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to save the service.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;

    try {
      await removeService(id);
      toast.success("Service deleted.");
      await loadServices();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete the service.";
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
            {editing.id ? "Edit Service" : "Add Service"}
          </h1>
          <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-4">
            <Input
              placeholder="Service Title *"
              value={editing.title}
              onChange={(event) =>
                setEditing({ ...editing, title: event.target.value })
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
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={editing.icon}
              onChange={(event) =>
                setEditing({ ...editing, icon: event.target.value })
              }
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Service"}
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
              Manage Services
            </h1>
          </div>
          <Button
            onClick={() => setEditing(createBlankService())}
            className="gap-1"
          >
            <Plus size={16} /> Add Service
          </Button>
        </div>

        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-card rounded-xl shadow-card p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(createServiceForm(service))}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(service.id)}
                  className="text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
          {services.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No services yet. Add your first service.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
