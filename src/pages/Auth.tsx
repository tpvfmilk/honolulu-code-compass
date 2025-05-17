// src/pages/Auth.tsx
import { FC } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Define the props interface for the Auth page
export interface AuthProps {
  onLogout: () => Promise<void>;
}

const Auth: FC<AuthProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthSuccess = () => {
    navigate("/profile");
  };

  // Create a wrapper function that calls onLogout without exposing its async nature
  const wrappedLogout = () => {
    onLogout();
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