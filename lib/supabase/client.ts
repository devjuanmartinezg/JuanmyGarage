import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true, // Enable auto-refresh for proper token management
      detectSessionInUrl: true, // Enable session detection for OAuth callbacks
    },
    global: {
      headers: {
        "x-client-info": "supabase-js-web",
      },
    },
  })
}
