import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

let AsyncStorage;
if (Platform.OS === 'web') {
  let storage: Storage | null = null;
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    storage = window.localStorage;
  } else {
    // Fallback to in-memory storage if localStorage is not available (SSR, Node.js)
    let memoryStore: Record<string, string> = {};
    storage = {
      getItem: (key: string) => memoryStore[key] ?? null,
      setItem: (key: string, value: string) => { memoryStore[key] = value; },
      removeItem: (key: string) => { delete memoryStore[key]; },
      clear: () => { memoryStore = {}; },
      key: (i: number) => Object.keys(memoryStore)[i] ?? null,
      get length() { return Object.keys(memoryStore).length; },
    } as Storage;
  }
  AsyncStorage = {
    getItem: async (key: string): Promise<string | null> => storage!.getItem(key),
    setItem: async (key: string, value: string): Promise<void> => { storage!.setItem(key, value); },
    removeItem: async (key: string): Promise<void> => { storage!.removeItem(key); },
  };
} else {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});