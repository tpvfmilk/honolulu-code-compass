
import { createContext, useState, useContext, ReactNode, useRef } from "react";
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
  const sessionUpdateTimeRef = useRef<number>(0);
  
  // Prevent rapid session updates that could cause render loops
  const setSessionWithDebounce = (newSession: Session | null) => {
    const now = Date.now();
    
    // If it's been less than 300ms since the last update and the session status isn't changing
    // (both null or both non-null), then skip this update
    if (now - sessionUpdateTimeRef.current < 300 && 
        (!!newSession === !!session)) {
      return;
    }
    
    sessionUpdateTimeRef.current = now;
    setSession(newSession);
  };
  
  return (
    <SessionContext.Provider value={{ session, setSession: setSessionWithDebounce }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
