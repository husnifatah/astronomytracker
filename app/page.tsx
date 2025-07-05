'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { PlanetGrid } from '@/components/planet-grid';
import { MoonPhaseCalendar } from '@/components/moon-phase-calendar';
import { FactBox } from '@/components/fact-box';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useAutoTheme } from '@/hooks/use-auto-theme';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useAutoTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="starfield" />
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-8 space-y-12">
          <section className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Astronomy Tracker
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the wonders of our solar system, track lunar phases, and discover fascinating astronomy facts
            </p>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PlanetGrid />
            </div>
            <div className="space-y-8">
              <MoonPhaseCalendar />
              <FactBox />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}