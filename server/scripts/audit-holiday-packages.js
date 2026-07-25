const defaultApiBase = "https://sandis.com/api";

const inputBase = process.argv[2]?.trim() || defaultApiBase;
const apiBase = inputBase.replace(/\/$/, "");

const packageSectionChecks = [
  {
    label: "About Tour",
    isPresent: (pkg) =>
      Boolean(pkg.about_tour?.trim() || pkg.short_description?.trim()),
  },
  {
    label: "Itinerary",
    isPresent: (pkg) =>
      Array.isArray(pkg.itinerary) &&
      pkg.itinerary.some(
        (item) => item?.title?.trim() || item?.description?.trim(),
      ),
  },
  {
    label: "Highlights",
    isPresent: (pkg) =>
      Array.isArray(pkg.highlights) &&
      pkg.highlights.some((item) => item?.trim()),
  },
  {
    label: "What's Included",
    isPresent: (pkg) =>
      Array.isArray(pkg.included_items) &&
      pkg.included_items.some((item) => item?.trim()),
  },
  {
    label: "What's Excluded",
    isPresent: (pkg) =>
      Array.isArray(pkg.excluded_items) &&
      pkg.excluded_items.some((item) => item?.trim()),
  },
  {
    label: "Terms & Conditions",
    isPresent: (pkg) =>
      Array.isArray(pkg.terms) && pkg.terms.some((item) => item?.trim()),
  },
  {
    label: "Gallery",
    isPresent: (pkg) =>
      Array.isArray(pkg.gallery_images) &&
      pkg.gallery_images.some((item) => item?.image_url?.trim()),
  },
];

const getMissingSections = (pkg) =>
  packageSectionChecks
    .filter((section) => !section.isPresent(pkg))
    .map((section) => section.label);

const fetchJson = async (path) => {
  const response = await fetch(`${apiBase}${path}`);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String(data.message)
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
};

const main = async () => {
  const { packages = [] } = await fetchJson("/packages");

  if (!Array.isArray(packages) || packages.length === 0) {
    console.log(`No packages returned from ${apiBase}/packages`);
    return;
  }

  const results = [];

  for (const packageSummary of packages) {
    const { package: packageDetail } = await fetchJson(
      `/packages/${packageSummary.slug}`,
    );
    const missingSections = getMissingSections(packageDetail);

    results.push({
      slug: packageDetail.slug,
      title: packageDetail.title,
      missingSections,
    });
  }

  const incompletePackages = results.filter(
    (result) => result.missingSections.length > 0,
  );

  console.log(
    `Audited ${results.length} holiday package(s) from ${apiBase} on ${new Date().toISOString()}.`,
  );

  if (incompletePackages.length === 0) {
    console.log("Every package has all required detail sections.");
    return;
  }

  console.log(
    `${incompletePackages.length} package(s) are missing one or more detail sections:`,
  );

  for (const result of incompletePackages) {
    console.log(
      `- ${result.title} (${result.slug}): ${result.missingSections.join(", ")}`,
    );
  }
};

main().catch((error) => {
  const message =
    error instanceof Error ? error.message : "Package audit failed.";
  console.error(message);
  process.exitCode = 1;
});
