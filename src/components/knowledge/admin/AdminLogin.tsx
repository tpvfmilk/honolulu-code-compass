
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { KBAdminUser } from "../types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Attempting login with:", email);
      
      // Call the secure login function in Supabase
      const { data, error: rpcError } = await supabase.rpc('kb_admin_login', {
        admin_email: email,
        admin_password: password
      });
      
      console.log("Login response:", data, "Error:", rpcError);
      
      if (rpcError) {
        throw new Error(rpcError.message || "Login failed");
      }
      
      // Handle the response properly with type checking
      const response = data as unknown as { success: boolean; message?: string; admin?: KBAdminUser };
      
      if (!response || !response.success) {
        throw new Error(response?.message || "Invalid email or password");
      }
      
      // Store admin session in localStorage (not using Supabase auth)
      if (response.admin) {
        localStorage.setItem('kb_admin', JSON.stringify(response.admin));
        
        toast.success("Login successful!");
        navigate("/admin/dashboard");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center justify-center">
            <Lock className="mr-2 h-6 w-6" />
            Knowledge Base Admin
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-destructive/10 text-destructive border-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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
            <div className="text-sm text-center text-muted-foreground mt-4">
              <p>For testing, use the credentials provided by your administrator</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
