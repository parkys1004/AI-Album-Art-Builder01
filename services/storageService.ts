
import { GeneratedAlbumArt } from "../types";

// Simple obfuscation/encryption for local storage
// In a real-world high-security scenario, you would avoid storing sensitive keys in localStorage
// or use more robust encryption requiring a user-provided password every session.
const STORAGE_KEY = 'neonart_api_key_enc';
const GALLERY_KEY = 'neonart_gallery';
const SALT = 'NEON_ART_SECURE_SALT_v1';

const xorCipher = (text: string): string => {
  const textChars = text.split('').map(c => c.charCodeAt(0));
  const saltChars = SALT.split('').map(c => c.charCodeAt(0));
  let result = "";
  for(let i = 0; i < textChars.length; i++) {
      result += String.fromCharCode(textChars[i] ^ saltChars[i % saltChars.length]);
  }
  return result;
};

export const saveApiKey = (apiKey: string): void => {
  if (!apiKey) return;
  try {
    const encrypted = btoa(xorCipher(apiKey)); // Base64 encode the XOR'd string
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (e) {
    console.error("Failed to save API key", e);
  }
};

export const getDecryptedApiKey = (): string | null => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) return null;
    return xorCipher(atob(encrypted)); // Decode Base64 then Reverse XOR
  } catch (e) {
    console.error("Failed to load API key", e);
    return null;
  }
};

export const clearApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasSavedApiKey = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};

// Gallery Storage with Quota Management
export const saveGalleryItems = (items: GeneratedAlbumArt[]): GeneratedAlbumArt[] => {
    let currentItems = [...items];
    
    while (currentItems.length > 0) {
        try {
            localStorage.setItem(GALLERY_KEY, JSON.stringify(currentItems));
            return currentItems; // Success
        } catch (e: any) {
            if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014 || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                // Remove the oldest item (last in array)
                console.warn("Storage quota exceeded. Removing oldest item to make space.");
                currentItems.pop();
            } else {
                console.error("Failed to save gallery items:", e);
                throw e; // Other error
            }
        }
    }
    return []; // Failed to save anything
};

export const loadGalleryItems = (): GeneratedAlbumArt[] => {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(GALLERY_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to load gallery items:", e);
        return [];
    }
};
