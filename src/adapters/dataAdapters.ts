
import { ZoningDistrictData, ProjectData } from "@/services/dataService";

// Convert ZoningDistrictData to the format expected by the ZoningSelector component
export function adaptZoningDistrictsForSelector(districts: ZoningDistrictData[]) {
  return districts.map(district => ({
    value: district.code,
    label: `${district.code} - ${district.name}`,
    group: getZoningGroupName(district.code)
  }));
}

// Helper function to determine the group name based on district code
function getZoningGroupName(code: string): string {
  // Extract the first letter or first two letters before the dash
  const prefix = code.split('-')[0];
  
  const groupMap: Record<string, string> = {
    'R': 'Residential Districts',
    'A': 'Apartment Districts',
    'B': 'Business Districts',
    'BMX': 'Business Mixed Use Districts',
    'I': 'Industrial Districts',
    'P': 'Preservation Districts',
    'AMX': 'Apartment Mixed Use Districts'
  };
  
  return groupMap[prefix] || 'Other Districts';
}

// Ensure ProjectData has the updated_at field for the Index component
export type ExtendedProjectData = ProjectData & {
  updated_at: string;
};
