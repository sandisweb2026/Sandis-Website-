import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  fetchEnquiries,
  removeEnquiry,
  setEnquiryStatus,
  type EnquiryRecord,
} from "@/lib/travel-cms";

const statusColors: Record<string, string> = {
  new: "bg-destructive/10 text-destructive",
  contacted: "bg-primary/10 text-primary",
  closed: "bg-muted text-muted-foreground",
};

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);

  const loadEnquiries = async () => {
    try {
      setEnquiries(await fetchEnquiries());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load enquiries.";
      toast.error(message);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const updateStatus = async (
    id: string,
    status: EnquiryRecord["status"],
  ) => {
    try {
      await setEnquiryStatus(id, status);
      toast.success("Status updated.");
      await loadEnquiries();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update status.";
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;

    try {
      await removeEnquiry(id);
      toast.success("Enquiry deleted.");
      await loadEnquiries();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete enquiry.";
      toast.error(message);
    }
  };

  return (
    <div className="pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/admin"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Enquiries</h1>
          <span className="text-sm text-muted-foreground">
            ({enquiries.length} total)
          </span>
        </div>

        <div className="space-y-3">
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-card rounded-xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground">
                      {enquiry.name}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        statusColors[enquiry.status] || ""
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Phone: {enquiry.phone}
                  </p>
                  {enquiry.email && (
                    <p className="text-sm text-muted-foreground">
                      Email: {enquiry.email}
                    </p>
                  )}
                  {enquiry.destination && (
                    <p className="text-sm text-muted-foreground">
                      Destination: {enquiry.destination}
                    </p>
                  )}
                  {enquiry.travel_date && (
                    <p className="text-sm text-muted-foreground">
                      Travel date:{" "}
                      {new Date(enquiry.travel_date).toLocaleDateString()}
                    </p>
                  )}
                  {enquiry.message && (
                    <p className="text-sm text-muted-foreground mt-2 italic">
                      "{enquiry.message}"
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(enquiry.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {enquiry.status !== "contacted" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(enquiry.id, "contacted")}
                    >
                      Mark Contacted
                    </Button>
                  )}
                  {enquiry.status !== "closed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(enquiry.id, "closed")}
                    >
                      Close
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(enquiry.id)}
                    className="text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {enquiries.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No enquiries yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;
