import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";

type Enquiry = Database["public"]["Tables"]["enquiries"]["Row"];

const statusColors: Record<string, string> = {
  new: "bg-destructive/10 text-destructive",
  contacted: "bg-primary/10 text-primary",
  closed: "bg-muted text-muted-foreground",
};

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const fetchEnquiries = async () => {
    const { data } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
    setEnquiries(data ?? []);
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Status updated"); fetchEnquiries(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); fetchEnquiries(); }
  };

  return (
    <div className="pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></Link>
          <h1 className="text-2xl font-bold text-foreground">Enquiries</h1>
          <span className="text-sm text-muted-foreground">({enquiries.length} total)</span>
        </div>

        <div className="space-y-3">
          {enquiries.map((e) => (
            <div key={e.id} className="bg-card rounded-xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">{e.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[e.status] || ""}`}>
                      {e.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">📞 {e.phone}</p>
                  {e.destination && <p className="text-sm text-muted-foreground">📍 {e.destination}</p>}
                  {e.travel_date && <p className="text-sm text-muted-foreground">📅 {new Date(e.travel_date).toLocaleDateString()}</p>}
                  {e.message && <p className="text-sm text-muted-foreground mt-2 italic">"{e.message}"</p>}
                  <p className="text-xs text-muted-foreground mt-2">{new Date(e.created_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {e.status !== "contacted" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(e.id, "contacted")}>Mark Contacted</Button>
                  )}
                  {e.status !== "closed" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(e.id, "closed")}>Close</Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleDelete(e.id)} className="text-destructive">Delete</Button>
                </div>
              </div>
            </div>
          ))}
          {enquiries.length === 0 && <p className="text-center text-muted-foreground py-8">No enquiries yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;
