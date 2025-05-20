
import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Building } from "lucide-react";

const PublicHome = () => {
  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Building Code Compliance <span className="text-primary">Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Streamline your building code compliance process with our powerful platform designed for architects, 
              engineers, and builders.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How Comply Helps You</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Code Verification</CardTitle>
                  <CardDescription>
                    Automatically verify building plans against current code requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our system cross-references your project specifications with the latest building codes to ensure compliance at every step.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <FileText className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Generate comprehensive compliance documentation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Create permit-ready documentation showing how your project meets all applicable building codes and standards.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Building className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Project Management</CardTitle>
                  <CardDescription>
                    Track compliance across multiple projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Manage all your projects in one place with clear visibility into compliance status and requirements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to simplify your compliance process?</h2>
            <p className="text-lg mb-8">
              Join thousands of professionals who use our platform to streamline their building code compliance workflow.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/login">Sign Up Now</Link>
            </Button>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default PublicHome;
