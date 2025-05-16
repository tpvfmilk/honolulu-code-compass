
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Page Not Found
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="text-9xl font-bold text-primary mb-2">404</div>
            <p className="text-lg text-gray-600">
              We couldn't find what you're looking for
            </p>
          </div>
          
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>The requested URL was not found</AlertTitle>
            <AlertDescription className="mt-2">
              The page <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-sm">
                {location.pathname}
              </span> does not exist on this server.
            </AlertDescription>
          </Alert>
          
          <p className="text-gray-500 text-sm">
            You may have mistyped the address, or the page may have been moved or deleted.
          </p>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Button 
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate("/")} 
            className="w-full sm:w-auto"
          >
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
