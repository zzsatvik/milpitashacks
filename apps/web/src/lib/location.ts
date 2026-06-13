const STORAGE_KEY = "lawn-audit-zip";

export function getStoredZipCode(): string {
  try {
    return localStorage.getItem(STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function setStoredZipCode(zip: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, zip.trim());
  } catch {
    /* ignore */
  }
}

export function isValidZipCode(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip.trim());
}

export function normalizeZipCode(zip: string): string {
  return zip.trim().slice(0, 5);
}
