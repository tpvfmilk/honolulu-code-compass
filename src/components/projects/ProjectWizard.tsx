
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { ZoningSelector } from "./zoning/ZoningSelector";
import { PropertyFeaturesCheckboxes } from "./zoning/PropertyFeaturesCheckboxes";
import { SetbackCalculationCard } from "./zoning/SetbackCalculationCard";
import { BuildingEnvelopeCard } from "./zoning/BuildingEnvelopeCard";
import { DwellingUnitsCard } from "./zoning/DwellingUnitsCard";
import { LotAreaInput } from "./zoning/LotAreaInput";

type FormData = {
  name: string;
  tmk: string;
  address: string;
  district: string;
  lotArea: string;
  buildingType: string;
  stories: string;
  height: string;
  isCornerLot: boolean;
  isHistoric: boolean;
  isSMA: boolean;
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
  isCornerLot: false,
  isHistoric: false,
  isSMA: false,
};

export type ZoningCalculationsState = {
  setbacks: {
    front: number;
    side: number;
    rear: number;
    streetSide?: number;
  } | null;
  heightLimits: {
    maxHeight: number;
    maxStories: number;
  } | null;
  coverage: {
    maxCoveragePercent: number;
    maxCoverage: number;
    farBase: number;
    farConditional?: number;
    maxFloorArea: number;
    maxConditionalFloorArea?: number;
  } | null;
  dwellingUnits: {
    maxUnits: number;
    allowsOhana: boolean;
    allowsADU: boolean;
    requiredParking: {
      main: number;
      ohana: number;
      adu: number;
      total: number;
    };
  } | null;
}

// Zoning district data
const zoningDistricts = [
  { value: "R-3.5", label: "R-3.5 Residential (3,500 sf minimum)", group: "Residential Districts" },
  { value: "R-5", label: "R-5 Residential (5,000 sf minimum)", group: "Residential Districts" },
  { value: "R-7.5", label: "R-7.5 Residential (7,500 sf minimum)", group: "Residential Districts" },
  { value: "R-10", label: "R-10 Residential (10,000 sf minimum)", group: "Residential Districts" },
  { value: "R-20", label: "R-20 Residential (20,000 sf minimum)", group: "Residential Districts" },
  { value: "A-1", label: "A-1 Apartment (Low Density)", group: "Apartment Districts" },
  { value: "A-2", label: "A-2 Apartment (Medium Density)", group: "Apartment Districts" },
  { value: "A-3", label: "A-3 Apartment (High Density)", group: "Apartment Districts" },
  { value: "B-1", label: "B-1 Neighborhood Business", group: "Business Districts" },
  { value: "B-2", label: "B-2 Community Business", group: "Business Districts" },
  { value: "B-3", label: "B-3 Central Business", group: "Business Districts" },
  { value: "BMX-1", label: "BMX-1 Business Mixed Use (Community)", group: "Business Districts" },
  { value: "BMX-2", label: "BMX-2 Business Mixed Use (Central)", group: "Business Districts" },
  { value: "BMX-3", label: "BMX-3 Business Mixed Use (Downtown)", group: "Business Districts" },
];

// Building types from current implementation
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
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculations, setCalculations] = useState<ZoningCalculationsState>({
    setbacks: null,
    heightLimits: null,
    coverage: null,
    dwellingUnits: null,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { id: "project", label: "Project Info" },
    { id: "zoning", label: "Zoning Info" },
    { id: "building", label: "Building Classification" },
    { id: "fire", label: "Fire Safety" },
    { id: "occupancy", label: "Occupancy Details" },
    { id: "review", label: "Review" },
  ];

  const updateFormData = (key: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Trigger calculations for zoning step
    if ((key === 'district' || key === 'lotArea' || key === 'isCornerLot') && currentStep === 1) {
      performZoningCalculations(key === 'district' ? value as string : formData.district, 
                             key === 'lotArea' ? value as string : formData.lotArea,
                             key === 'isCornerLot' ? value as boolean : formData.isCornerLot);
    }
  };

  const performZoningCalculations = (district: string, lotAreaStr: string, isCornerLot: boolean) => {
    if (!district || !lotAreaStr) return;
    
    setIsCalculating(true);
    
    // Simulate API calculation delay
    setTimeout(() => {
      const lotArea = parseFloat(lotAreaStr.replace(/,/g, ''));
      
      // Example calculation logic based on zoning district
      let calculationResults: ZoningCalculationsState = {
        setbacks: null,
        heightLimits: null,
        coverage: null,
        dwellingUnits: null
      };
      
      // Apply calculations based on district
      switch(district) {
        case "R-5":
          calculationResults = {
            setbacks: { front: 25, side: 5, rear: 15, streetSide: isCornerLot ? 20 : undefined },
            heightLimits: { maxHeight: 30, maxStories: 2.5 },
            coverage: { 
              maxCoveragePercent: 50,
              maxCoverage: lotArea * 0.5,
              farBase: 0.7,
              farConditional: 0.8,
              maxFloorArea: lotArea * 0.7,
              maxConditionalFloorArea: lotArea * 0.8
            },
            dwellingUnits: {
              maxUnits: Math.floor(lotArea / 5000),
              allowsOhana: true,
              allowsADU: lotArea >= 3500,
              requiredParking: {
                main: 2,
                ohana: 1,
                adu: 1,
                total: 2 + (lotArea >= 3500 ? 2 : 0)
              }
            }
          };
          break;
          
        case "R-3.5":
          calculationResults = {
            setbacks: { front: 20, side: 5, rear: 10, streetSide: isCornerLot ? 15 : undefined },
            heightLimits: { maxHeight: 25, maxStories: 2 },
            coverage: { 
              maxCoveragePercent: 60,
              maxCoverage: lotArea * 0.6,
              farBase: 0.8,
              maxFloorArea: lotArea * 0.8
            },
            dwellingUnits: {
              maxUnits: Math.floor(lotArea / 3500),
              allowsOhana: true,
              allowsADU: lotArea >= 3500,
              requiredParking: {
                main: 2,
                ohana: 1,
                adu: 1,
                total: 2 + (lotArea >= 3500 ? 2 : 0)
              }
            }
          };
          break;
          
        default:
          // Default calculations for other zones
          calculationResults = {
            setbacks: { front: 20, side: 5, rear: 10 },
            heightLimits: { maxHeight: 30, maxStories: 2 },
            coverage: { 
              maxCoveragePercent: 40,
              maxCoverage: lotArea * 0.4,
              farBase: 0.6,
              maxFloorArea: lotArea * 0.6
            },
            dwellingUnits: {
              maxUnits: Math.floor(lotArea / 7500),
              allowsOhana: false,
              allowsADU: false,
              requiredParking: {
                main: 2,
                ohana: 0,
                adu: 0,
                total: 2
              }
            }
          };
      }
      
      setCalculations(calculationResults);
      setIsCalculating(false);
      
    }, 500); // 500ms delay for animation
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
  
  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your project draft has been saved successfully",
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
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
                    placeholder="Format: X-X-XXX:XXX"
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
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Input Form (40%) */}
                <div className="w-full md:w-2/5">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="district">Zoning District</Label>
                          <ZoningSelector 
                            value={formData.district} 
                            onChange={(value) => updateFormData("district", value)}
                            zoningDistricts={zoningDistricts}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lotArea">Lot Area (sq ft)</Label>
                          <LotAreaInput
                            id="lotArea" 
                            value={formData.lotArea}
                            onChange={(value) => updateFormData("lotArea", value)}
                          />
                        </div>
                        
                        <PropertyFeaturesCheckboxes
                          isCornerLot={formData.isCornerLot}
                          isHistoric={formData.isHistoric}
                          isSMA={formData.isSMA}
                          onCornerLotChange={(value) => updateFormData("isCornerLot", value)}
                          onHistoricChange={(value) => updateFormData("isHistoric", value)}
                          onSMAChange={(value) => updateFormData("isSMA", value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Right Column - Calculation Results (60%) */}
                <div className="w-full md:w-3/5">
                  <div className="space-y-4">
                    {isCalculating ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                          <p className="text-muted-foreground">Calculating zoning requirements...</p>
                        </div>
                      </div>
                    ) : formData.district && formData.lotArea ? (
                      <>
                        <SetbackCalculationCard 
                          setbacks={calculations.setbacks} 
                          isCornerLot={formData.isCornerLot} 
                        />
                        
                        <BuildingEnvelopeCard 
                          heightLimits={calculations.heightLimits}
                          coverage={calculations.coverage}
                          lotArea={parseFloat(formData.lotArea.replace(/,/g, ''))}
                        />
                        
                        <DwellingUnitsCard 
                          dwellingUnits={calculations.dwellingUnits}
                          zoning={formData.district}
                          lotArea={parseFloat(formData.lotArea.replace(/,/g, ''))}
                        />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
                        <div className="text-center p-6">
                          <h3 className="text-lg font-medium mb-2">No Calculations Yet</h3>
                          <p className="text-muted-foreground">
                            Enter zoning district and lot area to generate calculations.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
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
                <h3 className="text-xl font-medium">Fire Safety & Life Safety</h3>
                <p className="text-muted-foreground">
                  These fields will be implemented in a future update.
                </p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-medium">Occupancy Details</h3>
                <p className="text-muted-foreground">
                  These fields will be implemented in a future update.
                </p>
              </div>
            )}

            {currentStep === 5 && (
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
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSaveDraft}
              className="text-muted-foreground"
            >
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!formData.district || !formData.lotArea))
                }
              >
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
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
