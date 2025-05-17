
// Calculate exit requirements
export const calculateExitRequirements = (occupantLoad: number) => {
  // Number of exits (IBC Table 1006.2.1)
  let requiredExits = 1;
  if (occupantLoad > 49) requiredExits = 2;
  if (occupantLoad > 500) requiredExits = 3;
  if (occupantLoad > 1000) requiredExits = 4;
  
  // Exit width requirements (inches)
  const doorWidth = Math.ceil(occupantLoad * 0.2);
  const stairWidth = Math.ceil(occupantLoad * 0.3);
  
  // Individual exit capacity
  const capacityPerExit = Math.ceil(occupantLoad / requiredExits);
  
  // Suggest door configurations
  let suggestedConfig = '';
  if (requiredExits === 1) {
    const minDoorWidth = Math.max(32, doorWidth);
    suggestedConfig = `One ${minDoorWidth}" door`;
  } else if (requiredExits === 2) {
    const eachDoorWidth = Math.max(32, Math.ceil(doorWidth / 2));
    suggestedConfig = `Two ${eachDoorWidth}" doors`;
  } else {
    const eachDoorWidth = Math.max(32, Math.ceil(doorWidth / requiredExits));
    suggestedConfig = `${requiredExits} ${eachDoorWidth}" doors`;
  }
  
  return {
    requiredExits,
    doorWidth,
    stairWidth,
    capacityPerExit,
    suggestedConfig
  };
};
