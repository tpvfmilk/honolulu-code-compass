
import React, { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { SpaceBreakdownForm } from "../occupancy/SpaceBreakdownForm";
import { TravelDistanceInputs } from "../occupancy/TravelDistanceInputs";
import { AccessibilityInputs } from "../occupancy/AccessibilityInputs";
import { OccupantLoadCard } from "../occupancy/OccupantLoadCard";
import { ExitRequirementsCard } from "../occupancy/ExitRequirementsCard";
import { EgressComplianceCard } from "../occupancy/EgressComplianceCard";
import { CorridorRequirementsCard } from "../occupancy/CorridorRequirementsCard";
import { AccessibilityComplianceCard } from "../occupancy/AccessibilityComplianceCard";
import { FormData, Space } from "../types";
import { useOccupancyCalculations } from "../occupancy/useOccupancyCalculations";
import { TravelDistances } from "../occupancy/types/occupancyTypes";

export interface OccupancyDetailsStepProps {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
}

export const OccupancyDetailsStep = ({ formData, updateFormData }: OccupancyDetailsStepProps) => {
  // Get primary occupancy and sprinkler status
  const primaryOccupancy = formData.occupancyGroup || "";
  const isSprinklered = formData.sprinklerSystem || false;
  const isMultiStory = parseInt(formData.stories || '1') > 1;
  
  // Use calculation hook
  const { calculations, isCalculating } = useOccupancyCalculations(formData);
  
  // Initialize with one space if none exist
  useEffect(() => {
    if (!formData.occupancyDetails?.spaces?.length) {
      const initialSpace: Space = {
        id: uuidv4(),
        name: '',
        type: '',
        area: '',
        floorLevel: '1',
        notes: ''
      };
      
      const initialTravelDistances: TravelDistances = {
        maxExitAccess: '',
        commonPath: '',
        deadEnd: '',
        roomTravel: ''
      };
      
      updateFormData('occupancyDetails', {
        ...formData.occupancyDetails,
        spaces: [initialSpace],
        travelDistances: initialTravelDistances,
        numberOfEmployees: '',
        isPublicAccommodation: false,
        elevatorProvided: false,
        totalParkingSpaces: ''
      });
    }
  }, []);
  
  // Handle space updates
  const handleSpacesChange = (spaces: Space[]) => {
    updateFormData('occupancyDetails', {
      ...formData.occupancyDetails,
      spaces
    });
  };
  
  // Handle travel distance updates
  const handleTravelDistancesChange = (travelDistances: TravelDistances) => {
    updateFormData('occupancyDetails', {
      ...formData.occupancyDetails,
      travelDistances
    });
  };
  
  // Handle simple field updates
  const handleFieldChange = (field: string, value: string | boolean) => {
    updateFormData('occupancyDetails', {
      ...formData.occupancyDetails,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Occupancy Details & Life Safety</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (40%) - Input Forms */}
        <div className="col-span-1 md:col-span-5 space-y-6">
          {/* Space Breakdown Form */}
          <SpaceBreakdownForm
            spaces={formData.occupancyDetails?.spaces || []}
            primaryOccupancy={primaryOccupancy}
            onSpacesChange={handleSpacesChange}
          />
          
          {/* Travel Distance Inputs */}
          <TravelDistanceInputs
            travelDistances={formData.occupancyDetails?.travelDistances || {
              maxExitAccess: '',
              commonPath: '',
              deadEnd: '',
              roomTravel: ''
            }}
            primaryOccupancy={primaryOccupancy}
            isSprinklered={isSprinklered}
            onTravelDistancesChange={handleTravelDistancesChange}
          />
          
          {/* Accessibility Inputs */}
          <AccessibilityInputs
            numberOfEmployees={formData.occupancyDetails?.numberOfEmployees || ''}
            isPublicAccommodation={formData.occupancyDetails?.isPublicAccommodation || false}
            elevatorProvided={formData.occupancyDetails?.elevatorProvided || false}
            totalParkingSpaces={formData.occupancyDetails?.totalParkingSpaces || ''}
            isMultiStory={isMultiStory}
            onEmployeesChange={(value) => handleFieldChange('numberOfEmployees', value)}
            onPublicAccommodationChange={(value) => handleFieldChange('isPublicAccommodation', value)}
            onElevatorProvidedChange={(value) => handleFieldChange('elevatorProvided', value)}
            onTotalParkingSpacesChange={(value) => handleFieldChange('totalParkingSpaces', value)}
          />
        </div>
        
        {/* Right Column (60%) - Calculation Results */}
        <div className="col-span-1 md:col-span-7 space-y-4">
          {/* Occupant Load Card */}
          <OccupantLoadCard 
            occupantLoad={calculations?.occupantLoad || null}
            isCalculating={isCalculating}
          />
          
          {/* Exit Requirements Card */}
          <ExitRequirementsCard 
            exitRequirements={calculations?.exitRequirements || null}
            isCalculating={isCalculating}
          />
          
          {/* Egress Compliance Card */}
          <EgressComplianceCard 
            travelDistanceCompliance={calculations?.travelDistanceCompliance || null}
            travelDistances={formData.occupancyDetails?.travelDistances || {
              maxExitAccess: '',
              commonPath: '',
              deadEnd: '',
              roomTravel: ''
            }}
            isCalculating={isCalculating}
            isSprinklered={isSprinklered}
          />
          
          {/* Corridor Requirements Card */}
          <CorridorRequirementsCard 
            corridorRequirements={calculations?.corridorRequirements || null}
            isCalculating={isCalculating}
          />
          
          {/* Accessibility Compliance Card */}
          <AccessibilityComplianceCard 
            accessibilityRequirements={calculations?.accessibilityRequirements || null}
            elevatorProvided={formData.occupancyDetails?.elevatorProvided || false}
            isCalculating={isCalculating}
          />
        </div>
      </div>
    </div>
  );
};
