
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Answers to common questions about using the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b">
                  <AccordionTrigger className="py-4 text-left font-medium">
                    What is the Comply platform?
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground">
                    Our platform helps architects and engineers generate accurate building code compliance sheets for permit submissions in Hawaii, with a focus on City & County of Honolulu requirements. It transforms a 2-4 hour manual process into a guided 5-20 minute experience.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b">
                  <AccordionTrigger className="py-4 text-left font-medium">
                    Which jurisdictions are supported?
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground">
                    Currently, we fully support the City & County of Honolulu.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b">
                  <AccordionTrigger className="py-4 text-left font-medium">
                    How do I create a new project?
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground">
                    Navigate to the Projects page and click the "Create New Project" button. Follow the step-by-step wizard to set up your project.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-b">
                  <AccordionTrigger className="py-4 text-left font-medium">
                    Can I use this for renovation projects or only new construction?
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground">
                    The platform supports both new construction and renovation projects. When creating a project, select the appropriate project type to access specialized fields for renovation projects (original construction year, alteration level, etc.).
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-b">
                  <AccordionTrigger className="py-4 text-left font-medium">
                    How do I input zoning information?
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground">
                    In Step 2 of the project wizard, select your zoning district from the dropdown menu. The system will automatically calculate setback requirements, height limits, lot coverage, and FAR based on your inputs.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6" className="border-b">
                  <AccordionTrigger className="py-4 text-left font-medium">
                    How are occupant loads calculated?
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground">
                    The platform automatically calculates occupant loads based on IBC Table 1004.5 when you enter spaces in Step 5. Simply input your space types and areas, and the system will determine the required occupant loads and egress requirements.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7" className="border-b">
                  <AccordionTrigger className="py-4 text-left font-medium">
                    What code versions are supported?
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground">
                    Comply currently supports the 2018 International Building Code (IBC) with Hawaii amendments, the 2018 International Existing Building Code (IEBC), and relevant zoning ordinances for the City & County of Honolulu.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger className="py-4 text-left font-medium">
                    How do I export my compliance documents?
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1 text-sm text-muted-foreground">
                    Once you've completed all steps in the project wizard, go to the Review step and click "Generate PDF" to create a permit-ready compliance sheet that you can download and include with your submission package.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
