import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a mock storage implementation for development
const mockStorage = {
  getItem: async (key: string): Promise<string | null> => {
    console.log('Mock storage: getItem', key);
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    console.log('Mock storage: setItem', key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    console.log('Mock storage: removeItem', key);
  },
};

// Use mock storage for development
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mockStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
