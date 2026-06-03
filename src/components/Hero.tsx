/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { ArrowRight, ChevronDown, Award } from "lucide-react";
import { audio } from "./AudioEngine";
import { motion } from "motion/react";

interface HeroProps {
  onExploreClick: () => void;
  activeTheme: "carbon" | "aurora" | "cyber";
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, activeTheme }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [btnCoords, setBtnCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic button calculations using pure mathematical spring interpolation
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Magnetic pull distance ratio
    const pullX = (e.clientX - centerX) * 0.45;
    const pullY = (e.clientY - centerY) * 0.45;

    setBtnCoords({ x: pullX, y: pullY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setBtnCoords({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    audio.playTick();
  };

  const handleButtonClick = () => {
    audio.playStartup();
    onExploreClick();
  };

  return (
    <section 
      id="hero-cinematic"
      className="relative min-h-screen w-full flex flex-col justify-between items-center text-center px-6 pt-32 pb-16 overflow-hidden bg-gradient-to-b from-[#0D0D0F]/90 via-transparent to-[#0D0D0F]/95"
    >
      {/* Background Radial Light Accent */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div 
          className="w-[70vw] h-[70vw] rounded-full blur-[160px] opacity-15 transition-all duration-1000"
          style={{
            background: activeTheme === "carbon" 
              ? "radial-gradient(circle, #00ffff 0%, rgba(13,13,15,0) 70%)"
              : activeTheme === "aurora"
              ? "radial-gradient(circle, #e2c799 0%, rgba(13,13,15,0) 70%)"
              : "radial-gradient(circle, #ff00ff 0%, rgba(13,13,15,0) 70%)"
          }}
        />
      </div>

      {/* Decorative mechanical HUD margins */}
      <div className="absolute top-28 left-12 hidden xl:flex items-center gap-2 text-[#8E8E93] text-[9px] tracking-[0.25em] font-mono select-none">
        <span className="w-1.5 h-1.5 bg-[#E2C799] rounded-full animate-ping" />
        <span>AETHERION PROTOTYPE XE-1</span>
      </div>

      <div className="absolute top-28 right-12 hidden xl:flex items-center gap-2 text-[#8E8E93] text-[9px] tracking-[0.25em] font-mono select-none">
        <span>GRID POS: 51.5074° N, 0.1278° W</span>
      </div>

      {/* Main Narrative Elements */}
      <div className="my-auto z-20 flex flex-col items-center">
        {/* Subtle Luxury Ribbon Badge */}
        <div className="mb-6 flex items-center gap-2 border border-[#E2C799]/30 bg-[#E2C799]/5 px-4 py-1 rounded-full backdrop-blur-md">
          <Award className="w-3.5 h-3.5 text-[#E2C799]" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans text-[#E2C799] font-medium">Bespoke Electric Hyper-Art</span>
        </div>

        {/* Editorial Heading "Engineered Beyond Limits" */}
        <h1 className="font-display font-light italic text-4xl sm:text-6xl md:text-8xl text-[#E5E5E5] tracking-tight leading-none max-w-5xl text-center select-none px-4">
          Engineered Beyond <span className="text-[#E2C799] font-normal not-italic">Limits</span>
        </h1>

        {/* Premium understated subheadline */}
        <p className="mt-8 text-[#8E8E93] tracking-[0.12em] text-xs sm:text-sm max-w-xl text-center font-light uppercase">
          The intersection of kinetic art and electric dominance.
        </p>

        {/* Custom fluid feedback magnetic CTA button */}
        <div className="mt-12 h-24 flex items-center justify-center">
          <button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onClick={handleButtonClick}
            className="group relative cursor-pointer flex items-center gap-4 bg-transparent text-[#E5E5E5] font-sans text-[11px] font-medium tracking-[0.3em] px-8 py-4 rounded-full border border-[#E5E5E5]/20 hover:border-[#E2C799] shadow-xl shadow-black/40 transition-all duration-500 overflow-hidden"
            style={{
              transform: `translate(${btnCoords.x}px, ${btnCoords.y}px)`,
              transition: isHovered ? "none" : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Elegant gold backplane hover ripple */}
            <span className="absolute inset-0 w-full h-full bg-[#E2C799]/5 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10 uppercase">EXPLORE INTERFACE</span>
            <div className="relative z-10 w-8 h-8 rounded-full bg-[#E2C799] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L11 11M11 11V3M11 11H3" stroke="#0D0D0F" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Synchronizing Systems HUD Decoration */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden xl:flex flex-col items-center space-y-4 z-20 pointer-events-none">
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#E2C799]/30 to-transparent"></div>
        <div className="text-[8px] tracking-[0.5em] text-[#8E8E93] uppercase [writing-mode:vertical-rl] opacity-60">Synchronizing Systems</div>
        <div className="w-1.5 h-1.5 rounded-full border border-[#E2C799] bg-[#E2C799]/20 animate-pulse"></div>
      </div>

      {/* Bottom status panels */}
      <div className="w-full flex justify-between items-end max-w-7xl z-20 px-4 md:px-12">
        <div className="flex flex-col items-start text-left max-w-xs font-mono text-[9px] text-[#8E8E93] tracking-widest leading-relaxed">
          <span>01 / AERODYNAMICS: DYNAMIC SPLITTERS ACTIVE</span>
          <span>02 / ALL-WHEEL INVERTER HARMONICS: OPERATIONAL</span>
          <span className="text-[#E2C799]">03 / POWER STATE: STANDBY CONNECTED</span>
        </div>

        {/* Subtle scroll down driver indicator */}
        <button 
          onClick={onExploreClick}
          onMouseEnter={() => audio.playTick()}
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          <span className="font-mono text-[9px] text-[#8E8E93] group-hover:text-[#E2C799] tracking-[0.4em] uppercase transition-colors">LAUNCH DRIVE</span>
          <div className="w-6 h-10 border border-[#2A2A30] group-hover:border-[#E2C799]/60 rounded-full flex justify-center p-1 transition-colors">
            <span className="w-1 h-2 bg-[#E2C799] rounded-full animate-bounce mt-1" />
          </div>
        </button>

        <div className="flex flex-col items-end text-right hidden lg:flex font-sans text-[11px] text-[#8E8E93] tracking-wider font-light">
          <span>AETHERION BRANDED DIRECTIVES © 2026</span>
          <span className="text-[#E2C799] font-mono text-[9px] uppercase tracking-[0.2em] mt-1">BESTRICKY DIGITAL STUDIO COLLABORATION</span>
        </div>
      </div>
    </section>
  );
};
