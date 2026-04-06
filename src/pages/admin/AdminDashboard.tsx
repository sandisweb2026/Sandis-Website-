import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, MessageSquare, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [stats, setStats] = useState({ tours: 0, services: 0, enquiries: 0, newEnquiries: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [t, s, e, ne] = await Promise.all([
        supabase.from("tours").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }),
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setStats({
        tours: t.count ?? 0,
        services: s.count ?? 0,
        enquiries: e.count ?? 0,
        newEnquiries: ne.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Tours", value: stats.tours, icon: MapPin, link: "/admin/tours", color: "text-primary" },
    { label: "Services", value: stats.services, icon: Briefcase, link: "/admin/services", color: "text-primary" },
    { label: "Enquiries", value: stats.enquiries, icon: MessageSquare, link: "/admin/enquiries", color: "text-primary" },
    { label: "New Enquiries", value: stats.newEnquiries, icon: MessageSquare, link: "/admin/enquiries", color: "text-destructive" },
  ];

  return (
    <div className="pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your tours, services, and enquiries</p>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut size={16} /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((c) => (
            <Link key={c.label} to={c.link} className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow">
              <c.icon size={24} className={c.color} />
              <p className="text-3xl font-bold mt-3 text-foreground">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/tours" className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow">
            <h3 className="font-semibold text-foreground">Manage Tours</h3>
            <p className="text-sm text-muted-foreground mt-1">Add, edit, or delete tour packages</p>
            <Button size="sm" className="mt-4">Go to Tours</Button>
          </Link>
          <Link to="/admin/services" className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow">
            <h3 className="font-semibold text-foreground">Manage Services</h3>
            <p className="text-sm text-muted-foreground mt-1">Update your service offerings</p>
            <Button size="sm" className="mt-4">Go to Services</Button>
          </Link>
          <Link to="/admin/enquiries" className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow">
            <h3 className="font-semibold text-foreground">View Enquiries</h3>
            <p className="text-sm text-muted-foreground mt-1">Check and respond to customer enquiries</p>
            <Button size="sm" className="mt-4">Go to Enquiries</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
