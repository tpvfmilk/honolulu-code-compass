
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Logged in successfully');
      navigate('/profile');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignup = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      if (data?.user) {
        toast.success('Account created! Check your email for confirmation.');
      }
    } catch (error: any) {
      toast.error(`Signup failed: ${error.message}`);
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Hawaii Code Pro
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <AuthForm 
            handleLogin={handleLogin}
            handleSignup={handleSignup}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
