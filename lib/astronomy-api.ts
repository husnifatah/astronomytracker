export interface AstronomyLocation {
  latitude: string;
  longitude: string;
  city?: string;
  state_prov?: string;
  country_name?: string;
  location_string?: string;
}

export interface AstronomyData {
  date: string;
  current_time: string;
  sunrise: string;
  sunset: string;
  sun_status: string;
  solar_noon: string;
  day_length: string;
  sun_altitude: number;
  sun_distance: number;
  sun_azimuth: number;
  moonrise: string;
  moonset: string;
  moon_status: string;
  moon_altitude: number;
  moon_distance: number;
  moon_azimuth: number;
  moon_parallactic_angle: number;
  moon_phase: string;
  moon_illumination_percentage: string;
  moon_angle: number;
}

export interface AstronomyResponse {
  ip?: string;
  location: AstronomyLocation;
  astronomy: AstronomyData;
}

export interface ProcessedAstronomyData {
  location: {
    city: string;
    region: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  sun: {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    dayLength: string;
    altitude: number;
    azimuth: number;
    distance: number;
    status: string;
  };
  moon: {
    phase: string;
    illumination: number;
    moonrise: string;
    moonset: string;
    altitude: number;
    azimuth: number;
    distance: number;
    angle: number;
    status: string;
  };
  timestamp: {
    date: string;
    currentTime: string;
  };
}

class AstronomyAPI {
  private apiKey: string;
  private baseUrl = 'https://api.ipgeolocation.io/v2/astronomy';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch astronomy data by IP address (auto-detects user location)
   */
  async getAstronomyByIP(ip?: string, date?: string): Promise<ProcessedAstronomyData> {
    const params = new URLSearchParams({
      apiKey: this.apiKey,
    });

    if (ip) {
      params.append('ip', ip);
    }

    if (date) {
      params.append('date', date);
    }

    const url = `${this.baseUrl}?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: AstronomyResponse = await response.json();
      return this.processAstronomyData(data);
    } catch (error) {
      throw new Error(`Failed to fetch astronomy data by IP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch astronomy data by coordinates
   */
  async getAstronomyByCoordinates(
    latitude: number, 
    longitude: number, 
    date?: string
  ): Promise<ProcessedAstronomyData> {
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      lat: latitude.toString(),
      long: longitude.toString(),
    });

    if (date) {
      params.append('date', date);
    }

    const url = `${this.baseUrl}?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: AstronomyResponse = await response.json();
      return this.processAstronomyData(data);
    } catch (error) {
      throw new Error(`Failed to fetch astronomy data by coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch astronomy data by location name
   */
  async getAstronomyByLocation(location: string, date?: string): Promise<ProcessedAstronomyData> {
    const params = new URLSearchParams({
      apiKey: this.apiKey,
      location: location,
    });

    if (date) {
      params.append('date', date);
    }

    const url = `${this.baseUrl}?${params.toString()}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: AstronomyResponse = await response.json();
      return this.processAstronomyData(data);
    } catch (error) {
      throw new Error(`Failed to fetch astronomy data by location: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process raw API response into a clean, usable format
   */
  private processAstronomyData(data: AstronomyResponse): ProcessedAstronomyData {
    const { location, astronomy } = data;
    
    return {
      location: {
        city: location.city || 'Unknown',
        region: location.state_prov || '',
        country: location.country_name || 'Unknown',
        coordinates: {
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude),
        },
      },
      sun: {
        sunrise: astronomy.sunrise,
        sunset: astronomy.sunset,
        solarNoon: astronomy.solar_noon,
        dayLength: astronomy.day_length,
        altitude: astronomy.sun_altitude,
        azimuth: astronomy.sun_azimuth,
        distance: astronomy.sun_distance,
        status: astronomy.sun_status,
      },
      moon: {
        phase: this.formatMoonPhase(astronomy.moon_phase),
        illumination: Math.abs(parseFloat(astronomy.moon_illumination_percentage)),
        moonrise: astronomy.moonrise,
        moonset: astronomy.moonset,
        altitude: astronomy.moon_altitude,
        azimuth: astronomy.moon_azimuth,
        distance: astronomy.moon_distance,
        angle: astronomy.moon_angle,
        status: astronomy.moon_status,
      },
      timestamp: {
        date: astronomy.date,
        currentTime: astronomy.current_time,
      },
    };
  }

  /**
   * Format moon phase for better display
   */
  private formatMoonPhase(phase: string): string {
    const phaseMap: { [key: string]: string } = {
      'NEW_MOON': 'New Moon',
      'WAXING_CRESCENT': 'Waxing Crescent',
      'FIRST_QUARTER': 'First Quarter',
      'WAXING_GIBBOUS': 'Waxing Gibbous',
      'FULL_MOON': 'Full Moon',
      'WANING_GIBBOUS': 'Waning Gibbous',
      'LAST_QUARTER': 'Last Quarter',
      'WANING_CRESCENT': 'Waning Crescent',
    };
    
    return phaseMap[phase] || phase.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}

// Utility function to get user's geolocation
export const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

// Export a singleton instance
export const astronomyAPI = new AstronomyAPI(process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY || '');

export default AstronomyAPI;