const DEFAULT_API_BASE_URL = "http://localhost:3300/api";

function normalizeUrl(value: string) {
  return value.replace(/\/$/, "");
}

export const API_BASE_URL = normalizeUrl(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
);

export const AUTH_BASE_URL = normalizeUrl(
  import.meta.env.VITE_AUTH_BASE_URL ||
    API_BASE_URL.replace(/\/api$/, "/api/auth"),
);
