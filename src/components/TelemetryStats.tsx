/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Gauge, Zap, Wind, ShieldCheck, Cpu } from "lucide-react";
import { audio } from "./AudioEngine";
import { TelemetryStat } from "../types";

export const TelemetryStats: React.FC = () => {
  const stats: TelemetryStat[] = [
    {
      id: "accel",
      label: "0-100 KM/H",
      value: "1.48",
      unit: "s",
      targetValue: 1.48,
      decimals: 2,
      info: "Tri-Motor Axial Flux Instant Vector Thrust",
    },
    {
      id: "speed",
      label: "TOP SPEED",
      value: "412",
      unit: "KM/H",
      targetValue: 412,
      decimals: 0,
      info: "Aerodynamic Drag Coefficient Limit Cap",
    },
    {
      id: "power",
      label: "HORSEPOWER",
      value: "2000",
      unit: "HP",
      targetValue: 2000,
      decimals: 0,
      info: "Megawatt Solid-State Carbon Silicon Cell Core",
    },
    {
      id: "torque",
      label: "PEAK TORQUE",
      value: "2350",
      unit: "NM",
      targetValue: 2350,
      decimals: 0,
      info: "Instantaneous Quad-Motor Direct Shaft Drive",
    },
    {
      id: "range",
      label: "RANGE (WLTP)",
      value: "800",
      unit: "KM",
      targetValue: 800,
      decimals: 0,
      info: "950V High-Efficiency Thermo-Regulated Packs",
    },
  ];

  // Map icons for advanced sci-fi aesthetics
  const getIcon = (id: string, colorClass: string) => {
    switch (id) {
      case "accel": return <Zap className={`w-5 h-5 ${colorClass}`} />;
      case "speed": return <Gauge className={`w-5 h-5 ${colorClass}`} />;
      case "power": return <Cpu className={`w-5 h-5 ${colorClass}`} />;
      case "torque": return <Wind className={`w-5 h-5 ${colorClass}`} />;
      default: return <ShieldCheck className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  const [counters, setCounters] = useState<{ [key: string]: number }>({
    accel: 0, speed: 0, power: 0, torque: 0, range: 0
  });
  
  const [activeStatId, setActiveStatId] = useState<string>("accel");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          audio.playStartup(); 
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Trigger precise counter increment loop over 1.6 seconds
    const duration = 1600;
    const startTimestamp = performance.now();

    let animationFrameId: number;

    const runCounter = (now: number) => {
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Gorgeous premium deceleration curve
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      const nextCounters: { [key: string]: number } = {};
      stats.forEach((stat) => {
        nextCounters[stat.id] = parseFloat((stat.targetValue * easeProgress).toFixed(stat.decimals));
      });

      setCounters(nextCounters);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(runCounter);
      } else {
        // Enforce perfect stats values on end
        const finalCounters: { [key: string]: number } = {};
        stats.forEach((stat) => {
          finalCounters[stat.id] = stat.targetValue;
        });
        setCounters(finalCounters);
      }
    };

    animationFrameId = requestAnimationFrame(runCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible]);

  const handleStatFocus = (id: string) => {
    setActiveStatId(id);
    audio.playTick();
  };

  const activeStat = stats.find(s => s.id === activeStatId) || stats[0];

  return (
    <section 
      ref={sectionRef}
      id="performance-telemetry"
      className="relative min-h-screen w-full flex flex-col justify-center bg-[#0D0D0F] text-[#E5E5E5] px-6 md:px-12 py-24 select-none border-b border-[#1A1A1E]"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Editorial Typography & Telemetry Panels */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col items-start text-left z-20">
          <span className="font-mono text-[10px] text-[#E2C799] uppercase tracking-[0.4em] mb-4">
            AETHERION PLATFORM SPECIFICS
          </span>
          <h2 className="font-display font-light italic text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none uppercase mb-6">
            TELEMETRY &amp; <br />
            <span className="text-[#E2C799] font-normal not-italic">PURE METRICS</span>
          </h2>
          <p className="text-[#8E8E93] text-sm sm:text-base leading-relaxed tracking-wider mb-10 font-sans max-w-md font-light">
            Every cell, sensor, and carbon weave layer operates in perfect mathematical sync. Tap any technical readout panel to explore localized high-voltage telemetry configurations.
          </p>

          {/* Interactive Stat Selectors */}
          <div className="w-full flex flex-col gap-3">
            {stats.map((stat) => (
              <button
                key={stat.id}
                onClick={() => handleStatFocus(stat.id)}
                className={`w-full flex items-center justify-between p-4 px-6 text-left border rounded-full transition-all duration-300 cursor-pointer ${
                  activeStatId === stat.id
                    ? "border-[#E2C799] bg-[#E2C799]/5 pl-8"
                    : "border-[#E5E5E5]/10 hover:border-[#E2C799]/40 bg-transparent"
                }`}
              >
                <div className="flex items-center gap-4">
                  {getIcon(stat.id, activeStatId === stat.id ? "text-[#E2C799]" : "text-[#8E8E93]")}
                  <span className={`text-[11px] font-mono tracking-widest uppercase ${
                    activeStatId === stat.id ? "text-white font-bold" : "text-[#8E8E93]"
                  }`}>
                    {stat.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className={`text-xl font-semibold ${
                    activeStatId === stat.id ? "text-[#E2C799]" : "text-[#E5E5E5]"
                  }`}>
                    {counters[stat.id] || 0}
                  </span>
                  <span className="text-[10px] text-[#8E8E93]">{stat.unit}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Immersive Telemetry Focus Panel */}
        <div className="lg:col-span-12 xl:col-span-7 flex justify-center items-center z-20 w-full">
          <div className="relative w-full max-w-xl aspect-square border border-[#E5E5E5]/10 bg-[#1A1A1E]/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm flex flex-col justify-between overflow-hidden">
            {/* Ambient Background Grid lines */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border-r border-b border-[#E5E5E5]" />
              ))}
            </div>

            {/* Glowing corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#E2C799]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#E2C799]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#E2C799]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#E2C799]" />

            {/* Telemetry metadata header */}
            <div className="w-full flex justify-between items-center font-mono text-[9px] text-[#8E8E93] tracking-widest border-b border-[#2A2A30] pb-4">
              <span>SYSTEM FOCUS: {activeStat.id.toUpperCase()}_STAGE</span>
              <span className="text-[#E2C799] animate-pulse">● SAMPLING ACTIVE</span>
            </div>

            {/* Giant Graphic Numbers */}
            <div className="my-auto py-12 flex flex-col items-center justify-center font-mono relative">
              {/* Spinning backdrop dial representation */}
              <div className="absolute w-64 h-64 border border-[#E2C799]/10 rounded-full animate-[spin_40s_linear_infinite] flex items-center justify-center">
                <div className="w-56 h-56 border border-dashed border-[#E5E5E5]/5 rounded-full" />
              </div>

              <div className="flex items-baseline gap-2 z-10">
                <span className="text-7xl md:text-9xl font-extrabold text-white tracking-tighter leading-none select-none">
                  {counters[activeStat.id]}
                </span>
                <span className="text-2xl md:text-3xl text-[#E2C799] font-light uppercase select-none leading-none">
                  {activeStat.unit}
                </span>
              </div>
              <span className="mt-4 font-sans text-xs md:text-sm text-[#8E8E93] tracking-[0.2em] uppercase max-w-sm text-center leading-relaxed">
                {activeStat.info}
              </span>
            </div>

            {/* Bottom hardware address block */}
            <div className="w-full flex justify-between items-end border-t border-[#2A2A30] pt-4 font-mono text-[8px] text-[#8E8E93] tracking-[0.2em]">
              <div className="flex flex-col text-left">
                <span>INVERTER CORE EFF: 99.42%</span>
                <span>HARMONIC MATRIX SPREAD: ACTIVE</span>
              </div>
              <div className="flex flex-col text-right">
                <span>SECTOR: GRID_W_8</span>
                <span>VOLTAGE: 950V SILICON</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
