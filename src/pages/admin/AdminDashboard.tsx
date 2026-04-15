import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, LogOut, MapPin, MessageSquare } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { fetchDashboardStats } from "@/lib/travel-cms";

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [stats, setStats] = useState({
    tours: 0,
    services: 0,
    enquiries: 0,
    newEnquiries: 0,
  });

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch(() => {
      setStats({
        tours: 0,
        services: 0,
        enquiries: 0,
        newEnquiries: 0,
      });
    });
  }, []);

  const cards = [
    {
      label: "Total Tours",
      value: stats.tours,
      icon: MapPin,
      link: "/admin/tours",
      color: "text-primary",
    },
    {
      label: "Services",
      value: stats.services,
      icon: Briefcase,
      link: "/admin/services",
      color: "text-primary",
    },
    {
      label: "Enquiries",
      value: stats.enquiries,
      icon: MessageSquare,
      link: "/admin/enquiries",
      color: "text-primary",
    },
    {
      label: "New Enquiries",
      value: stats.newEnquiries,
      icon: MessageSquare,
      link: "/admin/enquiries",
      color: "text-destructive",
    },
  ];

  return (
    <div className="pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your tours, services, and enquiries
            </p>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut size={16} /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <Link
              key={card.label}
              to={card.link}
              className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow"
            >
              <card.icon size={24} className={card.color} />
              <p className="text-3xl font-bold mt-3 text-foreground">
                {card.value}
              </p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/tours"
            className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow"
          >
            <h3 className="font-semibold text-foreground">Manage Tours</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add, edit, or delete holiday packages
            </p>
            <Button size="sm" className="mt-4">
              Go to Tours
            </Button>
          </Link>
          <Link
            to="/admin/services"
            className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow"
          >
            <h3 className="font-semibold text-foreground">Manage Services</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Update your service offerings
            </p>
            <Button size="sm" className="mt-4">
              Go to Services
            </Button>
          </Link>
          <Link
            to="/admin/enquiries"
            className="bg-card rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow"
          >
            <h3 className="font-semibold text-foreground">View Enquiries</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Check and respond to customer enquiries
            </p>
            <Button size="sm" className="mt-4">
              Go to Enquiries
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
