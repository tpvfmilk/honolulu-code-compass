
import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle, Shield, Clock, FileText } from "lucide-react";

const Features = () => {
  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Features & Capabilities
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Everything you need to ensure your building designs comply with local codes and regulations
            </p>
          </div>
        </div>
      </div>

      {/* Feature Sections */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Comprehensive Compliance Tools</h2>
            <p className="mt-4 text-lg text-gray-500">
              Our platform covers all aspects of building code compliance
            </p>
          </div>

          {/* Project Setup */}
          <div className="mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-x-8">
            <div className="relative">
              <div className="relative lg:flex lg:items-center">
                <div className="hidden lg:block lg:flex-shrink-0">
                  <div className="h-64 w-64 rounded-full overflow-hidden border-8 border-white shadow-md hawaii-gradient flex items-center justify-center">
                    <FileText className="h-24 w-24 text-white" />
                  </div>
                </div>
                <div className="relative lg:ml-10">
                  <h3 className="text-2xl font-bold text-gray-900">Project Setup & Management</h3>
                  <p className="mt-3 text-lg text-gray-500">
                    Enter basic information about your project and let our system identify all applicable codes automatically.
                  </p>
                  
                  <ul className="mt-6 space-y-3">
                    {[
                      "Intuitive project creation workflow",
                      "Automatic code identification based on location",
                      "Project templates for common building types",
                      "Real-time collaboration with team members",
                      "Comprehensive project dashboard",
                    ].map((item) => (
                      <li key={item} className="flex">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-2 text-gray-500">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Zoning Analysis */}
            <div className="mt-12 lg:mt-0">
              <div className="relative lg:flex lg:items-center">
                <div className="hidden lg:block lg:flex-shrink-0">
                  <div className="h-64 w-64 rounded-full overflow-hidden border-8 border-white shadow-md hawaii-gradient flex items-center justify-center">
                    <Clock className="h-24 w-24 text-white" />
                  </div>
                </div>
                <div className="relative lg:ml-10">
                  <h3 className="text-2xl font-bold text-gray-900">Zoning & Code Analysis</h3>
                  <p className="mt-3 text-lg text-gray-500">
                    Automatically calculate setbacks, height restrictions, and FAR requirements for your specific zoning district.
                  </p>
                  
                  <ul className="mt-6 space-y-3">
                    {[
                      "Hawaii-specific zoning regulations built-in",
                      "Automatic calculation of setback requirements",
                      "Height restriction analysis",
                      "Floor area ratio (FAR) calculations",
                      "Parking requirement assessments",
                    ].map((item) => (
                      <li key={item} className="flex">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-2 text-gray-500">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Feature Rows */}
          <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-x-8">
            {/* Building Classification */}
            <div className="relative">
              <div className="relative lg:flex lg:items-center">
                <div className="hidden lg:block lg:flex-shrink-0">
                  <div className="h-64 w-64 rounded-full overflow-hidden border-8 border-white shadow-md hawaii-gradient flex items-center justify-center">
                    <Shield className="h-24 w-24 text-white" />
                  </div>
                </div>
                <div className="relative lg:ml-10">
                  <h3 className="text-2xl font-bold text-gray-900">Building Classification</h3>
                  <p className="mt-3 text-lg text-gray-500">
                    Determine occupancy groups and construction types with guided assistance.
                  </p>
                  
                  <ul className="mt-6 space-y-3">
                    {[
                      "Occupancy group determination",
                      "Construction type classification",
                      "Mixed occupancy analysis",
                      "Building height and area limitations",
                      "Fire resistance requirements",
                    ].map((item) => (
                      <li key={item} className="flex">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-2 text-gray-500">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Fire & Life Safety */}
            <div className="mt-12 lg:mt-0">
              <div className="relative lg:flex lg:items-center">
                <div className="hidden lg:block lg:flex-shrink-0">
                  <div className="h-64 w-64 rounded-full overflow-hidden border-8 border-white shadow-md hawaii-gradient flex items-center justify-center">
                    <AlertTriangle className="h-24 w-24 text-white" />
                  </div>
                </div>
                <div className="relative lg:ml-10">
                  <h3 className="text-2xl font-bold text-gray-900">Fire & Life Safety</h3>
                  <p className="mt-3 text-lg text-gray-500">
                    Generate compliant egress plans and fire separation requirements automatically.
                  </p>
                  
                  <ul className="mt-6 space-y-3">
                    {[
                      "Egress width calculations",
                      "Travel distance analysis",
                      "Fire separation requirements",
                      "Exit access and arrangement",
                      "Fire protection system requirements",
                    ].map((item) => (
                      <li key={item} className="flex">
                        <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                        <span className="ml-2 text-gray-500">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to simplify building code compliance?</span>
            <span className="block text-white/90">Start your free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/auth?signup=true">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Features;
