/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Compass, RefreshCw, Layers, Zap } from "lucide-react";
import { audio } from "./AudioEngine";

interface ScrollStoryProps {
  scrollProgress: number; // 0 to 1 representing absolute scroll
}

export const ScrollStory: React.FC<ScrollStoryProps> = ({ scrollProgress }) => {
  // Determine structured phases based on the active scroll percentage
  const getActivePhase = () => {
    if (scrollProgress < 0.25) {
      return {
        step: "01",
        title: "PRECISION",
        icon: <Compass className="w-5 h-5 text-[#E2C799]" />,
        desc: "Every dynamic contour and body separation panel of the AETHERION is designed to coordinate airflow separation layers cleanly. Sculpted from monolithic carbon composites.",
        log: "CONTOUR_CALCULATIONS: ACTIVE // CDRAG: 0.198",
      };
    } else if (scrollProgress >= 0.25 && scrollProgress < 0.5) {
      return {
        step: "02",
        title: "POWER",
        icon: <Zap className="w-5 h-5 text-[#E2C799]" />,
        desc: "Quad-motor axial-flux architecture generates instant rotary vectoring. Delivering 2,000 extreme metric horsepower straight to the hubs with zero mechanical drivetrain lag.",
        log: "DRIVE_INVERTER: HARMONIC_OK // MEGAWATT: DIRECT",
      };
    } else if (scrollProgress >= 0.5 && scrollProgress < 0.75) {
      return {
        step: "03",
        title: "AERODYNAMICS",
        icon: <Layers className="w-5 h-5 text-[#E2C799]" />,
        desc: "Hydraulic actuators respond in millisecond increments to lift, yaw, and decelerate. The rear wings deploy to generate up to 1,850 kilograms of active downward containment.",
        log: "SPOILER_SERVO_VOLTS: 95V // DEG_ATTACK: ACTIVE_42",
      };
    } else {
      return {
        step: "04",
        title: "DOMINANCE",
        icon: <RefreshCw className="w-5 h-5 text-[#E2C799]" />,
        desc: "A completely custom high-frequency multi-axis chassis that transitions traditional mechanical handling boundaries. Silicon carbon power cells designed beyond limitations.",
        log: "THERMAL_MATRIX: STABLE_38C // TOTAL_HEALTH: 100",
      };
    }
  };

  const phase = getActivePhase();

  return (
    <section 
      id="scroll-driven-storytelling"
      className="relative min-h-[140vh] w-full flex flex-col justify-start bg-[#0D0D0F] bg-opacity-95 text-[#E5E5E5] px-6 md:px-12 py-32 select-none border-b border-[#1A1A1E]"
    >
      {/* Absolute floating grid graphics to reinforce engineered look */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[100vh] border-x border-[#1A1A1E] pointer-events-none z-0" />

      {/* Main floating storytelling overlay box */}
      <div className="sticky top-40 max-w-xl mx-auto w-full z-20 flex flex-col items-start bg-[#1A1A1E]/10 p-8 md:p-12 border border-[#E5E5E5]/10 rounded-2xl backdrop-blur-md transition-all duration-500 hover:border-[#E2C799]/40 mt-12">
        {/* Top telemetry numbers */}
        <div className="w-full flex justify-between items-center border-b border-[#E5E5E5]/10 pb-4 mb-8 font-mono text-[9px] tracking-[0.25em] text-[#8E8E93]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#E2C799] rounded-full animate-ping" />
            <span>DRIVE ORBIT PHASE: {phase.step}</span>
          </div>
          <span>SCROLL CONFIG TRACKER</span>
        </div>

        {/* Huge dynamic typographic headings */}
        <div className="h-28 flex items-center justify-start overflow-hidden">
          <h3 
            className="font-display font-light italic text-4xl sm:text-6xl text-white tracking-tight leading-none uppercase transition-all duration-700"
            key={phase.title}
          >
            {phase.title}
          </h3>
        </div>

        {/* Phase structural icon & description */}
        <div className="flex gap-4 items-start text-left mt-4">
          <div className="p-3 border border-[#E5E5E5]/10 bg-[#E2C799]/5 shrink-0 rounded-full">
            {phase.icon}
          </div>
          <div className="flex flex-col">
            <p className="text-xs md:text-sm text-[#8E8E93] leading-relaxed tracking-wider font-sans font-light">
              {phase.desc}
            </p>
          </div>
        </div>

        {/* Linear visual loading gauge showing scroll percentage */}
        <div className="w-full h-1 bg-[#1A1A1E] rounded-full mt-10 overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#E2C799] to-[#E5E5E5] transition-all duration-150 rounded-full"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Bottom cyber mechanics log indicator */}
        <div className="w-full flex justify-between items-center text-[8px] font-mono tracking-widest text-[#8E8E93] pt-4 mt-6 border-t border-[#E5E5E5]/10">
          <span>{phase.log}</span>
          <span className="text-[#E2C799]">{(scrollProgress * 100).toFixed(0)}% SYNC</span>
        </div>
      </div>

      {/* Spacing driver placeholder elements so they have standard kinetic scrolling height */}
      <div className="absolute bottom-24 left-12 font-mono text-[9px] text-[#8E8E93]/60 tracking-[0.3em] uppercase hidden xl:block">
        [ DRIVING CHASSIS SEGMENT FLUID_AXIAL ]
      </div>
    </section>
  );
};
