
import React from "react";

export const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Trusted by architects and engineers
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Professionals across Hawaii rely on Comply to streamline their building code compliance process.
          </p>
        </div>
        <div className="mt-12 space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 hawaii-card-shadow"
            >
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                      {testimonial.initials}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-medium text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.title}</div>
                  </div>
                </div>
                <div className="mt-4 text-base text-gray-500">
                  "{testimonial.quote}"
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Principal Architect, Pacific Design Group",
    initials: "SJ",
    quote:
      "Comply has reduced our code compliance documentation time by 70%. What used to take days now takes hours.",
  },
  {
    name: "David Lee",
    title: "Senior Engineer, Hawaii Structures",
    initials: "DL",
    quote:
      "The automated calculations are incredibly accurate. We've had zero compliance issues since we started using Comply.",
  },
  {
    name: "Michelle Wong",
    title: "Project Manager, Oahu Development",
    initials: "MW",
    quote:
      "The permit application process is so much smoother now. Comply has become an essential tool for our team.",
  },
];
