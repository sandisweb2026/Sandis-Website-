import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Tour = Database["public"]["Tables"]["tours"]["Row"];

const AdminTours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [editing, setEditing] = useState<Partial<Tour> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTours = async () => {
    const { data } = await supabase.from("tours").select("*").order("created_at", { ascending: false });
    setTours(data ?? []);
  };

  useEffect(() => { fetchTours(); }, []);

  const handleSave = async () => {
    if (!editing?.name || !editing?.duration || !editing?.price || !editing?.category) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);

    let inclusionsArray: string[] = [];
    if (typeof editing.inclusions === "string") {
      inclusionsArray = (editing.inclusions as string).split(",").map((s) => s.trim()).filter(Boolean);
    } else if (Array.isArray(editing.inclusions)) {
      inclusionsArray = editing.inclusions;
    }

    const payload = {
      name: editing.name,
      duration: editing.duration,
      price: editing.price,
      category: editing.category,
      description: editing.description || null,
      inclusions: inclusionsArray,
      image_url: editing.image_url || null,
    };

    if (editing.id) {
      const { error } = await supabase.from("tours").update(payload).eq("id", editing.id);
      if (error) toast.error(error.message); else toast.success("Tour updated!");
    } else {
      const { error } = await supabase.from("tours").insert(payload);
      if (error) toast.error(error.message); else toast.success("Tour created!");
    }
    setLoading(false);
    setEditing(null);
    fetchTours();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tour?")) return;
    const { error } = await supabase.from("tours").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted!"); fetchTours(); }
  };

  if (editing) {
    return (
      <div className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <button onClick={() => setEditing(null)} className="flex items-center gap-1 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-bold mb-6 text-foreground">{editing.id ? "Edit Tour" : "Add Tour"}</h1>
          <div className="bg-card rounded-2xl shadow-card p-6 flex flex-col gap-4">
            <Input placeholder="Tour Name *" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Duration *" value={editing.duration || ""} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} />
              <Input placeholder="Price *" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
            </div>
            <select
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={editing.category || "domestic"}
              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
            >
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
            </select>
            <Textarea placeholder="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
            <Input placeholder="Image URL" value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
            <Input
              placeholder="Inclusions (comma separated)"
              value={Array.isArray(editing.inclusions) ? editing.inclusions.join(", ") : (editing.inclusions || "")}
              onChange={(e) => setEditing({ ...editing, inclusions: e.target.value as any })}
            />
            <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Tour"}</Button>
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
            <h1 className="text-2xl font-bold text-foreground">Manage Tours</h1>
          </div>
          <Button onClick={() => setEditing({})} className="gap-1"><Plus size={16} /> Add Tour</Button>
        </div>

        <div className="space-y-3">
          {tours.map((t) => (
            <div key={t.id} className="bg-card rounded-xl shadow-card p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{t.name}</h3>
                <p className="text-sm text-muted-foreground">{t.duration} • {t.price} • {t.category}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(t)}><Pencil size={14} /></Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(t.id)} className="text-destructive"><Trash2 size={14} /></Button>
              </div>
            </div>
          ))}
          {tours.length === 0 && <p className="text-center text-muted-foreground py-8">No tours yet. Add your first tour!</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminTours;
