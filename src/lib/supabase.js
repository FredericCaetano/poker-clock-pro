import { createClient } from "@supabase/supabase-js";

// Projet Supabase partagé (réutilisé pour mariage, gestion financière, poker-clock-pro).
// La clé "anon" est publique par nature (protection au niveau app, pas RLS).
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://gpmpghjqkhuobcnqgasm.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwbXBnaGpxa2h1b2JjbnFnYXNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDQ0MDgsImV4cCI6MjEwMzU4MDQwOH0.rMJy2lXJy4zrbyme_Iasim7atZmJExvTI7qjkeJ7Rio";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
