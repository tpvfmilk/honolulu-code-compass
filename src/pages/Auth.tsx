
// src/pages/Auth.tsx
import { FC, useState, useEffect } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/hooks/useSession";

// Define the props interface for the Auth page
export interface AuthProps {
  onLogout: () => Promise<void>;
}

const Auth: FC<AuthProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { session } = useSession();
  const [redirecting, setRedirecting] = useState(false);
  
  // Check URL params for signup mode
  const searchParams = new URLSearchParams(location.search);
  const isSignup = searchParams.get("signup") === "true";

  // Redirect if already logged in - with safeguard against loops
  useEffect(() => {
    if (session && !redirecting) {
      console.log("Auth page: User is already logged in, redirecting to home");
      setRedirecting(true);
      navigate("/");
    }
  }, [session, navigate, redirecting]);

  const handleAuthSuccess = () => {
    toast({
      title: "Authentication successful",
      description: "You have been logged in successfully",
    });
    // Redirect to home page after successful authentication
    navigate("/");
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h1>
        <p className="text-gray-500 mb-8">
          {isSignup 
            ? "Sign up to start creating compliant building code sheets"
            : "Sign in to continue with your projects"
          }
        </p>
        <AuthForm onSuccess={handleAuthSuccess} defaultIsLogin={!isSignup} />
      </div>
    </AuthLayout>
  );
};

export default Auth;
