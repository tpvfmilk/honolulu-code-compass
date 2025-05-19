
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FireSeparationDistanceInput } from "../firesafety/FireSeparationDistanceInput";
import { MixedOccupancyConfiguration } from "../firesafety/MixedOccupancyConfiguration";
import { BuildingFireSystemsInput } from "../firesafety/BuildingFireSystemsInput";
import { ExteriorWallRatingCard } from "../firesafety/ExteriorWallRatingCard";
import { InteriorWallRatingsCard } from "../firesafety/InteriorWallRatingsCard";
import { ShaftEnclosuresCard } from "../firesafety/ShaftEnclosuresCard";
import { OpeningProtectivesCard } from "../firesafety/OpeningProtectivesCard";
import { FireDampersCard } from "../firesafety/FireDampersCard";
import { FormData } from "../types";
import { useFireSafetyCalculations } from "../firesafety/useFireSafetyCalculations";

interface FireSafetyStepProps {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
}

export const FireSafetyStep = ({ formData, updateFormData }: FireSafetyStepProps) => {
  const updateFireSafetyData = (key: keyof FormData["fireSafety"], value: any) => {
    updateFormData("fireSafety", { ...formData.fireSafety, [key]: value });
  };

  // Get all calculations from the custom hook
  const calculations = useFireSafetyCalculations(formData);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium">Fire Safety & Life Safety</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Input Forms (40% width) */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fire Separation Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <FireSeparationDistanceInput 
                value={formData.fireSafety.separationDistance}
                onChange={(value) => updateFireSafetyData("separationDistance", value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mixed Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <MixedOccupancyConfiguration
                hasMixedOccupancy={formData.fireSafety.hasMixedOccupancy}
                occupancySeparationType={formData.fireSafety.occupancySeparationType}
                secondaryOccupancies={formData.fireSafety.secondaryOccupancies}
                primaryOccupancy={formData.occupancyGroup}
                onHasMixedOccupancyChange={(value) => updateFireSafetyData("hasMixedOccupancy", value)}
                onOccupancySeparationTypeChange={(value) => updateFireSafetyData("occupancySeparationType", value)}
                onSecondaryOccupanciesChange={(value) => updateFireSafetyData("secondaryOccupancies", value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Building Systems</CardTitle>
            </CardHeader>
            <CardContent>
              <BuildingFireSystemsInput
                sprinklerSystem={formData.sprinklerSystem}
                sprinklerType={formData.sprinklerType}
                fireAlarmRequired={formData.fireSafety.fireAlarmRequired}
                fireAlarmType={formData.fireSafety.fireAlarmType}
                standpipeRequired={formData.fireSafety.standpipeRequired}
                emergencyPower={formData.fireSafety.emergencyPower}
                onFireAlarmRequiredChange={(value) => updateFireSafetyData("fireAlarmRequired", value)}
                onFireAlarmTypeChange={(value) => updateFireSafetyData("fireAlarmType", value)}
                onStandpipeRequiredChange={(value) => updateFireSafetyData("standpipeRequired", value)}
                onEmergencyPowerChange={(value) => updateFireSafetyData("emergencyPower", value)}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Calculation Results (60% width) */}
        <div className="lg:col-span-7 space-y-4">
          <ExteriorWallRatingCard 
            separationDistance={formData.fireSafety.separationDistance} 
            exteriorWallRating={calculations.exteriorWallRating} 
            sprinklered={formData.sprinklerSystem}
          />
          
          <InteriorWallRatingsCard 
            formData={formData}
            occupancySeparations={calculations.occupancySeparations}
            corridorRating={calculations.corridorRating}
          />
          
          <ShaftEnclosuresCard 
            constructionType={formData.constructionType} 
            stories={formData.stories}
            calculations={calculations.shaftRatings}
          />
          
          <OpeningProtectivesCard 
            wallRatings={calculations.openingProtectives.wallRatings}
          />
          
          <FireDampersCard 
            sprinklered={formData.sprinklerSystem}
            highRise={formData.highRise}
            occupancyGroup={formData.occupancyGroup}
            calculations={calculations.fireDampers}
          />
        </div>
      </div>
    </div>
  );
};
