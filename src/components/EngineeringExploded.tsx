/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Cpu, Shield, Zap, Compass, RefreshCw } from "lucide-react";
import { EngineeringPart } from "../types";
import { audio } from "./AudioEngine";
import { BatteryHeatMap } from "./BatteryHeatMap";

interface EngineeringExplodedProps {
  activePartId: string | null;
  onPartSelect: (partId: string | null) => void;
  chassisImage: string; // generated graphic asset path
}

export const EngineeringExploded: React.FC<EngineeringExplodedProps> = ({
  activePartId,
  onPartSelect,
  chassisImage,
}) => {
  const [isLocked, setIsLocked] = useState(false);

  const parts: EngineeringPart[] = [
    {
      id: "chassis",
      name: "Monocoque Carbon Fiber Cabin",
      title: "PREIMPREGNATED WEAVE STRUCTURE",
      description: "A single solid piece of cured carbon fiber composite core delivering exceptional torsional stiffness and protection grid layouts. Engineered with crumple-reactive honeycombs.",
      specifications: [
        "Torsional Stiffness: 68,000 Nm/deg",
        "Material Grid: Torayca T1100G Prepreg",
        "Total Core Weight: 85 Kilograms",
      ],
      efficiency: "Weight Opt: 94%",
      position: { x: 0, y: 0.95, z: 0 },
    },
    {
      id: "battery",
      name: "Solid-State Electrochemical Core",
      title: "SOLID CONCENTRIC POWERPACK",
      description: "Direct-cooled cell blocks delivering 150kWh of safe energy release. Non-flammable ceramic electrolytes with intelligent megawatt charging capabilities.",
      specifications: [
        "Capacity: 150 kWh Ultra Capacity",
        "Architecture Voltage: 950V DC Hybrid",
        "Charge cycle density: 4500 Cycles",
      ],
      efficiency: "Specific Energy: 480 Wh/kg",
      position: { x: 0, y: -0.68, z: 0 },
    },
    {
      id: "aero",
      name: "Active Intelligent Aerodynamics",
      title: "HYDRO-PNEUMATIC SPOILER & ACTUATORS",
      description: "Motorized dual-actuator rear aerofoil working with variable underbody ventures. Adapts angle-of-attack dynamically based on real-time yaw vectors.",
      specifications: [
        "Max Downforce: 1850 kg at 350 km/h",
        "Response Vector: 45 Milliseconds",
        "Active Venturi Vent: Integrated Coils",
      ],
      efficiency: "Drag Coefficient: 0.22 Cd - 0.48 Cd",
      position: { x: 0, y: 1.15, z: -1.8 },
    },
    {
      id: "ai",
      name: "Neural Driving Core Compute",
      title: "AETHERION SYNAPSE AUTO-DRIVE",
      description: "Dual redundant silicon computer processing 480 trillion operations per second. Connected directly to multi-spectral lidar, radar, and HD neural camera matrices.",
      specifications: [
        "Processor Capacity: 480 TOPS Core",
        "Sensor Nodes: 36 Independent Tracks",
        "Model latency: 1.8 ms local thread",
      ],
      efficiency: "Lidar Precision: Sub-millimeter",
      position: { x: 0, y: 0.4, z: 0 },
    },
  ];

  const handleMouseEnterPart = (id: string) => {
    if (!isLocked) {
      onPartSelect(id);
      audio.playTick();
    }
  };

  const handleMouseLeavePart = () => {
    if (!isLocked) {
      onPartSelect(null);
    }
  };

  const handlePartClick = (id: string) => {
    if (isLocked && activePartId === id) {
      setIsLocked(false);
      onPartSelect(null);
      audio.playSweep();
    } else {
      setIsLocked(true);
      onPartSelect(id);
      audio.playStartup();
    }
  };

  const handleResetClick = () => {
    audio.playSweep();
    setIsLocked(false);
    onPartSelect(null);
  };

  const activePart = parts.find((p) => p.id === activePartId);

  return (
    <section
      id="engineering-exploded"
      className="relative min-h-screen w-full flex flex-col justify-center bg-[#0D0D0F] text-[#E5E5E5] px-6 md:px-12 py-24 select-none border-b border-[#1A1A1E]"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Interactive Blueprint Render */}
        <div className="lg:col-span-12 xl:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-lg aspect-[16/10] overflow-hidden border border-[#E5E5E5]/10 bg-[#1A1A1E]/10 rounded-2xl p-2">
            {/* Corner styling */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#8E8E93]" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#8E8E93]" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#8E8E93]" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#8E8E93]" />

            <div className="absolute top-4 left-4 font-mono text-[9px] tracking-widest text-[#8E8E93]">
              INTERACTIVE REVELATION MATRIX
            </div>

            {/* Generated high-fidelity engineering image render */}
            <img
              src={chassisImage}
              alt="Aetherion high-tech chassis blueprint"
              className="w-full h-full object-cover opacity-60 hover:opacity-85 hover:scale-105 transition-all duration-700 pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Interactive battery component heatmap overlay */}
            {activePartId === "battery" && (
              <BatteryHeatMap />
            )}

            {/* Hover overlay stats panel for premium immersion */}
            {activePart && activePartId !== "battery" && (
              <div className="absolute bottom-4 left-4 right-4 bg-[#0D0D0F]/90 border border-[#E2C799]/20 p-4 rounded-xl backdrop-blur-md">
                <span className="font-mono text-[8px] text-[#E2C799] uppercase tracking-[0.2em] block mb-1">
                  SECURE METADATA EXTRACTED
                </span>
                <span className="text-xs font-mono font-medium text-[#E5E5E5] tracking-wide block">
                  {activePart.name.toUpperCase()} SYSTEM
                </span>
              </div>
            )}
          </div>
          
          <p className="font-mono text-[9px] text-[#8E8E93] tracking-[0.3em] uppercase mt-4 text-center">
            {isLocked
              ? "[ INTERACTIVE METADATA TERMINAL LOCKED - CLICK ROW TO UNLOCK ]"
              : "[ HOVER OR CLICK COMPONENT TO LOCK REVELATION MATRIX ]"}
          </p>
        </div>

        {/* Right Engineering Selection Controllers */}
        <div className="lg:col-span-12 xl:col-span-6 flex flex-col items-start text-left z-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] text-[#E2C799] uppercase tracking-[0.4em]">
              CHASSIS VOLUMETRIC COLLAPSE
            </span>
            {activePartId && (
              <button
                onClick={handleResetClick}
                className="flex items-center gap-1.5 font-mono text-[9px] border border-[#E5E5E5]/10 text-[#E2C799] px-3 py-1 rounded-full hover:bg-[#E2C799]/10 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>RE-LOCK</span>
              </button>
            )}
          </div>
          
          <h2 className="font-display font-light italic text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none uppercase mb-6">
            EXPLODED <br />
            <span className="text-[#E2C799] font-normal not-italic">ENGINEERING</span>
          </h2>

          <div className="w-full flex flex-col gap-4">
            {parts.map((p) => (
              <div
                key={p.id}
                onMouseEnter={() => handleMouseEnterPart(p.id)}
                onMouseLeave={handleMouseLeavePart}
                onClick={() => handlePartClick(p.id)}
                className={`relative p-5 border rounded-2xl transition-all duration-500 cursor-pointer ${
                  activePartId === p.id
                    ? "border-[#E2C799] bg-[#E2C799]/10 shadow-lg shadow-[#E2C799]/10"
                    : "border-[#E5E5E5]/10 bg-[#1A1A1E]/10 hover:border-[#E2C799]/30"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[9px] text-[#8E8E93] uppercase tracking-[0.25em] block mb-1">
                      {p.title}
                    </span>
                    <h3 className={`text-base font-sans tracking-wide font-medium ${
                      activePartId === p.id ? "text-white" : "text-[#8E8E93]"
                    }`}>
                      {p.name}
                    </h3>
                  </div>
                  <span className="font-mono text-[9px] text-[#E2C799] tracking-widest uppercase">
                    {p.id === "chassis" && <Shield className="w-4 h-4" />}
                    {p.id === "battery" && <Zap className="w-4 h-4" />}
                    {p.id === "aero" && <Compass className="w-4 h-4" />}
                    {p.id === "ai" && <Cpu className="w-4 h-4" />}
                  </span>
                </div>

                {/* Expanded Specifications Board */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    activePartId === p.id
                      ? "grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-[#E2C799]/20"
                      : "grid-rows-[0fr] opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-xs text-[#8E8E93] leading-relaxed tracking-wider mb-4 font-sans">
                      {p.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      {p.specifications.map((spec, i) => (
                        <div key={i} className="flex flex-col border-l border-[#2A2A30] pl-2.5 py-0.5">
                          <span className="font-mono text-[8px] text-[#8E8E93] tracking-widest uppercase">
                            SPEC_DATA_0{i + 1}
                          </span>
                          <span className="font-mono text-[10px] text-white tracking-wide mt-0.5">
                            {spec}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-[#E2C799] mt-3">
                      <span>INTELLIGENT DIAGNOSTICS</span>
                      <span className="px-2 py-0.5 bg-[#E2C799]/10 rounded border border-[#E2C799]/20">
                        {p.efficiency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
