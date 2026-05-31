type EnvConfig = {
  apiBaseUrl: string;
  appName: string;
};

const fallbackApiBaseUrl = "http://localhost:3000";

const fromVite = import.meta.env;

const normalizeBaseUrl = (value: string | undefined): string => {
  const cleaned = value?.replace(/^\uFEFF/, "").trim();
  if (!cleaned || cleaned.length === 0) {
    return fallbackApiBaseUrl;
  }

  return cleaned.replace(/\/$/, "");
};

export const env: EnvConfig = Object.freeze({
  apiBaseUrl: normalizeBaseUrl(fromVite.VITE_API_BASE_URL),
  appName: fromVite.VITE_APP_NAME?.trim() || "DressnMore",
});
