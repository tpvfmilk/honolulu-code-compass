
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthForm } from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type AuthProps = {
  onLogout: (() => void) | (() => Promise<void>);
};

const Auth = ({ onLogout }: AuthProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthSuccess = () => {
    navigate("/profile");
  };

  return (
    <AppLayout onLogout={onLogout}>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Sign In or Sign Up</h1>
        <AuthForm onSuccess={handleAuthSuccess} />
      </div>
    </AppLayout>
  );
};

export default Auth;
