
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Printer, RotateCcw, Share2 } from "lucide-react";
import { useParams } from "react-router-dom";

const CodeSheetPreview = ({ onLogout }: { onLogout: () => void }) => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <AppLayout onLogout={onLogout}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Code Sheet Preview</h1>
            <p className="text-muted-foreground">Project: Kailua Beach House (ID: {id})</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" /> Revisions
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-[400px] grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="mt-6">
            <div className="flex justify-center">
              <Card className="w-[8.5in] min-h-[11in] p-8 shadow-lg bg-white">
                {/* Code Sheet Header */}
                <div className="border-b border-gray-900 pb-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">BUILDING CODE INFORMATION SHEET</h1>
                      <p className="text-sm">City & County of Honolulu Department of Planning & Permitting</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">John Architect, AIA</p>
                      <p className="text-sm">License: HAR-12345</p>
                      <p className="text-sm">808-555-1234</p>
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3">PROJECT INFORMATION</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Project Name:</p>
                      <p>Kailua Beach House</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">TMK:</p>
                      <p>(1) 4-2-002:001</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Zoning District:</p>
                      <p>R-5 Residential</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Lot Area:</p>
                      <p>7,500 sq ft</p>
                    </div>
                  </div>
                </div>

                {/* Zoning Requirements */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3">ZONING REQUIREMENTS</h2>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 w-1/3">Requirement</th>
                        <th className="text-left p-2 w-1/3">Code</th>
                        <th className="text-left p-2 w-1/3">Provided</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Minimum Lot Area</td>
                        <td className="p-2">5,000 sq ft</td>
                        <td className="p-2">7,500 sq ft ✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Maximum Height</td>
                        <td className="p-2">25 feet</td>
                        <td className="p-2">22 feet ✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Front Setback</td>
                        <td className="p-2">10 feet</td>
                        <td className="p-2">15 feet ✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Side Setback</td>
                        <td className="p-2">5 feet</td>
                        <td className="p-2">5 feet ✓</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Rear Setback</td>
                        <td className="p-2">5 feet</td>
                        <td className="p-2">10 feet ✓</td>
                      </tr>
                      <tr>
                        <td className="p-2">Maximum Building Area</td>
                        <td className="p-2">3,750 sq ft (50%)</td>
                        <td className="p-2">3,200 sq ft ✓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Building Code Requirements */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3">BUILDING CODE REQUIREMENTS</h2>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Requirement</th>
                        <th className="text-left p-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Construction Type</td>
                        <td className="p-2">Type V-B</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Occupancy Classification</td>
                        <td className="p-2">R-3 Residential</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Number of Stories</td>
                        <td className="p-2">2</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Building Height</td>
                        <td className="p-2">22 feet</td>
                      </tr>
                      <tr>
                        <td className="p-2">Fire Sprinklers Required</td>
                        <td className="p-2">No</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer with certification */}
                <div className="mt-12 pt-6 border-t">
                  <p className="mb-8">I certify that the information provided above is accurate and the proposed project complies with all applicable building codes and zoning regulations.</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="border-b border-black w-48 mb-1"></div>
                      <p className="text-sm">Architect's Signature & Stamp</p>
                    </div>
                    <div>
                      <div className="border-b border-black w-48 mb-1"></div>
                      <p className="text-sm">Date</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Source Data</h2>
              <p className="text-muted-foreground mb-4">
                This interface will allow viewing and editing the data used to generate this code sheet.
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Document Settings</h2>
              <p className="text-muted-foreground mb-4">
                This interface will allow configuring document generation settings, branding, etc.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CodeSheetPreview;
