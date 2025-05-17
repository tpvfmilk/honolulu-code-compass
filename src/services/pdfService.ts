
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { ProjectData } from "../pages/ProjectView";

// Extend the jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    internal: {
      pageSize: {
        width: number;
        height: number;
      };
      getNumberOfPages: () => number;
    };
  }
}

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
  doc.text(`District: ${project.district || "Unknown"}`, 20, 80); // Added fallback for district
  doc.text(`Status: ${project.status}`, 20, 90);
  doc.text(`Last Updated: ${project.lastUpdated.toLocaleDateString()}`, 20, 100);
  
  // Add zoning details
  doc.setFontSize(14);
  doc.text("Zoning Information:", 14, 120);
  
  // Create zoning table
  doc.autoTable({
    startY: 130,
    head: [["Requirement", "Standard", "Provided", "Compliant"]],
    body: [
      ["Front Setback", "15 feet", "18 feet", "Yes"],
      ["Side Setback", "5 feet", "6 feet", "Yes"],
      ["Rear Setback", "10 feet", "15 feet", "Yes"],
      ["Building Height", "30 feet (Max)", "24 feet", "Yes"],
      ["Lot Coverage", "50% (Max)", "42%", "Yes"],
      ["Floor Area Ratio", "0.7 (Max)", "0.6", "Yes"],
    ],
    didDrawPage: function(data: any) {
      // Save the last Y position after the table is drawn
      lastTableY = data.cursor.y;
    }
  });
  
  // Add building info
  doc.setFontSize(14);
  doc.text("Building Information:", 14, lastTableY + 20);
  
  doc.setFontSize(12);
  doc.text("Type of Construction: Type V-B", 20, lastTableY + 30);
  doc.text("Occupancy Group: R-3 Residential", 20, lastTableY + 40);
  doc.text("Fire Sprinklers: Not Required", 20, lastTableY + 50);
  
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
