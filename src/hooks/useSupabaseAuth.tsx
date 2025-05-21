
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useSupabaseClient() {
  return supabase;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST (best practice to avoid missing auth events)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state change:", _event, session ? "Session exists" : "No session");
      setSession(session);
      setIsInitialized(true);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session ? "Found session" : "No session");
      setSession(session);
      setIsInitialized(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return session;
}
