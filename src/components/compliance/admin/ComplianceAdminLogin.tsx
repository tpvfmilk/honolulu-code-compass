
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building, Lock } from "lucide-react";
import { ComplianceAdminUser } from "../types";

export const ComplianceAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Call the secure login function in Supabase
      const { data, error } = await supabase.rpc('compliance_admin_login', {
        admin_email: email,
        admin_password: password
      });
      
      if (error) {
        throw new Error(error.message || "Login failed");
      }
      
      // Handle the response properly with type checking
      const response = data as unknown as { success: boolean; message?: string; admin?: ComplianceAdminUser };
      
      if (!response.success) {
        throw new Error(response.message || "Invalid email or password");
      }
      
      // Store admin session in localStorage (not using Supabase auth)
      if (response.admin) {
        localStorage.setItem('compliance_admin', JSON.stringify(response.admin));
        
        toast({
          title: "Success",
          description: "Login successful!",
        });
        navigate("/compliance-admin/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast({
        title: "Login failed",
        description: err.message || "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center justify-center">
            <Building className="mr-2 h-6 w-6" />
            Compliance Admin Portal
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the compliance data dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
