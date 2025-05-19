
import React, { FC } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export interface IndexProps {
  onLogout: () => Promise<void>;
}
const Index: FC<IndexProps> = ({
  onLogout
}) => {
  // Create a wrapper function that calls onLogout without exposing its async nature
  const wrappedLogout = () => {
    onLogout();
  };
  return <AppLayout onLogout={wrappedLogout}>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold">Comply</h1>
          <p className="text-muted-foreground mt-2">
            Building Code Compliance Made Simple
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Everything you need to know about using this platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                <li className="text-sm">Project Setup: Enter basic information and let our system identify applicable codes</li>
                <li className="text-sm">Zoning Analysis: Automatically calculate setbacks, height restrictions, and FAR requirements</li>
                <li className="text-sm">Building Classification: Determine occupancy groups and construction types with guidance</li>
                <li className="text-sm">Fire &amp; Life Safety: Generate compliant egress plans and fire separation requirements</li>
                <li className="text-sm">Space Analysis: Calculate occupant loads and related requirements automatically</li>
                <li className="text-sm">Document Generation: Create permit-ready compliance sheets in minutes</li>
              </ul>
              <div className="flex justify-start pt-2">
                <Button asChild>
                  <Link to="/help">Learn More</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
              <CardDescription>
                Create and manage compliance documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <p>Comply helps you develop code-compliant designs from the earliest stages, ensuring your submissions move smoothly through the approval process.</p>
                
                <p>Start a new project or continue working on existing ones. Track compliance across multiple aspects of building codes simultaneously.</p>
                
                <p>Your dashboard provides real-time visibility into compliance status, helping you identify and resolve issues before submission.</p>
                
                <p>Each project maintains a complete history of compliance decisions, creating valuable documentation for your records.</p>
              </div>
              <div className="flex justify-start space-x-4 pt-2">
                <Button asChild>
                  <Link to="/project/new">New Project</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/projects">View Projects</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About Comply</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="mb-3">
              Our platform streamlines the process of ensuring your building designs meet
              all required codes and regulations specific to Hawaii.
            </p>
            <p>
              We cover fire safety, accessibility, structural requirements, and zoning regulations
              to provide a comprehensive compliance solution.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>;
};
export default Index;
