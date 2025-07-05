'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Moon } from 'lucide-react';

interface MoonPhase {
  date: Date;
  phase: string;
  illumination: number;
  phaseName: string;
}

export function MoonPhaseCalendar() {
  const [moonPhases, setMoonPhases] = useState<MoonPhase[]>([]);
  const [currentPhase, setCurrentPhase] = useState<MoonPhase | null>(null);

  useEffect(() => {
    const calculateMoonPhases = () => {
      const now = new Date();
      const phases: MoonPhase[] = [];
      
      // Calculate moon phases for the current month
      for (let day = 1; day <= 30; day++) {
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        const moonPhase = calculateMoonPhase(date);
        phases.push(moonPhase);
      }
      
      setMoonPhases(phases);
      setCurrentPhase(calculateMoonPhase(now));
    };

    calculateMoonPhases();
  }, []);

  const calculateMoonPhase = (date: Date): MoonPhase => {
    // Moon phase calculation based on astronomical algorithms
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // Julian day calculation
    const a = Math.floor((14 - month) / 12);
    const y = year - a;
    const m = month + 12 * a - 3;
    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Moon phase calculation
    const moonPhase = ((jd - 2451550.1) / 29.530588853) % 1;
    const normalizedPhase = moonPhase < 0 ? moonPhase + 1 : moonPhase;
    
    let phaseName: string;
    let illumination: number;
    
    if (normalizedPhase < 0.0625) {
      phaseName = 'New Moon';
      illumination = 0;
    } else if (normalizedPhase < 0.1875) {
      phaseName = 'Waxing Crescent';
      illumination = normalizedPhase * 4;
    } else if (normalizedPhase < 0.3125) {
      phaseName = 'First Quarter';
      illumination = 0.5;
    } else if (normalizedPhase < 0.4375) {
      phaseName = 'Waxing Gibbous';
      illumination = 0.5 + (normalizedPhase - 0.25) * 2;
    } else if (normalizedPhase < 0.5625) {
      phaseName = 'Full Moon';
      illumination = 1;
    } else if (normalizedPhase < 0.6875) {
      phaseName = 'Waning Gibbous';
      illumination = 1 - (normalizedPhase - 0.5) * 2;
    } else if (normalizedPhase < 0.8125) {
      phaseName = 'Last Quarter';
      illumination = 0.5;
    } else {
      phaseName = 'Waning Crescent';
      illumination = 0.5 - (normalizedPhase - 0.75) * 2;
    }
    
    return {
      date,
      phase: normalizedPhase.toFixed(3),
      illumination: Math.max(0, Math.min(1, illumination)),
      phaseName
    };
  };

  const renderMoonPhase = (phase: MoonPhase, size: 'small' | 'large' = 'small') => {
    const sizeClass = size === 'large' ? 'w-20 h-20' : 'w-8 h-8';
    const illumination = phase.illumination;
    
    return (
      <div className={`${sizeClass} moon-phase relative`}>
        <div 
          className="absolute inset-0 bg-gray-300 rounded-full"
          style={{
            clipPath: illumination > 0.5 
              ? `polygon(0 0, ${50 + (illumination - 0.5) * 100}% 0, ${50 + (illumination - 0.5) * 100}% 100%, 0 100%)`
              : `polygon(${50 - illumination * 100}% 0, 50% 0, 50% 100%, ${50 - illumination * 100}% 100%)`
          }}
        />
      </div>
    );
  };

  const today = new Date();
  const todayPhase = moonPhases.find(phase => 
    phase.date.toDateString() === today.toDateString()
  );

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5" />
          <span>Moon Phase Calendar</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentPhase && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {renderMoonPhase(currentPhase, 'large')}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{currentPhase.phaseName}</h3>
              <p className="text-sm text-muted-foreground">
                {Math.round(currentPhase.illumination * 100)}% illuminated
              </p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {moonPhases.slice(0, 28).map((phase, index) => (
            <div 
              key={index}
              className={`p-2 text-center space-y-1 rounded ${
                phase.date.toDateString() === today.toDateString() 
                  ? 'bg-primary/20 ring-2 ring-primary' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="text-xs font-medium">{phase.date.getDate()}</div>
              <div className="flex justify-center">
                {renderMoonPhase(phase)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            <Moon className="h-3 w-3 mr-1" />
            {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}