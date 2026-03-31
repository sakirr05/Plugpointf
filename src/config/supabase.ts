import { createClient } from "@supabase/supabase-js";

/**
 * --- WHAT IS SUPABASE? ---
 * Supabase is our online database where we store all 
 * chargers, bookings, and user ratings. 
 * 
 * --- WHAT ARE ENVIRONMENT VARIABLES? ---
 * Notice 'import.meta.env'? These are secret keys stored 
 * in our '.env' file. We never share those secrets!
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// This 'supabase' object is what the rest of the app 
// uses to send and receive data.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
