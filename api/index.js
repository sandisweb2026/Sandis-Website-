import app from "../server/app.js";

const readPathParam = (pathParam) => {
  if (Array.isArray(pathParam)) {
    return pathParam.join("/");
  }

  return typeof pathParam === "string" ? pathParam : "";
};

const rebuildExpressUrl = (req) => {
  const pathParam = readPathParam(req.query?.path).replace(/^\/+|\/+$/g, "");

  if (!pathParam) {
    return;
  }

  const url = new URL(req.url ?? "/api", "http://localhost");
  url.searchParams.delete("path");

  const search = url.searchParams.toString();
  req.url = `/api/${pathParam}${search ? `?${search}` : ""}`;
};

export default function handler(req, res) {
  rebuildExpressUrl(req);
  return app(req, res);
}
