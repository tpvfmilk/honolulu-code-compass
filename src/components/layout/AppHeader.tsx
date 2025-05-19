
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

export const AppHeader = () => {
  const { session } = useSession();
  const [username, setUsername] = useState("");
  const [initials, setInitials] = useState(""); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching username:', error);
          return;
        }
        
        if (data?.username) {
          setUsername(data.username);
          
          // Generate initials from username
          const nameParts = data.username.split(' ');
          if (nameParts.length >= 2) {
            setInitials(`${nameParts[0][0]}${nameParts[1][0]}`);
          } else if (nameParts.length === 1 && nameParts[0].length > 0) {
            setInitials(nameParts[0][0]);
          } else {
            setInitials("U");
          }
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchUserProfile();
  }, [session]);

  return (
    <header className="border-b bg-card px-[16px] py-[15px]">
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{username || "User"}</span>
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
            {initials || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};
