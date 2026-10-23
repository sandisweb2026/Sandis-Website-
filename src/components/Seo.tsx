import { useEffect } from "react";
import { SITE_ORIGIN } from "@/lib/seo";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

type SeoProps = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
  structuredData?: JsonLd;
};

const absoluteUrl = (value: string) => {
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
};

const upsertMeta = (
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string,
) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  const links = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>(`link[rel="${rel}"]`),
  );
  const link = links[0] || document.createElement("link");
  links.slice(1).forEach((duplicate) => duplicate.remove());
  link.setAttribute("rel", rel);
  link.setAttribute("href", href);
  if (!link.parentElement) document.head.appendChild(link);
};

const Seo = ({
  title,
  description,
  path,
  type = "website",
  image = "/sandis-logo.png",
  noindex = false,
  structuredData,
}: SeoProps) => {
  useEffect(() => {
    const canonicalUrl = absoluteUrl(path.split("?")[0] || "/");
    const imageUrl = absoluteUrl(image);

    document.title = title;
    upsertMeta('meta[name="description"]', "name", "description", description);
    upsertMeta(
      'meta[name="robots"]',
      "name",
      "robots",
      noindex ? "noindex,nofollow" : "index,follow",
    );
    upsertLink("canonical", canonicalUrl);

    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", "Sandis Tours");
    upsertMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
    upsertMeta('meta[property="og:image:alt"]', "property", "og:image:alt", "Sandis Tours logo");

    upsertMeta(
      'meta[name="twitter:card"]',
      "name",
      "twitter:card",
      "summary_large_image",
    );
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);

    const existingJsonLd = document.head.querySelector('script[data-sandis-seo="true"]');
    if (structuredData) {
      const jsonLd = existingJsonLd || document.createElement("script");
      jsonLd.setAttribute("type", "application/ld+json");
      jsonLd.setAttribute("data-sandis-seo", "true");
      jsonLd.textContent = JSON.stringify(structuredData);
      if (!jsonLd.parentElement) document.head.appendChild(jsonLd);
    } else {
      existingJsonLd?.remove();
    }
  }, [description, image, noindex, path, structuredData, title, type]);

  return null;
};

export default Seo;
