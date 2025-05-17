
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type HelpProps = {
  onLogout: () => void;
};

const Help = ({ onLogout }: HelpProps) => {
  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground">Find answers to common questions about the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Answers to common questions about using the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">How do I create a new project?</h3>
                  <p className="text-sm text-muted-foreground">Navigate to the Projects page and click the "Create New Project" button. Follow the step-by-step wizard to set up your project.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Can I export my compliance reports?</h3>
                  <p className="text-sm text-muted-foreground">Yes, once a project is complete, you can export the compliance report as a PDF from the project view page.</p>
                </div>
                <div>
                  <h3 className="font-semibold">How do I update my account information?</h3>
                  <p className="text-sm text-muted-foreground">Go to your Profile page to update your personal and professional information.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@hibuildingcode.com</p>
                </div>
                <div>
                  <h3 className="font-semibold">Phone Support</h3>
                  <p className="text-sm text-muted-foreground">(808) 555-1234</p>
                  <p className="text-xs text-muted-foreground">Monday-Friday, 8:00am-5:00pm HST</p>
                </div>
                <div>
                  <h3 className="font-semibold">Office Address</h3>
                  <p className="text-sm text-muted-foreground">123 Ala Moana Blvd, Honolulu, HI 96813</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Help;
