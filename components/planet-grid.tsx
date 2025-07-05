'use client';

import { useState, useEffect } from 'react';
import { PlanetCard } from '@/components/planet-card';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Planet {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  mass?: {
    massValue: number;
    massExponent: number;
  };
  vol?: {
    volValue: number;
    volExponent: number;
  };
  density?: number;
  gravity?: number;
  meanRadius?: number;
  sideralOrbit?: number;
  sideralRotation?: number;
  discoveredBy?: string;
  discoveryDate?: string;
  axialTilt?: number;
  avgTemp?: number;
  mainAnomaly?: number;
  argPeriapsis?: number;
  longAscNode?: number;
  bodyType?: string;
  dimension?: string;
  moons?: Array<{
    moon: string;
    rel: string;
  }>;
}

export function PlanetGrid() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.le-systeme-solaire.net/rest/bodies?filter[]=isPlanet,eq,true');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPlanets(data.bodies || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch planets');
        console.error('Error fetching planets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanets();
  }, []);

  if (loading) {
    return (
      <div className="glass-card rounded-lg p-8 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="glass-card">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load planet data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Solar System Planets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {planets.map((planet) => (
          <PlanetCard key={planet.id} planet={planet} />
        ))}
      </div>
    </div>
  );
}