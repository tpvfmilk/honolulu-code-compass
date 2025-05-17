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
  
  // Added fields for project info step
  client_name?: string;
  property_owner?: string;
  project_type?: string;
  county?: string;
  lava_zone?: string;
  seismic_zone?: string;
  flood_zone?: string;
  historic_status?: boolean;
  historic_review_type?: string;
  year_of_construction?: number;
  original_building_code?: string;
  alteration_level?: string;
  work_area_percentage?: number;
  compliance_method?: string;
  
  // Added fields for zoning step
  existing_use?: string;
  proposed_use?: string;
  standard_stalls_required?: number;
  standard_stalls_provided?: number;
  ada_stalls_required?: number;
  ada_stalls_provided?: number;
  loading_spaces_required?: number;
  loading_spaces_provided?: number;
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
  },
  // Initialize new fields
  client_name: "",
  property_owner: "",
  project_type: "New Construction",
  county: "",
  lava_zone: "",
  seismic_zone: "",
  flood_zone: "",
  historic_status: false,
  historic_review_type: "",
  year_of_construction: undefined,
  original_building_code: "",
  alteration_level: "",
  work_area_percentage: undefined,
  compliance_method: "",
  existing_use: "",
  proposed_use: "",
  standard_stalls_required: undefined,
  standard_stalls_provided: undefined,
  ada_stalls_required: undefined,
  ada_stalls_provided: undefined,
  loading_spaces_required: undefined,
  loading_spaces_provided: undefined
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
