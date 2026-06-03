/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Shield, Cpu, Activity } from "lucide-react";
import { audio } from "./AudioEngine";
import { BodyThemeType } from "../types";

interface HeaderProps {
  activeTheme: BodyThemeType;
  onThemeChange: (theme: BodyThemeType) => void;
  systemConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTheme,
  onThemeChange,
  systemConnected,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    // Elegant system clock ticking representation
    const updateClock = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioToggle = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audio.toggleMute(nextMute);
    if (!nextMute) {
      audio.playStartup();
    }
  };

  const handleModeHover = () => {
    audio.playTick();
  };

  const handleModeClick = (theme: BodyThemeType) => {
    audio.playSweep();
    onThemeChange(theme);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-[#1A1A1E]/80 bg-[#0D0D0F]/70 backdrop-blur-md px-6 md:px-12 py-4 flex items-center justify-between transition-colors duration-500">
      {/* Brand & Left Status Indicator */}
      <div className="flex items-center gap-6">
        <a 
          href="#" 
          className="font-sans font-light tracking-[0.25em] text-lg text-[#E5E5E5] hover:text-[#E2C799] transition-colors"
          onMouseEnter={handleModeHover}
        >
          AETHERION
        </a>
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-[#E2C799]/10 bg-[#E2C799]/5 text-[#E2C799] font-mono text-[9px] tracking-widest uppercase">
          <Activity className="w-2.5 h-2.5 animate-pulse" />
          <span>STAT: {systemConnected ? "SYNC_OK" : "INIT"}</span>
        </div>
      </div>

      {/* Center Theme Multi-Selectors */}
      <div className="flex gap-1 bg-[#1A1A1E]/60 p-1 rounded-full border border-[#E5E5E5]/10">
        {(["carbon", "aurora", "cyber"] as BodyThemeType[]).map((t) => (
          <button
            key={t}
            onClick={() => handleModeClick(t)}
            onMouseEnter={handleModeHover}
            className={`px-4 py-1 rounded-full text-[9px] font-sans tracking-widest uppercase transition-all duration-500 cursor-pointer ${
              activeTheme === t
                ? "bg-[#E2C799] text-[#0D0D0F] font-semibold shadow-lg shadow-[#E2C799]/10"
                : "text-[#8E8E93] hover:text-[#E5E5E5]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Right Controls Area: Clock & Sound */}
      <div className="flex items-center gap-6">
        {/* Futuristic Dashboard Chronometer */}
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="font-mono text-[7px] text-[#8E8E93] uppercase tracking-widest leading-none">Chrono UTC</span>
          <span className="font-mono text-xs text-[#E5E5E5] tracking-widest mt-0.5 font-medium">{timeStr || "00:00:00"}</span>
        </div>

        {/* Haptic Synthesizer Audio Controller button */}
        <button
          onClick={handleAudioToggle}
          onMouseEnter={handleModeHover}
          className={`flex items-center justify-center p-2.5 rounded-full border transition-all duration-300 ${
            !isMuted
              ? "border-[#E2C799] bg-[#E2C799]/10 text-[#E2C799]"
              : "border-[#1A1A1E] text-[#8E8E93] hover:text-[#E5E5E5] hover:border-[#2A2A30]"
          }`}
          title={isMuted ? "Unmute Ambient HUD Synthesizer" : "Mute Sound FX"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 translate-y-0.0" />
          ) : (
            <Volume2 className="w-4 h-4 animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
