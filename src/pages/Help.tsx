import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
type HelpProps = {
  onLogout: (() => void) | (() => Promise<void>);
};
const Help = ({
  onLogout
}: HelpProps) => {
  return <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions about the platform</p>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Answers to common questions about using the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">What is the Hawaii Building Code Compliance Platform?</h3>
                  <p className="text-sm text-muted-foreground">Our platform helps architects and engineers generate accurate building code compliance sheets for permit submissions in Hawaii, with a focus on City & County of Honolulu requirements. It transforms a 2-4 hour manual process into a guided 5-20 minute experience</p>
                </div>
                <div>
                  <h3 className="font-semibold">Which jurisdictions are supported?</h3>
                  <p className="text-sm text-muted-foreground">Currently, we fully support the City & County of Honolulu.</p>
                </div>
                <div>
                  <h3 className="font-semibold">How do I create a new project?</h3>
                  <p className="text-sm text-muted-foreground">Navigate to the Projects page and click the "Create New Project" button. Follow the step-by-step wizard to set up your project.</p>
                </div>
                <div>
                  <h3 className="font-semibold">Can I use this for renovation projects or only new construction?</h3>
                  <p className="text-sm text-muted-foreground">The platform supports both new construction and renovation projects. When creating a project, select the appropriate project type to access specialized fields for renovation projects (original construction year, alteration level, etc.).</p>
                </div>
                <div>
                  <h3 className="font-semibold">How do I input zoning information?</h3>
                  <p className="text-sm text-muted-foreground">In Step 2 of the project wizard, select your zoning district from the dropdown menu. The system will automatically calculate setback requirements, height limits, lot coverage, and FAR based on your inputs.</p>
                </div>     
                <div>
                  <h3 className="font-semibold">How are occupant loads calculated?</h3>
                  <p className="text-sm text-muted-foreground">The platform automatically calculates occupant loads based on IBC Table 1004.5 when you enter spaces in Step 5. Simply input your space types and areas, and the system will determine the required occupant loads and egress requirements.</p>
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
    </AppLayout>;
};
export default Help;