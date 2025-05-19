
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CallToAction = () => {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to simplify compliance?</span>
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
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link to="/features">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-primary-foreground/10">
                Learn more
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
