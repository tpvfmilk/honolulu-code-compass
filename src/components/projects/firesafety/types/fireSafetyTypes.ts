
import { FormData } from "../../types";
import { OccupancyGroup } from "../../types/building/buildingClassificationTypes";

export interface FireSafetyCalculationsProps {
  occupancyGroup: OccupancyGroup | "";
  fireSafety: {
    separationDistance: string;
    hasMixedOccupancy: boolean;
    occupancySeparationType: string;
    secondaryOccupancies: any[];
    fireAlarmRequired: boolean;
    fireAlarmType: string;
    standpipeRequired: boolean;
    emergencyPower: boolean;
  };
  sprinklerSystem: boolean;
  stories: string;
  highRise?: boolean;
}

// Type guard to check if input is FormData
export function isFormData(input: FormData | FireSafetyCalculationsProps): input is FormData {
  return 'name' in input && 'tmk' in input;
}

// Helper to safely extract properties regardless of input type
export function getProperty<K extends keyof FireSafetyCalculationsProps>(
  input: FormData | FireSafetyCalculationsProps,
  property: K
): FireSafetyCalculationsProps[K] {
  if (isFormData(input)) {
    if (property === 'occupancyGroup') return input.occupancyGroup as FireSafetyCalculationsProps['occupancyGroup'];
    if (property === 'sprinklerSystem') return input.sprinklerSystem as FireSafetyCalculationsProps['sprinklerSystem'];
    if (property === 'stories') return input.stories as FireSafetyCalculationsProps['stories'];
    if (property === 'fireSafety') return input.fireSafety as FireSafetyCalculationsProps['fireSafety'];
    if (property === 'highRise') return input.highRise as FireSafetyCalculationsProps['highRise'];
  }
  return input[property];
}
