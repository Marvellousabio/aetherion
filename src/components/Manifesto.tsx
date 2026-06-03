/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Send, CheckCircle2, ChevronRight, Award } from "lucide-react";
import { audio } from "./AudioEngine";
import { BodyThemeType } from "../types";

interface ManifestoProps {
  activeTheme: BodyThemeType;
  onThemeChange: (theme: BodyThemeType) => void;
  exteriorImage: string;
}

export const Manifesto: React.FC<ManifestoProps> = ({
  activeTheme,
  onThemeChange,
  exteriorImage,
}) => {
  const [reserveSubmitted, setReserveSubmitted] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFocus = () => {
    audio.playTick();
  };

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail) return;

    audio.playStartup(); 
    setIsSubmitting(true);

    // Simulate elite processing sequence
    setTimeout(() => {
      setIsSubmitting(false);
      setReserveSubmitted(true);
    }, 1500);
  };

  const configThemes: { id: BodyThemeType; name: string; desc: string; hue: string }[] = [
    { id: "carbon", name: "Carbon Stealth", desc: "Raw 12K twill carbon fiber weave with performance matte finish.", hue: "border-cyan-500/30" },
    { id: "aurora", name: "Aurora Gold", desc: "Warm gold metallic leaf flakes with crystal gloss lacquer layers.", hue: "border-amber-500/30" },
    { id: "cyber", name: "Cyber Purple", desc: "Deep chromatic shifting micro-chroma paint that bends under light angles.", hue: "border-fuchsia-500/30" },
  ];

  return (
    <div className="bg-[#0D0D0F]" id="manifesto-and-reserve">
      {/* 1. CINEMATIC MANIFESTO COMPONENT */}
      <section className="relative min-h-[80vh] w-full flex flex-col justify-center items-center px-6 md:px-12 py-32 border-b border-[#E5E5E5]/10 text-center bg-gradient-to-t from-[#0D0D0F] to-[#0D0D0F]/40 overflow-hidden">
        
        {/* Understated background logo overlay */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none">
          <span className="font-sans font-extralight text-[25vw] tracking-wider leading-none text-[#E2C799]">AE</span>
        </div>

        <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
          <span className="font-mono text-xs text-[#E2C799] uppercase tracking-[0.5em] mb-12 block">
            AETHERION BRAND DIRECTIVE
          </span>

          {/* Staggered sequential editorial lines */}
          <blockquote className="font-display text-3xl sm:text-5xl md:text-6xl text-[#E5E5E5] leading-tight select-none">
            <span className="block font-light italic text-[#8E8E93] mb-4">
              “We do not build vehicles.
            </span>
            <span className="block font-light tracking-tight uppercase">
              We engineer{" "}
              <span className="text-[#E2C799] font-normal not-italic">
                moving art
              </span>.”
            </span>
          </blockquote>

          <div className="w-16 h-[1px] bg-[#E2C799] my-12" />

          <p className="font-sans text-sm md:text-base text-[#8E8E93] tracking-widest max-w-xl leading-relaxed font-light">
            Each machine is restricted to the absolute standards of hydrodynamic physics, single-assembly precision, and bespoke cosmetic specification. Hand-finished in Molsheim, France.
          </p>
        </div>
      </section>

      {/* 2. SPECIFICATION RESERVATION FORM (Final CTA) */}
      <section className="relative min-h-screen w-full flex flex-col justify-center bg-[#0D0D0F] text-[#E5E5E5] px-6 md:px-12 py-24 select-none">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Side Visual Configuration Render */}
          <div className="lg:col-span-12 xl:col-span-6 flex flex-col items-center relative gap-8">
            <div className="relative w-full aspect-[16/10] overflow-hidden border border-[#E5E5E5]/10 bg-[#1A1A1E]/10 p-2 rounded-2xl">
              
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#E2C799]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#E2C799]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#E2C799]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#E2C799]" />

              <img
                src={exteriorImage}
                alt="Aetherion config preview"
                className="w-full h-full object-cover opacity-80 rounded-xl"
                referrerPolicy="no-referrer"
              />

              <div className="absolute bottom-4 left-4 bg-[#0D0D0F]/95 border border-[#E2C799]/20 p-4 rounded-xl text-left backdrop-blur-md">
                <span className="font-mono text-[8px] text-[#E2C799] tracking-widest block font-bold leading-none uppercase">
                  FINISH SELECTION
                </span>
                <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold block mt-1 leading-none">
                  {activeTheme === "carbon" && "STEALTH TWILL CARBON"}
                  {activeTheme === "aurora" && "AURORA CRYSTIFIED GOLD"}
                  {activeTheme === "cyber" && "CHROMATIC DEEP PURPLE"}
                </span>
              </div>
            </div>

            {/* Selector list */}
            <div className="w-full grid grid-cols-3 gap-3">
              {configThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    audio.playSweep();
                    onThemeChange(theme.id);
                  }}
                  onMouseEnter={handleFocus}
                  className={`p-4 border text-left flex flex-col justify-between transition-all duration-300 rounded-2xl cursor-pointer ${
                    activeTheme === theme.id
                      ? "border-[#E2C799] bg-[#E2C799]/5"
                      : "border-[#E5E5E5]/10 bg-[#1A1A1E]/10"
                  }`}
                >
                  <span className={`text-[9px] font-mono tracking-widest uppercase block ${
                    activeTheme === theme.id ? "text-[#E2C799]" : "text-[#8E8E93]"
                  }`}>
                    THEME 0{theme.id === "carbon" ? "1" : theme.id === "aurora" ? "2" : "3"}
                  </span>
                  <span className="text-xs font-sans tracking-wide font-medium mt-1 leading-none">
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side reservation portal */}
          <div className="lg:col-span-12 xl:col-span-6 flex flex-col items-start text-left z-20 w-full">
            <span className="font-mono text-[10px] text-[#E2C799] uppercase tracking-[0.4em] mb-4">
              ENTER THE EXTRAORDINARY
            </span>
            <h2 className="font-display font-light italic text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none uppercase mb-6">
              SECURE YOUR <br />
              <span className="text-[#E2C799] font-normal not-italic">PROTOTYPE</span>
            </h2>

            {!reserveSubmitted ? (
              <form onSubmit={handleReserve} className="w-full flex flex-col gap-6">
                <p className="text-[#8E8E93] text-sm leading-relaxed tracking-wider font-sans font-light">
                  Aetherion concepts are exclusively allocated. By filling in your design criteria below, your request enters the verification queue with our concierge team.
                </p>

                {/* Input 1 */}
                <div className="flex flex-col border-b border-[#E5E5E5]/10 focus-within:border-[#E2C799] py-2 transition-all">
                  <label className="font-mono text-[8px] text-[#8E8E93] uppercase tracking-widest">
                    CONFIGURATOR NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    placeholder="Enter your name"
                    onFocus={handleFocus}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-transparent border-none outline-none text-[#E5E5E5] placeholder-[#51515B] text-sm mt-1.5 font-sans tracking-widest uppercase leading-none w-full"
                  />
                </div>

                {/* Input 2 */}
                <div className="flex flex-col border-b border-[#E5E5E5]/10 focus-within:border-[#E2C799] py-2 transition-all">
                  <label className="font-mono text-[8px] text-[#8E8E93] uppercase tracking-widest">
                    CRYPTOGRAPHIC PROTOCOL EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    placeholder="concierge@aetherion.com"
                    onFocus={handleFocus}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="bg-transparent border-none outline-none text-[#E5E5E5] placeholder-[#51515B] text-sm mt-1.5 font-sans tracking-widest leading-none w-full"
                  />
                </div>

                {/* Button Reservation */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 border border-[#E2C799] bg-transparent text-[#E2C799] hover:bg-[#E2C799] hover:text-[#0D0D0F] font-sans text-xs uppercase tracking-[0.3em] font-medium py-4 cursor-pointer text-center w-full flex items-center justify-center gap-3 transition-all duration-500 rounded-full disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border border-t-transparent border-[#E2C799] rounded-full animate-spin" />
                      <span>ALLOCATING SYNC...</span>
                    </>
                  ) : (
                    <>
                      <span>ENTER THE FUTURE</span>
                      <ChevronRight className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="w-full flex flex-col items-center justify-center p-8 border border-[#E2C799]/20 bg-[#E2C799]/5 text-center relative py-16 rounded-2xl">
                <CheckCircle2 className="w-16 h-16 text-[#E2C799] mb-6 animate-pulse" />
                <h3 className="font-display text-2xl text-white font-medium uppercase tracking-wider mb-2">
                  ALLOCATION IN QUEUE
                </h3>
                <span className="font-mono text-xs text-[#E2C799] uppercase tracking-widest block mb-4">
                  RESERVATION RECORDED SECURE
                </span>
                <p className="text-[#8E8E93] text-xs leading-relaxed max-w-sm tracking-wider font-sans font-light">
                  Welcome to Aetherion, <span className="text-white font-semibold">{userName.toUpperCase()}</span>. An algorithmic invite and custom secure vector link is transmitting to <span className="text-white underline">{userEmail}</span>. Please verify your terminal console.
                </p>
                
                <button
                  onClick={() => {
                    audio.playTick();
                    setReserveSubmitted(false);
                    setUserName("");
                    setUserEmail("");
                  }}
                  className="mt-8 font-mono text-[9px] text-[#E2C799] uppercase tracking-wider border-b border-[#E2C799]/45 hover:border-[#E2C799]/100 transition-colors cursor-pointer"
                >
                  Configure another specimen
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
};
