import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      supabasePublishableKey &&
      !supabaseUrl.includes('YOUR_SUPABASE_PROJECT_URL') &&
      !supabasePublishableKey.includes('YOUR_SUPABASE_PUBLISHABLE_KEY') &&
      supabaseUrl.startsWith('http')
  );
};

if (!isSupabaseConfigured()) {
  console.warn(
    '[SCAP Supabase] Environment variables VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY are missing or set to placeholder values. Using local fallback data until configured.'
  );
}

// Instantiate client (using dummy values if unconfigured to prevent hard crash during module load)
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabasePublishableKey : 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Safe connection test helper
 * Checks if Supabase client can reach the database without throwing exceptions.
 */
export async function testSupabaseConnection(tableName: string = 'users'): Promise<{
  connected: boolean;
  message: string;
  data?: any;
  error?: any;
}> {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in .env (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY).',
    };
  }

  try {
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    if (error) {
      return {
        connected: false,
        message: `Supabase query error on table '${tableName}': ${error.message} (Code: ${error.code})`,
        error,
      };
    }
    return {
      connected: true,
      message: `Successfully connected to Supabase table '${tableName}'!`,
      data,
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Supabase network/connection error: ${err.message || err}`,
      error: err,
    };
  }
}
