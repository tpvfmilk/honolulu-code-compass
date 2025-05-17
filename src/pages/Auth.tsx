
// src/pages/Auth.tsx
import { FC, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/hooks/useSession";

// Define the props interface for the Auth page
export interface AuthProps {
  onLogout: () => Promise<void>;
}

const Auth: FC<AuthProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      navigate("/profile");
    }
  }, [session, navigate]);

  const handleAuthSuccess = () => {
    toast({
      title: "Authentication successful",
      description: "You have been logged in successfully",
    });
    navigate("/profile");
  };

  // Create a wrapper function that calls onLogout without exposing its async nature
  const wrappedLogout = () => {
    onLogout().catch(error => {
      console.error("Logout error:", error);
      toast({
        title: "Logout error",
        description: "There was a problem logging out",
        variant: "destructive",
      });
    });
  };

  return (
    <AppLayout onLogout={wrappedLogout}>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Sign In or Sign Up</h1>
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    </AppLayout>
  );
};

export default Auth;
