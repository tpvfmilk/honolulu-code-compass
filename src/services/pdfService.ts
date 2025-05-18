
import * as XLSX from 'xlsx';
import { ProjectData } from "../pages/ProjectView";

// Helper function to format dates
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Function to generate an Excel file for a project
export const generateProjectExcel = (project: ProjectData): string => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create Project Info worksheet
  const projectInfoData = [
    ["Project Name", project.name || ""],
    ["TMK", project.tmk || "Not provided"],
    ["Address", project.address || "Not provided"],
    ["Project Type", project.project_type || "New Construction"],
    ["Client", project.client_name || "Not provided"],
    ["Property Owner", project.property_owner || "Not provided"],
    ["County", project.county || "Not specified"],
    ["Zoning District", project.district || ""]
  ];
  
  const wsProjectInfo = XLSX.utils.aoa_to_sheet([["Property", "Value"], ...projectInfoData]);
  XLSX.utils.book_append_sheet(wb, wsProjectInfo, "Project Info");
  
  // Create Zoning Data worksheet
  const zoningData = [
    ["Lot Area", project.lot_area_sqft ? `${project.lot_area_sqft.toLocaleString()} sq ft` : "Not provided"],
    ["Stories", project.stories || "Not provided"],
    ["Building Height", project.building_height ? `${project.building_height} feet` : "Not provided"],
    ["Existing Use", project.existing_use || "Not provided"],
    ["Proposed Use", project.proposed_use || "Not provided"]
  ];
  
  const wsZoning = XLSX.utils.aoa_to_sheet([["Zoning Info", "Value"], ...zoningData]);
  XLSX.utils.book_append_sheet(wb, wsZoning, "Zoning Data");
  
  // Create Parking Data worksheet
  const parkingData = [
    ["Standard Stalls Required", project.standard_stalls_required || "0"],
    ["Standard Stalls Provided", project.standard_stalls_provided || "0"],
    ["ADA Stalls Required", project.ada_stalls_required || "0"],
    ["ADA Stalls Provided", project.ada_stalls_provided || "0"],
    ["Loading Spaces Required", project.loading_spaces_required || "0"],
    ["Loading Spaces Provided", project.loading_spaces_provided || "0"]
  ];
  
  const wsParking = XLSX.utils.aoa_to_sheet([["Parking Requirements", "Value"], ...parkingData]);
  XLSX.utils.book_append_sheet(wb, wsParking, "Parking Data");
  
  // Create Construction Type worksheet
  const constructionData = [
    ["Construction Type", project.construction_type || "Not specified"],
    ["Fire Sprinklers", project.is_fully_sprinklered ? "Yes - Fully Sprinklered" : "Not Required"],
    ["Date Generated", formatDate(new Date())]
  ];
  
  const wsConstruction = XLSX.utils.aoa_to_sheet([["Building Code Info", "Value"], ...constructionData]);
  XLSX.utils.book_append_sheet(wb, wsConstruction, "Construction Data");
  
  // Generate a data URL for the Excel file
  const excelBinary = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  const excelDataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelBinary}`;
  
  return excelDataUrl;
};

// Alias for generateProjectExcel to maintain compatibility with any code that might be using this name
export const generateProjectCodeSheet = generateProjectExcel;

