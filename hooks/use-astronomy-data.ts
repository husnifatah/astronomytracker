'use client';

import { useState, useEffect, useCallback } from 'react';
import { astronomyAPI, getUserLocation, ProcessedAstronomyData } from '@/lib/astronomy-api';

interface UseAstronomyDataOptions {
  autoFetch?: boolean;
  useGeolocation?: boolean;
  fallbackToIP?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseAstronomyDataReturn {
  data: ProcessedAstronomyData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  fetchByCoordinates: (lat: number, lng: number) => Promise<void>;
  fetchByLocation: (location: string) => Promise<void>;
  fetchByIP: (ip?: string) => Promise<void>;
}

export function useAstronomyData(options: UseAstronomyDataOptions = {}): UseAstronomyDataReturn {
  const {
    autoFetch = true,
    useGeolocation = true,
    fallbackToIP = true,
    refreshInterval,
  } = options;

  const [data, setData] = useState<ProcessedAstronomyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchByCoordinates = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await astronomyAPI.getAstronomyByCoordinates(lat, lng);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch astronomy data';
      setError(errorMessage);
      console.error('Astronomy API error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByLocation = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await astronomyAPI.getAstronomyByLocation(location);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch astronomy data';
      setError(errorMessage);
      console.error('Astronomy API error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByIP = useCallback(async (ip?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await astronomyAPI.getAstronomyByIP(ip);
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch astronomy data';
      setError(errorMessage);
      console.error('Astronomy API error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (useGeolocation) {
      try {
        const location = await getUserLocation();
        await fetchByCoordinates(location.latitude, location.longitude);
        return;
      } catch (geoError) {
        console.warn('Geolocation failed:', geoError);
        if (fallbackToIP) {
          await fetchByIP();
          return;
        }
      }
    }
    
    if (fallbackToIP) {
      await fetchByIP();
    }
  }, [useGeolocation, fallbackToIP, fetchByCoordinates, fetchByIP]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(() => {
        refetch();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, refetch]);

  return {
    data,
    loading,
    error,
    refetch,
    fetchByCoordinates,
    fetchByLocation,
    fetchByIP,
  };
}