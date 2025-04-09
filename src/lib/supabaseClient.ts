import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1)
      .single();

    if (error) {
      console.error('Database connection error:', error.message);
      return false;
    }

    console.log('Database connected successfully');
    return true;
  } catch (err) {
    console.error('Unexpected error during database connection test:', err);
    return false;
  }
};

// Run the connection test
testConnection().catch(console.error);

// Admin authentication functions
export const adminAuth = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase
      .rpc('verify_admin_password', {
        p_email: email,
        p_password: password
      });

    if (error) throw error;
    if (!data) throw new Error('Email ou mot de passe incorrect');

    // Store admin session in localStorage
    localStorage.setItem('adminSession', JSON.stringify({ email }));
    return { email };
  },

  signOut: async () => {
    localStorage.removeItem('adminSession');
  },

  getSession: () => {
    const session = localStorage.getItem('adminSession');
    return session ? JSON.parse(session) : null;
  },

  // Function to invoke Edge Functions
  invokeFunction: async (functionName: string, { body, headers = {} }: { body?: any; headers?: Record<string, string> } = {}) => {
    const functionUrl = `${supabaseUrl}/functions/v1/${functionName}`;
    
    try {
      console.log(`Invoking Edge Function: ${functionName}`, { url: functionUrl, body });
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || `Failed to call Edge Function: ${functionName}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error invoking Edge Function ${functionName}:`, error);
      throw error;
    }
  }
};

export default supabase;