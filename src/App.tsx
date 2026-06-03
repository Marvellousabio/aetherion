/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TelemetryStats } from "./components/TelemetryStats";
import { ScrollStory } from "./components/ScrollStory";
import { EngineeringExploded } from "./components/EngineeringExploded";
import { InteriorShowcase } from "./components/InteriorShowcase";
import { Manifesto } from "./components/Manifesto";
import { ThreeCarScene } from "./components/ThreeCarScene";
import { BodyThemeType } from "./types";
import { audio } from "./components/AudioEngine";
import { Eye, ShieldAlert, ChevronDown } from "lucide-react";

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTheme, setActiveTheme] = useState<BodyThemeType>("carbon");
  const [activePartId, setActivePartId] = useState<string | null>(null);
  const [systemConnected, setSystemConnected] = useState(false);

  // Asset paths generated dynamically
  const exteriorAsset = "/src/assets/images/aetherion_exterior_1780480454170.png";
  const interiorAsset = "/src/assets/images/aetherion_interior_1780480471365.png";
  const chassisAsset = "/src/assets/images/aetherion_chassis_1780480491006.png";

  useEffect(() => {
    // Standard modular scroll tracker calculating perfect precise percentages
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Simulate high-voltage grid validation
    const bootTimer = setTimeout(() => {
      setSystemConnected(true);
    }, 2000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(bootTimer);
    };
  }, []);

  const handleExploreTrigger = () => {
    const targetElement = document.getElementById("performance-telemetry");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0D0D0F] text-[#E5E5E5] selection:bg-[#E2C799]/30 selection:text-white antialiased overflow-hidden">
      
      {/* Sophisticated Dark Background Texture & Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(#1A1A1E 1px, transparent 1px), linear-gradient(90deg, #1A1A1E 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1E]/30 via-transparent to-transparent opacity-40 pointer-events-none z-0" />
      
      {/* 1. CINEMATIC 3D RENDERING SYSTEM OVERLAY (FIXED BACKPLANE) */}
      <ThreeCarScene
        scrollProgress={scrollProgress}
        activePartId={activePartId}
        activeTheme={activeTheme}
      />

      {/* 2. DYNAMIC BRAND NAVIGATION CONNECTIONS */}
      <Header
        activeTheme={activeTheme}
        onThemeChange={setActiveTheme}
        systemConnected={systemConnected}
      />

      {/* 3. ACTIVE INTERFACES RAIL PORTAL */}
      <main className="relative z-20 w-full flex flex-col">
        {/* HERO CANVAS */}
        <Hero
          onExploreClick={handleExploreTrigger}
          activeTheme={activeTheme}
        />

        {/* PERFORMANCE TELEMETRY DASHBOARD */}
        <TelemetryStats />

        {/* SCROLL-DRIVEN STORYTELLING GRID */}
        <ScrollStory scrollProgress={scrollProgress} />

        {/* DETAILED CHASSIS MECHANICS */}
        <EngineeringExploded
          activePartId={activePartId}
          onPartSelect={setActivePartId}
          chassisImage={chassisAsset}
        />

        {/* CABIN INTERIOR SHOWCASE */}
        <InteriorShowcase interiorImage={interiorAsset} />

        {/* MANIFESTO & PRE-ORDER CORE ALLOCATOR */}
        <Manifesto
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme}
          exteriorImage={exteriorAsset}
        />
      </main>

      {/* 4. SEAMLESS REINFORCEMENTS LAB BAR */}
      <footer className="relative z-30 border-t border-[#1A1A1E] bg-[#0D0D0F] px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 select-none font-mono text-[9px] text-[#8E8E93] tracking-widest max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-1.5">
          <span>PORTAL: SECURE_CORE_AETHERION_DOCK</span>
          <span className="text-emerald-400">STATUS: VERIFIED TRANSMITTING</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-[#E5E5E5] font-sans font-semibold tracking-[0.25em] text-xs">
            AETHERION MOTORS
          </span>
          <span className="mt-1 font-mono text-[8px] uppercase text-[#8E8E93]">
            engineered beyond absolute boundaries
          </span>
        </div>

        <div className="flex flex-col md:items-end text-center md:text-right gap-1.5">
          <span>COOPERATIVE DESIGN BY BESTRICKY</span>
          <span>SYSTEM CHASSIS V-9932</span>
        </div>
      </footer>
    </div>
  );
}
