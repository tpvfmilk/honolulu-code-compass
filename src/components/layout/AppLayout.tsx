
import { ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

type AppLayoutProps = {
  children: ReactNode;
  onLogout: () => void;
};

export const AppLayout = ({
  children,
  onLogout
}: AppLayoutProps) => {
  const { toast } = useToast();
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    onLogout();
  };

  return (
    <div className="min-h-screen flex w-full overflow-hidden">
      <AppSidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>
  );
};
