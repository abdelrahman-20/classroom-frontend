// Require an environment constant from `import.meta.env` at import time.
// Throws an Error if the value is missing or empty.
export function requireEnv(key: string, fallbackValue?: string): string {
  const val = (import.meta.env as any)[key];
  if (val === undefined || val === null || val === "") {
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    throw new Error(`Missing required import.meta.env.${key}`);
  }
  return String(val);
}

export const BASE_URL = requireEnv("VITE_BACKEND_URL");
export const CLOUDINARY_URL = requireEnv("VITE_CLOUDINARY_URL", "");
export const CLOUDINARY_CLOUD_NAME = requireEnv(
  "VITE_CLOUDINARY_CLOUD_NAME",
  "",
);
