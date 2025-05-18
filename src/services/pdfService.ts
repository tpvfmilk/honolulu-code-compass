
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ProjectData } from "../pages/ProjectView";

// Helper function to format dates
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Function to generate a PDF for a project
export const generateProjectPDF = (project: ProjectData) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add company logo/header
  doc.setFontSize(24);
  doc.setTextColor(41, 128, 185); // Blue color
  doc.text("Hawaii Code Analysis", 20, 20);
  
  // Add project title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(`Project: ${project.name}`, 20, 35);
  
  // Add generated date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const today = new Date();
  doc.text(`Generated: ${formatDate(today)}`, 20, 42);
  
  // Add TMK
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`TMK: ${project.tmk || "Not provided"}`, 20, 52);
  doc.text(`Address: ${project.address || "Not provided"}`, 20, 60);
  
  // Project info table
  const projectInfoData = [
    ["Project Type", project.project_type || "New Construction"],
    ["Client", project.client_name || "Not provided"],
    ["Property Owner", project.property_owner || "Not provided"],
    ["County", project.county || "Not specified"],
    ["Zoning District", project.district]
  ];
  
  // @ts-ignore - jsPDF-AutoTable types are not fully compatible
  doc.autoTable({
    startY: 70,
    head: [['Property', 'Value']],
    body: projectInfoData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Get last table end position
  // @ts-ignore - jsPDF-AutoTable types are not fully compatible
  const lastTableY = (doc as any).lastAutoTable.finalY;
  
  // Add zoning summary table
  const zoningData = [
    ["Lot Area", project.lot_area_sqft ? `${project.lot_area_sqft.toLocaleString()} sq ft` : "Not provided"],
    ["Stories", project.stories || "Not provided"],
    ["Building Height", project.building_height ? `${project.building_height} feet` : "Not provided"],
    ["Existing Use", project.existing_use || "Not provided"],
    ["Proposed Use", project.proposed_use || "Not provided"]
  ];
  
  // @ts-ignore - jsPDF-AutoTable types are not fully compatible
  doc.autoTable({
    startY: lastTableY + 15,
    head: [['Zoning Info', 'Value']],
    body: zoningData,
    theme: 'striped',
    headStyles: { fillColor: [46, 204, 113] }
  });
  
  // Get last table end position for next table
  // @ts-ignore - jsPDF-AutoTable types are not fully compatible
  const zoningTableY = (doc as any).lastAutoTable.finalY;
  
  // Add parking table
  const parkingData = [
    ["Standard Stalls Required", project.standard_stalls_required || "0"],
    ["Standard Stalls Provided", project.standard_stalls_provided || "0"],
    ["ADA Stalls Required", project.ada_stalls_required || "0"],
    ["ADA Stalls Provided", project.ada_stalls_provided || "0"],
    ["Loading Spaces Required", project.loading_spaces_required || "0"],
    ["Loading Spaces Provided", project.loading_spaces_provided || "0"]
  ];
  
  // @ts-ignore - jsPDF-AutoTable types are not fully compatible
  doc.autoTable({
    startY: zoningTableY + 15,
    head: [['Parking Requirements', 'Value']],
    body: parkingData,
    theme: 'striped',
    headStyles: { fillColor: [155, 89, 182] }
  });
  
  // Construction type section
  doc.setFontSize(14);
  doc.text("Building Code Information", 20, lastTableY + 30);
  doc.setFontSize(12);
  doc.text(`Construction Type: ${project.construction_type || "Not specified"}`, 20, lastTableY + 40);
  doc.text(`Fire Sprinklers: ${project.is_fully_sprinklered ? "Yes - Fully Sprinklered" : "Not Required"}`, 20, lastTableY + 50);
  
  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Hawaii Building Code Analysis - Page ${i} of ${pageCount}`, 
      doc.internal.pageSize.getWidth() / 2, 
      doc.internal.pageSize.getHeight() - 10, 
      { align: "center" }
    );
  }
  
  return doc;
};

// Alias for generateProjectPDF to maintain compatibility with any code that might be using this name
export const generateProjectCodeSheet = generateProjectPDF;
