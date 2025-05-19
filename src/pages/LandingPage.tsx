
import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Hero } from "@/components/landing/Hero";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { FrequentlyAskedQuestions } from "@/components/landing/FrequentlyAskedQuestions";
import { CallToAction } from "@/components/landing/CallToAction";

const LandingPage = () => {
  return (
    <PublicLayout>
      <Hero />
      <FeatureHighlights />
      <FrequentlyAskedQuestions />
      <CallToAction />
    </PublicLayout>
  );
};

export default LandingPage;
