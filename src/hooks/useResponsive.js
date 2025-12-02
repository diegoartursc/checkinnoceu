import { useState, useEffect } from 'react';

/**
 * Hook to handle responsive logic
 * @returns {Object} { isMobile }
 */
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkResponsive = () => {
      // Basic breakpoint check, can be expanded based on design system
      setIsMobile(window.innerWidth < 768);
    };

    checkResponsive();
    window.addEventListener('resize', checkResponsive);

    return () => window.removeEventListener('resize', checkResponsive);
  }, []);

  return { isMobile };
};
