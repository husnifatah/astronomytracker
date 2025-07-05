'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Lightbulb } from 'lucide-react';

const astronomyFacts = [
  {
    title: "The Sun's Energy",
    fact: "The Sun produces more energy in one second than humanity has used in its entire history. It converts about 600 million tons of hydrogen into helium every second."
  },
  {
    title: "Venus's Rotation",
    fact: "Venus rotates backwards compared to most planets and rotates so slowly that a day on Venus (243 Earth days) is longer than its year (225 Earth days)."
  },
  {
    title: "Neutron Star Density",
    fact: "A neutron star is so dense that a teaspoon of neutron star material would weigh about 6 billion tons - equivalent to the mass of Mount Everest."
  },
  {
    title: "Jupiter's Great Red Spot",
    fact: "Jupiter's Great Red Spot is a storm larger than Earth that has been raging for over 400 years. Wind speeds reach up to 400 mph."
  },
  {
    title: "Saturn's Density",
    fact: "Saturn is less dense than water. If you could find an ocean large enough, Saturn would float in it."
  },
  {
    title: "Light Speed",
    fact: "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth, traveling at 186,282 miles per second."
  },
  {
    title: "Milky Way Galaxy",
    fact: "Our galaxy, the Milky Way, contains an estimated 100-400 billion stars and is about 100,000 light-years across."
  },
  {
    title: "Moon's Distance",
    fact: "The Moon is gradually moving away from Earth at about 1.5 inches (3.8 cm) per year, roughly the same rate at which fingernails grow."
  },
  {
    title: "Mars's Seasons",
    fact: "Mars has seasons similar to Earth because its axial tilt is 25 degrees (Earth's is 23.5 degrees), but each season lasts about twice as long."
  },
  {
    title: "Space Silence",
    fact: "Space is completely silent because there are no air molecules to carry sound waves. In space, no one can hear you scream!"
  },
  {
    title: "Olympus Mons",
    fact: "The largest volcano in our solar system is Olympus Mons on Mars, standing 13.6 miles (22 km) high - nearly three times taller than Mount Everest."
  },
  {
    title: "One Year on Neptune",
    fact: "Neptune takes 165 Earth years to complete one orbit around the Sun. It only completed its first full orbit since its discovery in 2011."
  }
];

export function FactBox() {
  const [currentFact, setCurrentFact] = useState(astronomyFacts[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set a daily fact based on the current date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const factIndex = dayOfYear % astronomyFacts.length;
    setCurrentFact(astronomyFacts[factIndex]);
  }, []);

  const getRandomFact = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * astronomyFacts.length);
      setCurrentFact(astronomyFacts[randomIndex]);
      setIsLoading(false);
    }, 500);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Daily Astronomy Fact</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={getRandomFact}
            disabled={isLoading}
            className="hover:bg-primary/20"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-primary">
            {currentFact.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentFact.fact}
          </p>
        </div>
        
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            💫 Discover the wonders of the universe, one fact at a time
          </p>
        </div>
      </CardContent>
    </Card>
  );
}