import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("created_at");
    setServices(data ?? []);
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSave = async () => {
    if (!editing?.title) { toast.error("Title is required"); return; }
    setLoading(true);
    const payload = { title: editing.title, description: editing.description || null, icon: editing.icon || "Plane" };

    if (editing.id) {
      const { error } = await supabase.from("services").update(payload).eq("id", editing.id);
      if (error) toast.error(error.message); else toast.success("Service updated!");
    } else {
      const { error } = await supabase.from("services").insert(payload);
      if (error) toast.error(error.message); else toast.success("Service created!");
    }
    setLoading(false);
    setEditing(null);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted!"); fetchServices(); }
  };

  if (editing) {
    return (
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <button onClick={() => setEditing(null)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold mb-6 text-foreground">{editing.id ? "Edit Service" : "Add Service"}</h1>
          <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-4">
            <Input placeholder="Service Title *" value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            <Textarea placeholder="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={editing.icon || "Plane"}
              onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
            >
              {["Plane", "Bus", "Train", "Hotel", "FileText", "Car"].map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Service"}</Button>
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
            <Link to="/admin" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></Link>
            <h1 className="text-2xl font-bold text-foreground">Manage Services</h1>
          </div>
          <Button onClick={() => setEditing({})} className="gap-1"><Plus size={16} /> Add Service</Button>
        </div>
        <div className="space-y-3">
          {services.map((s) => (
            <div key={s.id} className="bg-card rounded-xl shadow-card p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(s)}><Pencil size={14} /></Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(s.id)} className="text-destructive"><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminServices;
