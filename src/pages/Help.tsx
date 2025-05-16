
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

const Help = ({ onLogout }: { onLogout: () => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Help & Documentation</h1>
          <p className="text-muted-foreground">Find answers to common questions and learn how to use the platform</p>
        </div>
        
        <div className="relative max-w-xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            className="pl-10"
            placeholder="Search for help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid grid-cols-4 w-[600px] mb-8">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="code-explanations">Code Explanations</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started Guide</CardTitle>
                <CardDescription>
                  Learn the basics of using the Hawaii Code Compliance Platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">1. Creating Your First Project</h3>
                  <p className="text-muted-foreground">
                    Start by clicking the "New Project" button on your dashboard. You'll be guided through a step-by-step process to input your project details.
                  </p>
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Creating a new project" 
                      className="w-full h-48 object-cover" 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">2. Zoning Information</h3>
                  <p className="text-muted-foreground">
                    Select the appropriate zoning district for your project. The system will automatically calculate setbacks, height limits, and other requirements.
                  </p>
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Zoning information" 
                      className="w-full h-48 object-cover" 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">3. Generating Code Sheets</h3>
                  <p className="text-muted-foreground">
                    After completing all required information, you can preview and generate professional PDF code sheets ready for permit submission.
                  </p>
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Generating code sheets" 
                      className="w-full h-48 object-cover" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Watch step-by-step video guides for using key features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Tutorial Video 1</span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium">Platform Overview</h4>
                      <p className="text-sm text-muted-foreground">3:45</p>
                    </div>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Tutorial Video 2</span>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium">Creating Projects</h4>
                      <p className="text-sm text-muted-foreground">5:12</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code-explanations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Building Code References</CardTitle>
                <CardDescription>
                  Explanations of key building code requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Zoning Setbacks</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-3">
                        Setbacks are the minimum distances required between a building and the property lines. These vary by zoning district in Honolulu:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>R-3.5: Front 10', Side 5', Rear 5'</li>
                        <li>R-5: Front 10', Side 5', Rear 5'</li>
                        <li>R-7.5: Front 15', Side 5', Rear 5'</li>
                        <li>R-10: Front 15', Side 5', Rear 5'</li>
                        <li>A-2: Front 10', Side 10', Rear 10'</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Building Height Limits</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-3">
                        Most residential districts in Honolulu limit building heights to 25-30 feet, depending on the specific zoning. Mixed-use and commercial districts may allow greater heights.
                      </p>
                      <p>
                        The building height is measured from the highest point of the roof to the finished grade directly below.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Floor Area Ratio (FAR)</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-3">
                        FAR is calculated by dividing the total floor area of all buildings on a lot by the lot area. For example, a FAR of 0.5 on a 10,000 sq ft lot allows up to 5,000 sq ft of floor area.
                      </p>
                      <p>
                        Different zoning districts have different maximum FAR values, ranging from 0.5 in residential areas to 3.5 or higher in high-density areas.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code Update History</CardTitle>
                <CardDescription>
                  Track changes to building codes and zoning regulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-4 pb-3 border-b">
                    <div className="w-24 text-sm font-medium">May 2023</div>
                    <div>
                      <p className="font-medium">LUO Amendment 2023-01</p>
                      <p className="text-sm text-muted-foreground">Updated setback requirements for corner lots in R-5 zones</p>
                    </div>
                  </div>
                  <div className="flex gap-4 pb-3 border-b">
                    <div className="w-24 text-sm font-medium">Jan 2023</div>
                    <div>
                      <p className="font-medium">Building Code 2018 Adoption</p>
                      <p className="text-sm text-muted-foreground">Honolulu adopted the 2018 International Building Code with local amendments</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-24 text-sm font-medium">Nov 2022</div>
                    <div>
                      <p className="font-medium">ADU Regulation Updates</p>
                      <p className="text-sm text-muted-foreground">New guidelines for Accessory Dwelling Units (ADUs) in residential zones</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about the platform and building codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>How accurate are the code calculations?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Our code calculations are based on the most current City & County of Honolulu Land Use Ordinance and Building Code. The platform is regularly updated by licensed professionals to ensure accuracy, but always verify critical information with DPP as regulations may change.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger>Can I generate sheets for different counties in Hawaii?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Currently, the platform focuses on the City & County of Honolulu requirements. Support for Maui, Kauai, and Hawaii County is planned for future releases.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3">
                    <AccordionTrigger>Will DPP accept these generated code sheets?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Yes, the generated sheets follow the format expected by DPP and include all required information for permit submission. However, the architect or engineer must still review, sign, and stamp the documents before submission.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-4">
                    <AccordionTrigger>How do I update my project if codes change?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        When building codes or zoning regulations are updated, you'll receive a notification. You can then access your existing projects and regenerate the code sheets with the updated requirements. The platform maintains version history so you can reference previous calculations.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-5">
                    <AccordionTrigger>Can I customize the generated PDF?</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Yes, professional and team plan subscribers can add their firm logo, customize header information, and adjust the layout of generated PDFs. This customization is available in the profile settings area under "Firm Branding."
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Get help from our team of building code experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-sm text-muted-foreground">response within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">available M-F, 9am-5pm HST</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium mb-3">Send us a message</h3>
                    <div className="space-y-3">
                      <Input placeholder="Subject" />
                      <textarea 
                        className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe your issue or question..."
                      ></textarea>
                      <Button className="w-full">Send Message</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Help;
