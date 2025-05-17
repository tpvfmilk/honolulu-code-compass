
import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";

interface HelpProps {
  onLogout: () => Promise<void>;
}

const Help = ({ onLogout }: HelpProps) => {
  return (
    <AppLayout onLogout={onLogout}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Help & Resources</h1>
        
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Hawaii Code Pro! This guide will help you navigate through our platform and make the most of our code compliance tools.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Create a project by clicking on the "Start New Project" button on the home page</li>
              <li>Fill in your project details and building specifications</li>
              <li>Review the compliance analysis and recommendations</li>
              <li>Access the code reference library for detailed information on specific codes</li>
            </ul>
          </section>
          
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">How accurate is the compliance analysis?</h3>
                <p className="text-gray-600 mt-1">
                  Our compliance analysis is based on the most current building codes adopted in Hawaii. However, it should be used as a guide and not a replacement for professional judgment.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Can I save my project and come back later?</h3>
                <p className="text-gray-600 mt-1">
                  Yes, all projects are automatically saved to your account. You can access them anytime from the "My Projects" section.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">How often are the code references updated?</h3>
                <p className="text-gray-600 mt-1">
                  We update our code references whenever new codes are adopted by Hawaii state or county jurisdictions.
                </p>
              </div>
            </div>
          </section>
          
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <p className="text-gray-700 mb-4">
              Need additional help? Our support team is available to assist you with any questions.
            </p>
            <p className="text-gray-600">
              Email: support@hawaiicodepro.com<br />
              Phone: (808) 555-1234<br />
              Hours: Monday-Friday, 8:00am-4:30pm HST
            </p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Help;
