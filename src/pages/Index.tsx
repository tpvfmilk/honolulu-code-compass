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
          <h1 className="text-4xl font-bold">Hawaii Building Code Compliance</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to the Hawaii Building Code Compliance platform
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
              <p>This platform transforms building code compliance from a time-consuming challenge into a streamlined process. Architects and builders using Comply save an average of 3.5 hours per project while increasing first-time approval rates.

Our step-by-step approach guides you through:

Project Setup: Enter basic information and let our system identify applicable codes
Zoning Analysis: Automatically calculate setbacks, height restrictions, and FAR requirements
Building Classification: Determine occupancy groups and construction types with guidance
Fire & Life Safety: Generate compliant egress plans and fire separation requirements
Space Analysis: Calculate occupant loads and related requirements automatically
Document Generation: Create permit-ready compliance sheets in minutes

We've designed Comply to work for professionals at all experience levels, from seasoned architects to those just learning code requirements.</p>
              <div className="flex justify-start">
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
              <p>
                Start a new project or continue working on existing ones.
                Track compliance across multiple aspects of the building code.
              </p>
              <div className="flex justify-start space-x-4">
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
            <CardTitle>About Hawaii Building Code Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our platform streamlines the process of ensuring your building designs meet
              all required codes and regulations specific to Hawaii. We cover fire safety,
              accessibility, structural requirements, and zoning regulations.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>;
};
export default Index;