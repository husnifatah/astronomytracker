'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Globe, Thermometer, Clock, Users } from 'lucide-react';

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

interface PlanetCardProps {
  planet: Planet;
}

export function PlanetCard({ planet }: PlanetCardProps) {
  const formatMass = (mass?: { massValue: number; massExponent: number }) => {
    if (!mass) return 'Unknown';
    return `${mass.massValue.toFixed(2)} × 10^${mass.massExponent} kg`;
  };

  const formatRadius = (radius?: number) => {
    if (!radius) return 'Unknown';
    return `${radius.toLocaleString()} km`;
  };

  const formatTemp = (temp?: number) => {
    if (!temp) return 'Unknown';
    return `${Math.round(temp - 273.15)}°C`;
  };

  const formatOrbitPeriod = (period?: number) => {
    if (!period) return 'Unknown';
    const days = Math.round(period);
    if (days > 365) {
      return `${(days / 365).toFixed(1)} Earth years`;
    }
    return `${days} days`;
  };

  const getPlanetColor = (name: string) => {
    const colors: { [key: string]: string } = {
      'Mercury': 'bg-gray-500',
      'Venus': 'bg-orange-400',
      'Earth': 'bg-blue-500',
      'Mars': 'bg-red-500',
      'Jupiter': 'bg-yellow-600',
      'Saturn': 'bg-yellow-500',
      'Uranus': 'bg-cyan-400',
      'Neptune': 'bg-blue-700',
    };
    return colors[name] || 'bg-purple-500';
  };

  return (
    <Card className="glass-card hover:scale-105 transition-transform duration-200 planet-glow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{planet.englishName}</CardTitle>
          <div className={`w-8 h-8 rounded-full ${getPlanetColor(planet.englishName)}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Radius</p>
              <p className="text-muted-foreground">{formatRadius(planet.meanRadius)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Avg. Temp</p>
              <p className="text-muted-foreground">{formatTemp(planet.avgTemp)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Orbit Period</p>
              <p className="text-muted-foreground">{formatOrbitPeriod(planet.sideralOrbit)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">Moons</p>
              <p className="text-muted-foreground">{planet.moons?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <p className="font-medium text-sm">Mass</p>
          <p className="text-xs text-muted-foreground">{formatMass(planet.mass)}</p>
        </div>
        
        {planet.discoveredBy && (
          <div className="space-y-2">
            <p className="font-medium text-sm">Discovered by</p>
            <Badge variant="secondary" className="text-xs">
              {planet.discoveredBy}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}