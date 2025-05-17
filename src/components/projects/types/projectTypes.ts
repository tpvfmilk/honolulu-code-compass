
import { ZoningCalculationsState } from './zoning/zoningTypes';
import { OccupancyDetails } from './occupancy/occupancyTypes';
import { FireSafetyData, SecondaryOccupancy } from './building/buildingTypes';
import { ConstructionType, OccupancyGroup, SprinklerType, MixedOccupancyType } from './building/buildingClassificationTypes';

export type FormData = {
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
  // Building classification fields
  constructionType: ConstructionType | "";
  occupancyGroup: OccupancyGroup | "";
  mixedOccupancyType: MixedOccupancyType;
  secondaryOccupancies: SecondaryOccupancy[];
  groundFloorArea: string;
  totalBuildingArea: string;
  sprinklerSystem: boolean;
  sprinklerType: SprinklerType;
  fireAlarm: boolean;
  standpipe: boolean;
  highRise: boolean;
  unlimitedArea: boolean;
  // Fire Safety Fields
  fireSafety: FireSafetyData;
  // Occupancy Details
  occupancyDetails: OccupancyDetails;
};

export const initialFormData: FormData = {
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
  // Initialize building classification fields
  constructionType: "",
  occupancyGroup: "",
  mixedOccupancyType: "None",
  secondaryOccupancies: [],
  groundFloorArea: "",
  totalBuildingArea: "",
  sprinklerSystem: false,
  sprinklerType: "",
  fireAlarm: false,
  standpipe: false,
  highRise: false,
  unlimitedArea: false,
  // Initialize Fire Safety Fields
  fireSafety: {
    separationDistance: "10",
    hasMixedOccupancy: false,
    occupancySeparationType: '',
    secondaryOccupancies: [],
    fireAlarmRequired: false,
    fireAlarmType: "",
    standpipeRequired: false,
    emergencyPower: false
  },
  // Initialize occupancyDetails
  occupancyDetails: {
    spaces: [],
    travelDistances: {
      maxExitAccess: "",
      commonPath: "",
      deadEnd: "",
      roomTravel: ""
    },
    numberOfEmployees: "",
    isPublicAccommodation: false,
    elevatorProvided: false,
    totalParkingSpaces: ""
  }
};

export type WizardStep = {
  id: string;
  label: string;
};

export const wizardSteps: WizardStep[] = [
  { id: "project", label: "Project Info" },
  { id: "zoning", label: "Zoning Info" },
  { id: "building", label: "Building Classification" },
  { id: "fire", label: "Fire Safety" },
  { id: "occupancy", label: "Occupancy Details" },
  { id: "review", label: "Review" },
];
