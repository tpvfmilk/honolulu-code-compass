
// src/pages/Auth.tsx
import { FC, useState, useEffect } from "react";
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
  const [redirecting, setRedirecting] = useState(false);

  // Redirect if already logged in - with safeguard against loops
  useEffect(() => {
    if (session && !redirecting) {
      console.log("Auth page: User is already logged in, redirecting to profile");
      setRedirecting(true);
      navigate("/profile");
    }
  }, [session, navigate, redirecting]);

  const handleAuthSuccess = () => {
    toast({
      title: "Authentication successful",
      description: "You have been logged in successfully",
    });
    // Let the App.tsx handle the redirection based on session state
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
