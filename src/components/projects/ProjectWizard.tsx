
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FormData = {
  name: string;
  tmk: string;
  address: string;
  district: string;
  lotArea: string;
  buildingType: string;
  stories: string;
  height: string;
};

const initialFormData: FormData = {
  name: "",
  tmk: "",
  address: "",
  district: "",
  lotArea: "",
  buildingType: "",
  stories: "",
  height: "",
};

const zoningDistricts = [
  "R-3.5 Residential",
  "R-5 Residential",
  "R-7.5 Residential",
  "R-10 Residential",
  "R-20 Residential",
  "A-1 Apartment",
  "A-2 Apartment",
  "AMX-1 Apartment Mixed Use",
  "AMX-2 Apartment Mixed Use",
  "AMX-3 Apartment Mixed Use",
  "BMX-3 Business Mixed Use",
  "BMX-4 Business Mixed Use",
  "Resort",
  "Industrial",
];

const buildingTypes = [
  "Single-Family Dwelling",
  "Two-Family Dwelling",
  "Multi-Family Dwelling",
  "Commercial",
  "Mixed-Use",
  "Industrial",
  "Accessory Dwelling Unit (ADU)",
  "Other",
];

export const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { id: "basics", label: "Basic Info" },
    { id: "zoning", label: "Zoning Info" },
    { id: "building", label: "Building Info" },
    { id: "review", label: "Review" },
  ];

  const updateFormData = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Project Created",
        description: "Your project has been created successfully",
      });
      navigate("/");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Project</CardTitle>
          <CardDescription>
            Fill out the project information to generate a building code compliance sheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              {steps.map((step, i) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / steps.length}%` }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      i <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-xs text-center ${
                      i <= currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-[2px] w-full ${
                        i < currentStep ? "bg-primary" : "bg-secondary"
                      }`}
                      style={{
                        position: "absolute",
                        left: `calc(${(i + 0.5) * (100 / steps.length)}%)`,
                        width: `${100 / steps.length}%`,
                        top: "1rem",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <form onSubmit={handleSubmit}>
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tmk">TMK Number</Label>
                  <Input
                    id="tmk"
                    placeholder="Format: (X) X-X-XXX:XXX"
                    value={formData.tmk}
                    onChange={(e) => updateFormData("tmk", e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Tax Map Key (TMK) is a unique identifier for your property
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Property Address (Optional)</Label>
                  <Input
                    id="address"
                    placeholder="Enter property address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="district">Zoning District</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => updateFormData("district", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select zoning district" />
                    </SelectTrigger>
                    <SelectContent>
                      {zoningDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lotArea">Lot Area (sq ft)</Label>
                  <Input
                    id="lotArea"
                    type="number"
                    placeholder="Enter lot area in square feet"
                    value={formData.lotArea}
                    onChange={(e) => updateFormData("lotArea", e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingType">Building Type</Label>
                  <Select
                    value={formData.buildingType}
                    onValueChange={(value) => updateFormData("buildingType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select building type" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stories">Number of Stories</Label>
                  <Input
                    id="stories"
                    type="number"
                    placeholder="Enter number of stories"
                    value={formData.stories}
                    onChange={(e) => updateFormData("stories", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Building Height (feet)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter building height in feet"
                    value={formData.height}
                    onChange={(e) => updateFormData("height", e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium text-lg mb-4">Project Summary</h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Project Name</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">TMK Number</p>
                      <p className="font-medium">{formData.tmk}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{formData.address || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Zoning District</p>
                      <p className="font-medium">{formData.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lot Area</p>
                      <p className="font-medium">{formData.lotArea} sq ft</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Building Type</p>
                      <p className="font-medium">{formData.buildingType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Number of Stories</p>
                      <p className="font-medium">{formData.stories}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Building Height</p>
                      <p className="font-medium">{formData.height} feet</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary p-4 rounded-md">
                  <h3 className="font-medium mb-2">Preliminary Compliance Check</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                      <span>Height limit compliant (30' max in {formData.district})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                      <span>Setback requirements met</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
                      <span>FAR (Floor Area Ratio) compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="hawaii-gradient"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
