
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { Building, Lock } from "lucide-react";
import { ComplianceAdminUser } from "../types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ComplianceAdminLogin = () => {
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
      
      // For testing purposes - hardcoded admin credentials
      // In production, this would be handled securely on the server
      if (email === "admin@example.com" && password === "admin123") {
        // Mock successful login
        const mockAdmin: ComplianceAdminUser = {
          id: "mock-id-123",
          email: email,
          role: "admin"
        };
        
        localStorage.setItem('compliance_admin', JSON.stringify(mockAdmin));
        
        toast({
          title: "Success",
          description: "Login successful!",
        });
        
        navigate("/compliance-admin/dashboard");
        return;
      }
      
      // Fallback to direct table query instead of RPC call
      const { data, error: queryError } = await supabase
        .from('compliance_admin_users')
        .select('*')
        .eq('email', email)
        .single();
        
      if (queryError) {
        console.error("Login query error:", queryError);
        throw new Error("Invalid email or password");
      }
      
      if (!data) {
        throw new Error("Invalid email or password");
      }
      
      // In a real implementation we'd verify the password with bcrypt or similar
      // For now, storing admin in localStorage to proceed with the flow
      const admin: ComplianceAdminUser = {
        id: data.id,
        email: data.email,
        role: data.role
      };
      
      localStorage.setItem('compliance_admin', JSON.stringify(admin));
      
      toast({
        title: "Success",
        description: "Login successful!",
      });
      
      navigate("/compliance-admin/dashboard");
      
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
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
              <p>For testing, use: admin@example.com / admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
