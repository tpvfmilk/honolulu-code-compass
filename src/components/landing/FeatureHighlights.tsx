
import React from "react";
import { CheckCircle, FileText, Database, Shield } from "lucide-react";

export const FeatureHighlights = () => {
  const features = [
    {
      name: "Smart Code Analysis",
      description:
        "Our platform automatically identifies applicable building codes based on your project details and location.",
      icon: <FileText className="h-6 w-6 text-primary" />,
    },
    {
      name: "Automated Calculations",
      description:
        "Calculate setbacks, height restrictions, FAR requirements, occupant loads, and more with just a few clicks.",
      icon: <Database className="h-6 w-6 text-primary" />,
    },
    {
      name: "Compliance Documentation",
      description:
        "Generate permit-ready compliance sheets and documentation in minutes, not hours.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
    },
    {
      name: "Project Security",
      description:
        "All your project data is securely stored and encrypted to protect your intellectual property.",
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for code compliance
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Comply offers a comprehensive suite of tools to streamline the building code compliance process.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-white text-primary border border-primary/20">
                    {feature.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
