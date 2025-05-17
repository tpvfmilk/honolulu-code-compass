
import { createContext, useState, useContext, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";

type SessionContextType = {
  session: Session | null;
  setSession: (session: Session | null) => void;
};

const SessionContext = createContext<SessionContextType>({
  session: null,
  setSession: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
