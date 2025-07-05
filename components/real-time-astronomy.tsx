'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useAstronomyData } from '@/hooks/use-astronomy-data';
import { 
  Sun, 
  Moon, 
  MapPin, 
  RefreshCw, 
  Sunrise, 
  Sunset, 
  Clock,
  Globe,
  AlertTriangle,
  Eye
} from 'lucide-react';

export function RealTimeAstronomy() {
  const { data, loading, error, refetch } = useAstronomyData({
    autoFetch: true,
    useGeolocation: true,
    fallbackToIP: true,
    refreshInterval: 60000, // Refresh every minute
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const formatTime = (time: string) => {
    if (!time || time === '-') return 'N/A';
    return time;
  };

  const getMoonPhaseIcon = (phase: string) => {
    const phaseIcons: { [key: string]: string } = {
      'New Moon': '🌑',
      'Waxing Crescent': '🌒',
      'First Quarter': '🌓',
      'Waxing Gibbous': '🌔',
      'Full Moon': '🌕',
      'Waning Gibbous': '🌖',
      'Last Quarter': '🌗',
      'Waning Crescent': '🌘',
    };
    return phaseIcons[phase] || '🌙';
  };

  const getSunStatus = (sunrise: string, sunset: string, currentTime: string) => {
    if (!sunrise || !sunset || !currentTime) return 'Unknown';
    
    const current = new Date(`2000-01-01 ${currentTime}`);
    const rise = new Date(`2000-01-01 ${sunrise}`);
    const set = new Date(`2000-01-01 ${sunset}`);
    
    if (current >= rise && current <= set) {
      return 'Day';
    }
    return 'Night';
  };

  if (loading && !data) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center p-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Alert variant="destructive" className="glass-card">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Unable to load real-time astronomy data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center p-8">
          <p className="text-muted-foreground">No astronomy data available</p>
        </CardContent>
      </Card>
    );
  }

  const sunStatus = getSunStatus(data.sun.sunrise, data.sun.sunset, data.timestamp.currentTime);

  return (
    <div className="space-y-6">
      {/* Location and Time Header */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Real-Time Astronomy Data</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="hover:bg-primary/20"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {data.location.city}, {data.location.region}
              </h3>
              <p className="text-sm text-muted-foreground">{data.location.country}</p>
              <p className="text-xs text-muted-foreground">
                {data.location.coordinates.lat.toFixed(4)}°, {data.location.coordinates.lng.toFixed(4)}°
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{data.timestamp.date}</p>
              <p className="text-sm text-muted-foreground">{formatTime(data.timestamp.currentTime)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sun Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              <span>Solar Information</span>
              <Badge variant={sunStatus === 'Day' ? 'default' : 'secondary'}>
                {sunStatus}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Sunrise className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Sunrise</p>
                  <p className="text-sm text-muted-foreground">{formatTime(data.sun.sunrise)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Sunset className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Sunset</p>
                  <p className="text-sm text-muted-foreground">{formatTime(data.sun.sunset)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Solar Noon</p>
                  <p className="text-sm text-muted-foreground">{formatTime(data.sun.solarNoon)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Day Length</p>
                  <p className="text-sm text-muted-foreground">{data.sun.dayLength}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Altitude:</span>
                <span className="text-sm font-medium">{data.sun.altitude.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Azimuth:</span>
                <span className="text-sm font-medium">{data.sun.azimuth.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Distance:</span>
                <span className="text-sm font-medium">{(data.sun.distance / 1000000).toFixed(2)}M km</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Moon Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Moon className="h-5 w-5 text-blue-300" />
              <span>Lunar Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-4xl">{getMoonPhaseIcon(data.moon.phase)}</div>
              <h3 className="font-semibold text-lg">{data.moon.phase}</h3>
              <p className="text-sm text-muted-foreground">
                {data.moon.illumination.toFixed(1)}% illuminated
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Moonrise</p>
                <p className="text-sm text-muted-foreground">{formatTime(data.moon.moonrise)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Moonset</p>
                <p className="text-sm text-muted-foreground">{formatTime(data.moon.moonset)}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Altitude:</span>
                <span className="text-sm font-medium">{data.moon.altitude.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Azimuth:</span>
                <span className="text-sm font-medium">{data.moon.azimuth.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Distance:</span>
                <span className="text-sm font-medium">{(data.moon.distance / 1000).toFixed(0)}k km</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}