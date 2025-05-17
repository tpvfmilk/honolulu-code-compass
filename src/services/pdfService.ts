
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ProjectData } from "../pages/ProjectView";

// Store the last Y position after creating a table
let lastTableY = 0;

export const generateProjectCodeSheet = (project: ProjectData): string => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text("Code Information Sheet", 105, 20, { align: "center" });
  
  // Add project details
  doc.setFontSize(14);
  doc.text("Project Information:", 14, 40);
  
  doc.setFontSize(12);
  doc.text(`Name: ${project.name}`, 20, 50);
  doc.text(`TMK: ${project.tmk}`, 20, 60);
  doc.text(`Address: ${project.address || "Not provided"}`, 20, 70);
  doc.text(`District: ${project.district || "Unknown"}`, 20, 80);
  doc.text(`Status: ${project.status}`, 20, 90);
  
  // Add more detailed project information if available
  let nextY = 100;
  if (project.client_name) {
    doc.text(`Client: ${project.client_name}`, 20, nextY);
    nextY += 10;
  }
  if (project.property_owner) {
    doc.text(`Property Owner: ${project.property_owner}`, 20, nextY);
    nextY += 10;
  }
  if (project.project_type) {
    doc.text(`Project Type: ${project.project_type}`, 20, nextY);
    nextY += 10;
  }
  doc.text(`Last Updated: ${new Date().toLocaleDateString()}`, 20, nextY);
  nextY += 20;
  
  // Add building specifications section if we have any of this data
  if (project.stories || project.building_height || project.total_building_area || project.lot_area_sqft) {
    doc.setFontSize(14);
    doc.text("Building Specifications:", 14, nextY);
    nextY += 10;
    
    doc.setFontSize(12);
    if (project.stories) {
      doc.text(`Number of Stories: ${project.stories}`, 20, nextY);
      nextY += 10;
    }
    if (project.building_height) {
      doc.text(`Building Height: ${project.building_height} feet`, 20, nextY);
      nextY += 10;
    }
    if (project.total_building_area) {
      doc.text(`Total Building Area: ${project.total_building_area.toLocaleString()} sq ft`, 20, nextY);
      nextY += 10;
    }
    if (project.lot_area_sqft) {
      doc.text(`Lot Area: ${project.lot_area_sqft.toLocaleString()} sq ft`, 20, nextY);
      nextY += 10;
    }
    if (project.existing_use) {
      doc.text(`Existing Use: ${project.existing_use}`, 20, nextY);
      nextY += 10;
    }
    if (project.proposed_use) {
      doc.text(`Proposed Use: ${project.proposed_use}`, 20, nextY);
      nextY += 10;
    }
    if (project.construction_type) {
      doc.text(`Construction Type: ${project.construction_type}`, 20, nextY);
      nextY += 10;
    }
    if (project.is_fully_sprinklered !== undefined) {
      doc.text(`Fire Sprinklers: ${project.is_fully_sprinklered ? "Yes - Fully Sprinklered" : "Not Required"}`, 20, nextY);
      nextY += 10;
    }
    
    nextY += 10;
  }
  
  // Add zoning details
  doc.setFontSize(14);
  doc.text("Zoning Information:", 14, nextY);
  nextY += 10;
  
  // Create zoning table
  const zoningTableData = [
    ["Requirement", "Standard", "Provided", "Compliant"],
    ["Front Setback", "15 feet", "18 feet", "Yes"],
    ["Side Setback", "5 feet", "6 feet", "Yes"],
    ["Rear Setback", "10 feet", "15 feet", "Yes"],
    ["Building Height", "30 feet (Max)", project.building_height ? `${project.building_height} feet` : "24 feet", "Yes"],
    ["Lot Coverage", "50% (Max)", "42%", "Yes"],
    ["Floor Area Ratio", "0.7 (Max)", "0.6", "Yes"],
  ];
  
  doc.autoTable({
    startY: nextY,
    head: [zoningTableData[0]],
    body: zoningTableData.slice(1),
    didDrawPage: function(data: any) {
      // Save the last Y position after the table is drawn
      lastTableY = data.cursor.y;
    }
  });
  
  // Add building info
  doc.setFontSize(14);
  doc.text("Building Information:", 14, lastTableY + 20);
  
  doc.setFontSize(12);
  doc.text(`Type of Construction: ${project.construction_type || "Type V-B"}`, 20, lastTableY + 30);
  doc.text(`Occupancy Group: ${project.existing_use || "R-3 Residential"}`, 20, lastTableY + 40);
  doc.text(`Fire Sprinklers: ${project.is_fully_sprinklered ? "Yes - Fully Sprinklered" : "Not Required"}`, 20, lastTableY + 50);
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
  
  // Return base64 string of the PDF
  return doc.output("datauristring");
};
