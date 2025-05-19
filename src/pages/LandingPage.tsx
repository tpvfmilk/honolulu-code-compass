
import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Hero } from "@/components/landing/Hero";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { Testimonials } from "@/components/landing/Testimonials";
import { CallToAction } from "@/components/landing/CallToAction";

const LandingPage = () => {
  return (
    <PublicLayout>
      <Hero />
      <FeatureHighlights />
      <Testimonials />
      <CallToAction />
    </PublicLayout>
  );
};

export default LandingPage;
