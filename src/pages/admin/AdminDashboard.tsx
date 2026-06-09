import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Database, LogOut } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import {
  fetchAdminBanners,
  fetchAdminGalleryImages,
  fetchAdminHolidayCategories,
  fetchAdminHolidayPackages,
  fetchDashboardStats,
  fetchEnquiries,
  type BannerRecord,
  type EnquiryRecord,
  type GalleryImageRecord,
  type HolidayCategoryRecord,
  type HolidayPackageRecord,
} from "@/lib/travel-cms";

type DashboardStats = {
  packages?: number;
  categories?: number;
  banners?: number;
  galleryImages?: number;
  tours: number;
  services: number;
  enquiries: number;
  newEnquiries: number;
};

type SectionConfig = {
  id: string;
  label: string;
  title: string;
  route?: string;
  description: string;
  count: number;
  fields: string[];
  actionLabel?: string;
};

const blankStats: DashboardStats = {
  packages: 0,
  categories: 0,
  banners: 0,
  galleryImages: 0,
  tours: 0,
  services: 0,
  enquiries: 0,
  newEnquiries: 0,
};

const ACTIVE_SECTION_STORAGE_KEY = "sandis_admin_active_section";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [stats, setStats] = useState<DashboardStats>(blankStats);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState(() => {
    if (typeof window === "undefined") return "categories";
    return localStorage.getItem(ACTIVE_SECTION_STORAGE_KEY) || "categories";
  });
  const [dbConnected, setDbConnected] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(true);

  const [categories, setCategories] = useState<HolidayCategoryRecord[]>([]);
  const [banners, setBanners] = useState<BannerRecord[]>([]);
  const [packages, setPackages] = useState<HolidayPackageRecord[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImageRecord[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoadingStats(true);
        const response = await fetchDashboardStats();
        if (!mounted) return;
        setStats({
          ...blankStats,
          ...response,
        });
        setDbConnected(true);
      } catch (error) {
        if (!mounted) return;
        setStats(blankStats);
        setDbConnected(false);
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load dashboard stats.";
        toast.error(message);
      } finally {
        if (mounted) setLoadingStats(false);
      }
    };

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadPreviewData = async () => {
      try {
        setLoadingPreview(true);
        const [
          nextCategories,
          nextBanners,
          nextPackages,
          nextEnquiries,
          nextGallery,
        ] = await Promise.all([
          fetchAdminHolidayCategories(),
          fetchAdminBanners(),
          fetchAdminHolidayPackages(),
          fetchEnquiries(),
          fetchAdminGalleryImages(),
        ]);

        if (!mounted) return;
        setCategories(nextCategories);
        setBanners(nextBanners);
        setPackages(nextPackages);
        setEnquiries(nextEnquiries);
        setGalleryImages(nextGallery);
      } catch (error) {
        if (!mounted) return;
        const message =
          error instanceof Error
            ? error.message
            : "Unable to load section data.";
        toast.error(message);
      } finally {
        if (mounted) setLoadingPreview(false);
      }
    };

    loadPreviewData();
    return () => {
      mounted = false;
    };
  }, []);

  const sections = useMemo<SectionConfig[]>(
    () => [
      {
        id: "categories",
        label: "Categories",
        title: "Categories",
        route: "/admin/categories",
        description:
          "Manage holiday categories used in the holiday package form.",
        count: stats.categories ?? categories.length,
        fields: [
          "Name",
          "Slug / URL",
          "Description",
          "Display Order",
          "Active / Inactive",
        ],
        actionLabel: "Add Category",
      },
      {
        id: "hero",
        label: "Hero Section",
        title: "Hero Section / Banners",
        route: "/admin/banners",
        description:
          "Manage page banners for home, holidays, holiday detail, about, contact, and gallery pages.",
        count: stats.banners ?? banners.length,
        fields: [
          "Page Key",
          "Banner Image",
          "Mobile Banner",
          "Title",
          "Subtitle",
          "CTA Label",
          "CTA Link",
          "Display Order",
          "Active / Inactive",
        ],
        actionLabel: "Add Banner",
      },
      {
        id: "packages",
        label: "Holiday Packages",
        title: "Holiday Packages",
        route: "/admin/packages",
        description:
          "Create and manage complete package content with itinerary, gallery, SEO, and enquiry text.",
        count: stats.packages ?? stats.tours ?? packages.length,
        fields: [
          "Package Title",
          "Slug / URL",
          "Category",
          "Location / State / Country",
          "Banner Image",
          "Short Description",
          "Duration",
          "Trip Type",
          "Price / On Request",
          "About Tour",
          "Good For",
          "Vehicles",
          "Darshan / Attraction",
          "Safe Trip / Comfort",
          "Itinerary",
          "Highlights",
          "Included",
          "Excluded",
          "Terms",
          "Gallery Images",
          "WhatsApp Message",
          "Email Subject / Message",
          "SEO Title / Description",
          "Active / Inactive",
        ],
        actionLabel: "Add Holiday Package",
      },
      {
        id: "enquiries",
        label: "Enquiries",
        title: "Enquiries",
        route: "/admin/enquiries",
        description:
          "Track customer enquiries and update status to new, contacted, or closed.",
        count: stats.enquiries ?? enquiries.length,
        fields: [
          "Customer Name",
          "Phone",
          "Email",
          "Destination",
          "Travel Date",
          "Message",
          "Status",
          "Created Date",
        ],
        actionLabel: "View Enquiries",
      },
      {
        id: "gallery",
        label: "Gallery",
        title: "Gallery",
        route: "/admin/gallery",
        description: "Manage gallery images and display settings.",
        count: stats.galleryImages ?? galleryImages.length,
        fields: [
          "Image",
          "Title",
          "Category",
          "Alt Text",
          "Display Order",
          "Active / Inactive",
        ],
        actionLabel: "Add Gallery Image",
      },
    ],
    [stats, categories.length, banners.length, packages.length, enquiries.length, galleryImages.length],
  );

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ?? sections[0];

  useEffect(() => {
    if (!sections.some((section) => section.id === activeSectionId)) {
      setActiveSectionId(sections[0]?.id ?? "categories");
    }
  }, [sections, activeSectionId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACTIVE_SECTION_STORAGE_KEY, activeSectionId);
  }, [activeSectionId]);

  const totalsLine = [
    `Tours: ${stats.packages ?? stats.tours ?? packages.length}`,
    `Categories: ${stats.categories ?? categories.length}`,
    `Gallery: ${stats.galleryImages ?? galleryImages.length}`,
    `Banners: ${stats.banners ?? banners.length}`,
    `Enquiries: ${stats.enquiries ?? enquiries.length}`,
  ].join(" | ");

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const openActiveSection = () => {
    if (!activeSection.route) {
      toast.info(`${activeSection.label} is not enabled yet.`);
      return;
    }
    navigate(activeSection.route);
  };

  const renderPreviewRows = () => {
    if (loadingPreview) {
      return (
        <p className="text-sm text-muted-foreground">Loading section records...</p>
      );
    }

    if (activeSection.id === "categories") {
      const rows = categories;
      if (rows.length === 0) return <p className="text-sm text-muted-foreground">No categories yet.</p>;
      return rows.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm"
        >
          <span className="font-medium text-foreground">{item.name}</span>
          <span className="ml-2 text-muted-foreground">
            ({item.slug}) | {item.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      ));
    }

    if (activeSection.id === "hero") {
      const rows = banners;
      if (rows.length === 0) return <p className="text-sm text-muted-foreground">No banners yet.</p>;
      return rows.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm"
        >
          <span className="font-medium text-foreground">{item.page_key}</span>
          <span className="ml-2 text-muted-foreground">
            {item.title || "Untitled"} | Order {item.display_order} |{" "}
            {item.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      ));
    }

    if (activeSection.id === "packages") {
      const rows = packages;
      if (rows.length === 0) return <p className="text-sm text-muted-foreground">No packages yet.</p>;
      return rows.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm"
        >
          <span className="font-medium text-foreground">{item.title}</span>
          <span className="ml-2 text-muted-foreground">
            {item.category?.name || "No category"} | {item.duration || "On Request"} |{" "}
            {item.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      ));
    }

    if (activeSection.id === "enquiries") {
      const rows = enquiries;
      if (rows.length === 0) return <p className="text-sm text-muted-foreground">No enquiries yet.</p>;
      return rows.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm"
        >
          <span className="font-medium text-foreground">{item.name}</span>
          <span className="ml-2 text-muted-foreground">
            {item.phone} | {item.destination || "No destination"} | {item.status}
          </span>
        </div>
      ));
    }

    if (activeSection.id === "gallery") {
      const rows = galleryImages;
      if (rows.length === 0) return <p className="text-sm text-muted-foreground">No gallery images yet.</p>;
      return rows.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-border bg-background/70 px-4 py-3 text-sm"
        >
          <span className="font-medium text-foreground">
            {item.title || "Untitled image"}
          </span>
          <span className="ml-2 text-muted-foreground">
            {item.category || "General"} | Order {item.display_order} |{" "}
            {item.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      ));
    }

    return <p className="text-sm text-muted-foreground">No records for this section yet.</p>;
  };

  return (
    <div className="pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-4">
        <section className="rounded-[2rem] border border-border/60 bg-card/75 backdrop-blur-sm p-5 sm:p-8">
          <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Sandis Tours CMS
          </p>

          <h1 className="mt-4 text-4xl sm:text-6xl leading-none font-semibold text-foreground/85">
            Admin Dashboard
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-foreground">
            {loadingStats ? "Loading dashboard data..." : totalsLine}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm ${
                dbConnected
                  ? "border-orange-300/50 bg-orange-50 text-orange-700"
                  : "border-red-300/60 bg-red-50 text-red-700"
              }`}
            >
              <Database className="h-4 w-4" />
              {dbConnected ? "MySQL Connected" : "MySQL Disconnected"}
            </span>

            <span className="inline-flex items-center rounded-full border border-border bg-background/90 px-5 py-2 text-sm text-foreground">
              @{user?.name?.trim() || user?.email?.split("@")[0] || "admin"}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-5 py-2 text-sm font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {sections.map((section) => {
              const isActive = section.id === activeSection.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSectionId(section.id)}
                  className={`rounded-2xl border px-6 py-3 text-base font-medium transition ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-elevated"
                      : "border-border bg-background/90 text-foreground hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border/60 bg-card/75 backdrop-blur-sm p-5 sm:p-8">
          <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Active Section
          </p>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-4xl">
              <h2 className="text-3xl sm:text-5xl font-semibold text-foreground/85">
                {activeSection.title}
              </h2>
              <p className="mt-5 text-base sm:text-lg text-foreground">{activeSection.description}</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="flex gap-3">
                <span className="rounded-full border border-border bg-background/90 px-6 py-3 text-sm sm:text-base text-foreground">
                  {activeSection.count} records
                </span>
                <span className="rounded-full border border-border bg-background/90 px-6 py-3 text-sm sm:text-base text-foreground">
                  Administrator
                </span>
              </div>
              {activeSection.route && activeSection.actionLabel && (
                <button
                  type="button"
                  onClick={openActiveSection}
                  className="inline-flex items-center rounded-full border border-primary/35 bg-primary/10 px-5 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                >
                  {activeSection.actionLabel}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Field Options
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {activeSection.fields.map((field) => (
                <span
                  key={field}
                  className="rounded-full border border-border bg-background/90 px-3 py-1 text-xs text-foreground"
                >
                  {field}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Direct Records
            </p>
            <div className="mt-3 space-y-2">{renderPreviewRows()}</div>
          </div>

        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
