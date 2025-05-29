import { createClient } from "@supabase/supabase-js";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  throw new Error(
    "Supabase URL and Anon Key must be set in environment variables.",
  );
}

// Function to get a Supabase client with the current user's JWT
export const getSupabaseClient = async (token: Promise<string | null>) => {
  try {
    const resolvedToken = await token;

    if (!resolvedToken) {
      console.warn("No valid token provided for Supabase client");
      // Return a client without auth for public data access
      return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
    }

    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${resolvedToken}`,
          },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    throw error;
  }
};
