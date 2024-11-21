import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://emuoaltyvtmzkzorqgko.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdW9hbHR5dnRtemt6b3JxZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyNjQwMTYsImV4cCI6MjA0Njg0MDAxNn0.QlGj1VFATrD_gd-fQ-Wjf8X_YJW_CJ4PZTq7MJFKSgI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});