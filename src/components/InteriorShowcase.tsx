/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Radio, Droplet, Eye } from "lucide-react";
import { audio } from "./AudioEngine";

interface Hotspot {
  id: string;
  name: string;
  x: string; // CSS percentage left
  y: string; // CSS percentage top
  icon: React.ReactNode;
  subtitle: string;
  details: string;
}

interface InteriorShowcaseProps {
  interiorImage: string;
}

export const InteriorShowcase: React.FC<InteriorShowcaseProps> = ({ interiorImage }) => {
  const hotspots: Hotspot[] = [
    {
      id: "display",
      name: "Curved 34” Cinematic Screen",
      subtitle: "HOLOMATRIX SCREEN WRAPAROUND",
      x: "54%",
      y: "42%",
      icon: <Sparkles className="w-4 h-4 text-[#E2C799]" />,
      details: "A beautiful continuous organic-LED screen rendering 120Hz high-refresh technical indicators, maps, and drive controls in direct ultra HD resolution. Curved specifically for optical convergence.",
    },
    {
      id: "steering",
      name: "Biometric Sensory Yoke",
      subtitle: "TACTILE CARBON CORE STRUT",
      x: "28%",
      y: "65%",
      icon: <Eye className="w-4 h-4 text-[#E2C799]" />,
      details: "An ultra-stiff, hand-stitched carbon weave steering yoke housing optical heart-rate pulse sensors and dynamic haptic vibration feedback nodes to map split-second road friction changes.",
    },
    {
      id: "sound",
      name: "Anti-Phase Spherical Soundcube",
      subtitle: "ACTIVE ACOUSTIC CUSHIONING",
      x: "82%",
      y: "35%",
      icon: <Radio className="w-4 h-4 text-[#E2C799]" />,
      details: "Localized multi-speaker micro-drivers embedded in headrests output anti-phase wave noise cancellation. Permits individual cabin sound-zones without audio bleeding.",
    },
    {
      id: "climate",
      name: "Molecular Airflow Ventilation",
      subtitle: "INTELLIGENT SCENT & AIR IONIZATION",
      x: "72%",
      y: "74%",
      icon: <Droplet className="w-4 h-4 text-[#E2C799]" />,
      details: "Ductless hidden air slots with micro-compressors output custom dual-ion air sanitization and subtle mountain rosemary forest molecular particles to enhance alpha wave relaxation.",
    },
  ];

  const [activeHotspotId, setActiveHotspotId] = useState<string>("display");

  const handleHotspotHover = (id: string) => {
    setActiveHotspotId(id);
    audio.playTick();
  };

  const activeHotspot = hotspots.find((h) => h.id === activeHotspotId) || hotspots[0];

  return (
    <section
      id="luxury-interior"
      className="relative min-h-screen w-full flex flex-col justify-center bg-[#0D0D0F] text-[#E5E5E5] px-6 md:px-12 py-24 select-none border-b border-[#1A1A1E] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Immersive HUD controls */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-start text-left z-20">
          <span className="font-mono text-[10px] text-[#E2C799] uppercase tracking-[0.4em] mb-4">
            AETHERION CABIN COHERENCE
          </span>
          <h2 className="font-display font-light italic text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none uppercase mb-6">
            LUXURY <br />
            <span className="text-[#E2C799] font-normal not-italic">INTERIOR STAGE</span>
          </h2>
          <p className="text-[#8E8E93] text-sm leading-relaxed tracking-wider mb-10 font-sans max-w-sm font-light">
            Crafted with Italian carbon yarn, sustainable aniline leather, and hand-polished gold structural rivets. Hover over the interior hot-points to analyze advanced console sub-systems.
          </p>

          <div className="w-full flex flex-col gap-3">
            {hotspots.map((item) => (
              <button
                key={item.id}
                onMouseEnter={() => handleHotspotHover(item.id)}
                className={`w-full flex flex-col p-4 px-6 border text-left rounded-full transition-all duration-300 cursor-pointer ${
                  activeHotspotId === item.id
                    ? "border-[#E2C799] bg-[#E2C799]/5 pl-8"
                    : "border-[#E5E5E5]/10 hover:border-[#E2C799]/40 bg-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className={`text-[11px] font-mono tracking-widest uppercase ${
                    activeHotspotId === item.id ? "text-[#E2C799] font-bold" : "text-[#8E8E93]"
                  }`}>
                    {item.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Interactive Rich Image canvas with Glowing hotspots */}
        <div className="lg:col-span-12 xl:col-span-7 flex justify-center items-center z-20 w-full">
          <div className="relative w-full max-w-2xl aspect-[16/10] overflow-hidden border border-[#E5E5E5]/10 bg-[#1A1A1E]/20 p-2 rounded-2xl backdrop-blur-md">
            
            {/* Ambient subtle outline */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#8E8E93]" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#8E8E93]" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#8E8E93]" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#8E8E93]" />

            {/* Generated hyper-fidelity image */}
            <img
              src={interiorImage}
              alt="Aetherion ultra luxury futuristic interior cockpit"
              className="w-full h-full object-cover opacity-70 filter contrast-105 transition-all duration-1000 rounded-xl"
              referrerPolicy="no-referrer"
            />

            {/* Glowing Hotspots overlay */}
            {hotspots.map((item) => (
              <div
                key={item.id}
                style={{ left: item.x, top: item.y }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
                onMouseEnter={() => handleHotspotHover(item.id)}
              >
                {/* Dynamic concentric radar rings */}
                <span className={`absolute inset-0 rounded-full w-8 h-8 -left-2 -top-2 animate-ping absolute opacity-45 ${
                  activeHotspotId === item.id ? "bg-[#E2C799]" : "bg-white"
                }`} />
                <span className={`absolute inset-0 rounded-full w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  activeHotspotId === item.id 
                    ? "bg-[#E2C799] border-[#E2C799] scale-125" 
                    : "bg-[#0D0D0F] border-white hover:border-[#E2C799] scale-100"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </div>
            ))}

            {/* Floating glass HUD displaying highlighted details directly over visual image */}
            <div className="absolute top-4 right-4 bg-[#0D0D0F]/95 border border-[#E2C799]/20 p-5 rounded-2xl max-w-xs backdrop-blur-md z-40 transition-transform duration-500">
              <span className="font-mono text-[8px] text-[#E2C799] uppercase tracking-[0.2em] block mb-1">
                {activeHotspot.subtitle}
              </span>
              <span className="text-xs font-mono font-medium text-white tracking-wide block mb-2">
                {activeHotspot.name.toUpperCase()}
              </span>
              <p className="text-[10px] text-[#8E8E93] leading-relaxed font-sans font-light">
                {activeHotspot.details}
              </p>
            </div>

            <div className="absolute bottom-4 left-4 font-mono text-[8px] text-[#8E8E93] tracking-widest uppercase">
              COCKPIT TELEMETRY STATUS: DIAGNOSED_100%
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
