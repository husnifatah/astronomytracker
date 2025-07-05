'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function useAutoTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const updateTheme = () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Automatically set to dark mode between 6 PM and 6 AM
      if (hours >= 18 || hours < 6) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    // Set theme immediately
    updateTheme();

    // Update theme every hour
    const interval = setInterval(updateTheme, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setTheme]);
}