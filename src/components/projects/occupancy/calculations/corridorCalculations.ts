
// Calculate corridor requirements
export const calculateCorridorRequirements = (occupantLoad: number, primaryOccupancy: string) => {
  // Base corridor width by occupancy
  let baseWidth = 44; // inches (standard)
  let fireRating = 0;
  let reasoning = "Standard corridor requirements apply";
  
  // Institutional and high-occupancy assembly get wider corridors
  if (primaryOccupancy.startsWith('I')) {
    baseWidth = 96; // 8 feet for institutional
    reasoning = "Institutional occupancies require 8' minimum corridor width";
    fireRating = 1;
  } else if (primaryOccupancy.startsWith('A') && occupantLoad > 300) {
    baseWidth = 72; // 6 feet for high-occupancy assembly
    reasoning = "Assembly occupancies with >300 occupant load require wider corridors";
    fireRating = 1;
  }
  
  // Increase width for large occupant loads
  const loadBasedWidth = occupantLoad * 0.2;
  const minWidth = Math.max(baseWidth, loadBasedWidth);
  
  return {
    minWidth: Math.ceil(minWidth),
    fireRating,
    reasoning
  };
};
