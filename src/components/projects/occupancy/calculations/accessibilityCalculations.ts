
// Calculate accessibility requirements
export const calculateAccessibilityRequirements = (
  numberOfEmployees: string,
  isPublicAccommodation: boolean,
  elevatorProvided: boolean,
  stories: string,
  totalArea: string,
  totalParkingSpaces: string
) => {
  const employees = parseInt(numberOfEmployees) || 0;
  const multiStory = parseInt(stories) > 1;
  const buildingArea = parseFloat(totalArea) || 0;
  const parking = parseInt(totalParkingSpaces) || 0;
  
  // Determine if elevator is required
  const elevatorRequired = multiStory && (
    isPublicAccommodation || // Public buildings typically need elevators
    buildingArea > 3000 || // Larger buildings need elevators
    employees > 30 // Large employee count might trigger elevator requirements
  );
  
  // Calculate accessible parking
  const accessibleParking = Math.max(1, Math.ceil(parking * 0.02)); // Minimum 2%
  const vanAccessible = Math.ceil(accessibleParking / 6); // 1 van space per 6 accessible
  
  // Generate rationale
  const rationale: string[] = [];
  if (elevatorRequired) {
    if (isPublicAccommodation) {
      rationale.push("Public accommodation in multi-story building requires elevator");
    }
    if (buildingArea > 3000) {
      rationale.push(`Building area (${buildingArea} sf) exceeds 3,000 sf threshold for elevator exemption`);
    }
    if (employees > 30) {
      rationale.push(`Employee count (${employees}) may trigger elevator requirement`);
    }
  }
  
  return {
    elevatorRequired,
    accessibleParking,
    vanAccessible,
    rationale
  };
};
