
// Create a use-mobile.tsx file with the correct export name
import { useEffect, useState } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return isMobile;
};

// Provide the old name for backward compatibility, but mark as deprecated
export const useMobile = () => {
  console.warn('useMobile is deprecated, please use useIsMobile instead');
  return useIsMobile();
};
