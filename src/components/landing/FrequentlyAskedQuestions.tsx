
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FrequentlyAskedQuestions = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Find answers to common questions about our building code compliance platform.
          </p>
        </div>
        <div className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b">
                <AccordionTrigger className="text-left font-medium text-lg py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-1 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

const faqItems = [
  {
    question: "What building codes does Comply cover?",
    answer:
      "Comply covers the International Building Code (IBC) as well as Hawaii-specific amendments, including requirements for hurricane protection, energy efficiency, and accessibility compliance.",
  },
  {
    question: "How accurate are the calculations and code references?",
    answer:
      "Our platform is regularly updated with the latest code revisions and amendments. All calculations and references are verified by professional architects and engineers to ensure 100% accuracy for your building permit applications.",
  },
  {
    question: "Can I use Comply for my permit application?",
    answer:
      "Yes! Comply generates professional documentation that meets all requirements for building permit applications in Hawaii. Many jurisdictions across the islands now accept and prefer digital compliance documentation.",
  },
  {
    question: "How much time can I save using Comply?",
    answer:
      "Most users report a 60-75% reduction in time spent on code compliance documentation. What traditionally takes days can often be completed in just hours using our platform.",
  },
  {
    question: "Is my project information secure?",
    answer:
      "Absolutely. We use enterprise-grade encryption and security protocols to ensure your project data remains confidential and protected at all times. We never share your information with third parties.",
  },
];
