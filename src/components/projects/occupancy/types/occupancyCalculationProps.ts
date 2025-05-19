
import { TravelDistances } from './occupancyTypes';

export interface OccupancyCalculationsProps {
  occupancyDetails: {
    spaces: any[];
    travelDistances: TravelDistances;
    numberOfEmployees: string;
    isPublicAccommodation: boolean;
    elevatorProvided: boolean;
    totalParkingSpaces: string;
  };
  occupancyGroup: string;
  sprinklerSystem: boolean;
  stories: string;
  totalBuildingArea: string;
}
