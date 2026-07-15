import { USER_ZIPCODE } from '@/lib/constants';

const STORAGE_KEY = USER_ZIPCODE;

/** Encodes a zipcode before persisting in browser storage. */
export function encodeZipcodeForStorage(zipcode: string): string {
  return btoa(encodeURIComponent(zipcode));
}

/** Decodes a zipcode previously stored with {@link encodeZipcodeForStorage}. */
export function decodeZipcodeFromStorage(encodedZipcode: string): string | null {
  try {
    return decodeURIComponent(atob(encodedZipcode));
  } catch {
    return null;
  }
}

function readStoredZipcodeValue(encodedOrLegacyValue: string): string {
  return decodeZipcodeFromStorage(encodedOrLegacyValue) ?? encodedOrLegacyValue;
}

export function storeZipcodeInSession(zipcode: string): void {
  sessionStorage.setItem(STORAGE_KEY, encodeZipcodeForStorage(zipcode));
}

export function readZipcodeFromSession(): string | null {
  const storedValue = sessionStorage.getItem(STORAGE_KEY);
  return storedValue ? readStoredZipcodeValue(storedValue) : null;
}

export function clearZipcodeFromSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
