
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthForm } from "@/components/auth/AuthForm";

const Auth = () => {
  return (
    <AppLayout onLogout={() => {}}>
      <div className="max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Sign In or Sign Up</h1>
        <AuthForm />
      </div>
    </AppLayout>
  );
};

export default Auth;
