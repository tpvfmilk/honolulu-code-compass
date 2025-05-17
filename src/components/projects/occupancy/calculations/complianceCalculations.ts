
import { ComplianceIssue } from '../types/occupancyTypes';

// Calculate overall compliance and generate issues
export const calculateOverallCompliance = (
  travelCompliance: { violations: string[] },
  occupantLoad: { total: number, hasHighDensity: boolean },
  exitRequirements: { requiredExits: number },
  accessibilityRequirements: { elevatorRequired: boolean, elevatorProvided?: boolean }
) => {
  const issues: ComplianceIssue[] = [];
  
  // Add travel distance violations
  travelCompliance.violations.forEach(violation => {
    issues.push({ type: 'violation', message: violation, code: 'IBC 1017.1' });
  });
  
  // Check density concerns
  if (occupantLoad.hasHighDensity) {
    issues.push({ 
      type: 'warning',
      message: 'High occupant density detected - verify space planning',
      code: 'IBC 1004'
    });
  }
  
  // Check exit requirements
  if (exitRequirements.requiredExits > 1 && occupantLoad.total > 100) {
    issues.push({
      type: 'warning',
      message: 'Multiple exits required for this occupant load - verify direct access to exits',
      code: 'IBC 1006.2.1'
    });
  }
  
  // Check elevator compliance
  if (accessibilityRequirements.elevatorRequired && !accessibilityRequirements.elevatorProvided) {
    issues.push({
      type: 'violation',
      message: 'Elevator required but not provided',
      code: 'IBC Chapter 11'
    });
  }
  
  // Calculate compliance percentage
  const violationsCount = issues.filter(issue => issue.type === 'violation').length;
  const warningsCount = issues.filter(issue => issue.type === 'warning').length;
  
  // Determine overall status
  let status: 'compliant' | 'warning' | 'violation' = 'compliant';
  if (violationsCount > 0) {
    status = 'violation';
  } else if (warningsCount > 0) {
    status = 'warning';
  }
  
  // Simple percentage calculation (100% - 10% per violation - 5% per warning)
  const percentage = Math.max(0, 100 - (violationsCount * 10) - (warningsCount * 5));
  
  return {
    percentage,
    issues,
    status
  };
};
