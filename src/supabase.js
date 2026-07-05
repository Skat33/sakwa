import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "Brak konfiguracji Supabase. Utwórz plik .env z VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY (lokalnie) oraz dodaj te same zmienne w Vercel → Settings → Environment Variables."
  );
}

export const supabase = createClient(url, key);
