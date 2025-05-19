
import { TravelDistances } from './occupancyTypes';
import { OccupancyGroup } from '../../types/building/buildingClassificationTypes';

export interface OccupancyCalculationsProps {
  occupancyDetails: {
    spaces: any[];
    travelDistances: TravelDistances;
    numberOfEmployees: string;
    isPublicAccommodation: boolean;
    elevatorProvided: boolean;
    totalParkingSpaces: string;
  };
  occupancyGroup: OccupancyGroup | "";
  sprinklerSystem: boolean;
  stories: string;
  totalBuildingArea: string;
}
