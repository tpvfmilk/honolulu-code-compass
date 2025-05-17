
import { AppLayout } from "@/components/layout/AppLayout";

const Help = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <AppLayout onLogout={onLogout}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Help & Documentation</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to the Hawaii Building Code Compliance Platform. This help section will guide you through the key features and functionalities of the platform.
            </p>
            <p className="text-muted-foreground">
              To begin, create a new project from your dashboard and follow the step-by-step wizard to input your project details.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold">How do I create a new project?</h3>
                <p className="text-muted-foreground">
                  Click on the "New Project" button on your dashboard and follow the guided wizard to enter your project details.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold">How can I export my compliance report?</h3>
                <p className="text-muted-foreground">
                  Open your project, navigate to the "Review" tab, and click on "Export PDF" to generate a downloadable compliance report.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold">What building codes are supported?</h3>
                <p className="text-muted-foreground">
                  Currently, the platform supports the 2018 International Building Code (IBC) as adopted by the State of Hawaii, including local amendments.
                </p>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
            <p className="text-muted-foreground mb-4">
              Need additional help? Our support team is available Monday through Friday, 8:00 AM to 5:00 PM HST.
            </p>
            <div className="bg-card p-4 rounded-lg border">
              <p className="font-semibold">Email Support:</p>
              <p className="text-primary">support@hibuildingcode.com</p>
              
              <p className="font-semibold mt-3">Phone Support:</p>
              <p>(808) 555-1234</p>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Help;
