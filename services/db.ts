import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { GeneratedAlbumArt } from '../types';

interface NeonArtDB extends DBSchema {
  gallery: {
    key: string;
    value: GeneratedAlbumArt;
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'neonart-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<NeonArtDB>>;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<NeonArtDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('gallery')) {
          db.createObjectStore('gallery', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
};

export const saveGalleryItem = async (item: GeneratedAlbumArt) => {
  const db = await initDB();
  return db.put('gallery', item);
};

export const getGalleryItems = async (): Promise<GeneratedAlbumArt[]> => {
  const db = await initDB();
  const items = await db.getAll('gallery');
  // Sort by createdAt descending (newest first)
  return items.sort((a, b) => b.createdAt - a.createdAt);
};

export const deleteGalleryItem = async (id: string) => {
  const db = await initDB();
  return db.delete('gallery', id);
};

export const saveSetting = async (key: string, value: any) => {
  const db = await initDB();
  return db.put('settings', { key, value });
};

export const getSetting = async (key: string) => {
  const db = await initDB();
  const result = await db.get('settings', key);
  return result?.value;
};

// Migration helper: Move localStorage to IndexedDB
export const migrateFromLocalStorage = async () => {
  try {
    const localGallery = localStorage.getItem('neonart_gallery');
    if (localGallery) {
      const items: GeneratedAlbumArt[] = JSON.parse(localGallery);
      if (items.length > 0) {
        const db = await initDB();
        const tx = db.transaction('gallery', 'readwrite');
        const store = tx.objectStore('gallery');
        
        for (const item of items) {
          await store.put(item);
        }
        await tx.done;
        
        // Clear localStorage after successful migration
        localStorage.removeItem('neonart_gallery');
        console.log(`Migrated ${items.length} items from localStorage to IndexedDB.`);
      }
    }
  } catch (e) {
    console.error("Migration failed:", e);
  }
};
