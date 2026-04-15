const API_BASE = (
  import.meta.env.VITE_API_URL || "/api"
).replace(/\/$/, "");

const ADMIN_TOKEN_KEY = "sandis_admin_token";

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

const readJsonSafely = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const getAdminToken = () =>
  typeof localStorage === "undefined"
    ? null
    : localStorage.getItem(ADMIN_TOKEN_KEY);

export const setAdminToken = (token: string) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = () => {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const apiRequest = async <T>(
  path: string,
  { auth = false, headers, body, ...init }: ApiRequestOptions = {},
): Promise<T> => {
  const nextHeaders = new Headers(headers ?? {});
  const token = getAdminToken();

  if (body && !(body instanceof FormData) && !nextHeaders.has("Content-Type")) {
    nextHeaders.set("Content-Type", "application/json");
  }

  if (auth && token) {
    nextHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: nextHeaders,
    body,
  });

  const data = await readJsonSafely(response);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String(data.message)
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
};
