import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are set in your .env file
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
