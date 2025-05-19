
import { FormData } from "../../types";
import { FireSafetyCalculationsProps, getProperty } from "../types/fireSafetyTypes";

export function calculateFireDampers(formData: FormData | FireSafetyCalculationsProps) {
  const sprinklered = getProperty(formData, 'sprinklerSystem');
  const highRise = getProperty(formData, 'highRise') || false;
  
  return {
    fireDamperLocations: [
      "Ducts penetrating fire barriers",
      "Ducts penetrating fire partitions",
      "Ducts penetrating fire walls",
      "Ducts penetrating shaft enclosures"
    ],
    smokeDamperLocations: [
      "Ducts penetrating smoke barriers",
      "Ducts penetrating corridor walls required to be rated",
      ...(highRise ? ["At each floor in high-rise buildings"] : [])
    ],
    exceptions: [
      ...(sprinklered ? ["Smoke dampers not required in fully sprinklered buildings for some conditions"] : []),
      "Fire dampers not required where ducts are constructed of steel and penetration is protected"
    ],
    reference: "IBC Section 717"
  };
}
