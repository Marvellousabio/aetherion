/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Thermometer, Wind, RefreshCw, BarChart2, ShieldAlert, Cpu } from "lucide-react";
import { audio } from "./AudioEngine";

interface CellData {
  id: string;
  row: number;
  col: number;
  moduleIndex: number;
  baseEfficiency: number; // 0.90 to 0.99
  baseTemp: number; // 25°C to 42°C
  resistance: number; // 0.05 to 0.15 Ohm
}

export const BatteryHeatMap: React.FC = () => {
  // Modes: "thermal" or "efficiency" or "soc"
  const [viewMode, setViewMode] = useState<"thermal" | "efficiency" | "soc">("thermal");
  const [dischargeRate, setDischargeRate] = useState<number>(3.5); // 0.5C to 10.0C (Sport Mode/Track load)
  const [coolantFlow, setCoolantFlow] = useState<number>(50); // 10% to 100% pump flowrate
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<"normal" | "thermal_flush" | "balancing" | "stress">("normal");
  const [simProgress, setSimProgress] = useState<number>(100);
  const [systemHealth, setSystemHealth] = useState<string>("OPTIMAL_STABILIZED");

  // Create grid cells
  const moduleNames = ["Front Quad Core", "Midspine Array L", "Midspine Array R", "Rear Booster pack"];
  const [cells, setCells] = useState<CellData[]>(() => {
    const list: CellData[] = [];
    // 4 modules
    for (let m = 0; m < 4; m++) {
      // 4x4 layout of cells in each module
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          list.push({
            id: `m${m}-r${r}-c${c}`,
            row: r,
            col: c,
            moduleIndex: m,
            baseEfficiency: 0.94 + Math.random() * 0.05 - (m === 3 ? 0.02 : 0), // rear gets hot/less efficient
            baseTemp: 28 + Math.random() * 8 + (m === 3 ? 4 : 0), // rear pack is slightly warmer
            resistance: 0.06 + Math.random() * 0.08,
          });
        }
      }
    }
    return list;
  });

  // Dynamically calculate cell properties based on discharge rate, coolant flow, and current simulations
  const getCellStats = (cell: CellData) => {
    // Basic thermal formula:
    // Heat output increases non-linearly with discharge rate (I^2 * R heating).
    // Coolant flow reduces temperature but has diminishing returns and is less effective on central core columns (r===1, col===1,2).
    const heatGeneration = (dischargeRate * dischargeRate * cell.resistance * 1.45);
    const coolingFactor = (coolantFlow / 100) * 16.0 * (1.2 - (cell.row === 1 && (cell.col === 1 || cell.col === 2) ? 0.45 : 0.1));
    
    let simulatedHeatModifier = 0;
    let simulatedEffModifier = 0;

    if (activeSimulation === "thermal_flush") {
      // Deep flush cools cells significantly below normal
      const factor = simProgress / 100; // starts at 0 goes to 1
      simulatedHeatModifier = -12 * (1 - factor);
      simulatedEffModifier = 0.02 * (1 - factor);
    } else if (activeSimulation === "balancing") {
      // Equalizes core resistances/temps
      const factor = simProgress / 100;
      simulatedHeatModifier = -3 * (1 - factor);
      simulatedEffModifier = 0.01 * (1 - factor);
    } else if (activeSimulation === "stress") {
      // Rapid core thermal build-up
      const factor = simProgress / 100;
      simulatedHeatModifier = (26 * (1 - factor) * (cell.row === 1 ? 1.5 : 1.0));
      simulatedEffModifier = -0.06 * (1 - factor);
    }

    let calculatedTemp = cell.baseTemp + heatGeneration - coolingFactor + simulatedHeatModifier;
    
    // Clamp temperature within safe boundaries
    calculatedTemp = Math.max(18, Math.min(88, calculatedTemp));

    // Efficiency falls with temperature
    let calculatedEff = cell.baseEfficiency - (calculatedTemp - 25) * 0.0022 + simulatedEffModifier;
    calculatedEff = Math.max(0.72, Math.min(0.998, calculatedEff));

    // State of charge (balancing factor)
    // Simulates minor SOC deviations
    let calculatedSoc = 94.2 - (cell.resistance * 15) - (calculatedTemp - 25) * 0.15;
    if (activeSimulation === "balancing") {
      calculatedSoc = 98.6 - (1 - (simProgress/100)) * (cell.resistance * 15);
    }
    calculatedSoc = Math.max(30, Math.min(100, calculatedSoc));

    return {
      temp: calculatedTemp,
      efficiency: calculatedEff,
      soc: calculatedSoc,
    };
  };

  // Run countdown animations for stress test / flush triggers
  useEffect(() => {
    if (activeSimulation === "normal") return;

    const interval = setInterval(() => {
      setSimProgress((prev) => {
        if (prev <= 0) {
          setActiveSimulation("normal");
          audio.playSweep(); // elegant sweeps signal complete
          return 100;
        }
        return prev - 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [activeSimulation]);

  // Adjust global system status based on temperatures
  useEffect(() => {
    let maxTemp = 0;
    cells.forEach((c) => {
      const stats = getCellStats(c);
      if (stats.temp > maxTemp) maxTemp = stats.temp;
    });

    if (maxTemp > 65) {
      setSystemHealth("THERMAL_CRITICAL_REDUCE_LOAD");
    } else if (maxTemp > 48) {
      setSystemHealth("ELEVATED_HEATING_ACTIVE_COOLING");
    } else {
      setSystemHealth("NOMINAL_STEADY_STATE");
    }
  }, [cells, dischargeRate, coolantFlow, activeSimulation, simProgress]);

  // Cell color helper for layout
  const getCellColor = (cell: CellData) => {
    const stats = getCellStats(cell);
    if (viewMode === "thermal") {
      // From Cool Cyan (20C) to safety Green (30C) to warning Amber (45C) to dangerous Scarlet Red (70C+)
      const t = stats.temp;
      if (t < 28) return "rgba(34, 211, 238, 0.4)"; // Cyan
      if (t < 38) return "rgba(16, 185, 129, 0.55)"; // Green
      if (t < 52) return "rgba(245, 158, 11, 0.75)"; // Amber
      return "rgba(239, 68, 68, 0.95)"; // Scarlet Red
    } else if (viewMode === "efficiency") {
      // Green is high efficiency (95%+), Amber/Red is low efficiency
      const eff = stats.efficiency;
      if (eff > 0.96) return "rgba(16, 185, 129, 0.65)";
      if (eff > 0.92) return "rgba(245, 158, 11, 0.55)";
      return "rgba(239, 68, 68, 0.75)";
    } else {
      // SOC: balance. Bright cyan represent high charge state, dim blue is lower
      const charge = stats.soc;
      if (charge > 95) return "rgba(0, 242, 254, 0.7)";
      if (charge > 85) return "rgba(0, 168, 255, 0.55)";
      return "rgba(0, 100, 255, 0.35)";
    }
  };

  // Click triggers
  const triggerThermalFlush = () => {
    if (activeSimulation !== "normal") return;
    audio.playSweep();
    setActiveSimulation("thermal_flush");
    setSimProgress(100);
    setCoolantFlow(100); // Maximise cooling pumps automatically!
  };

  const triggerGridBalancing = () => {
    if (activeSimulation !== "normal") return;
    audio.playTick();
    setActiveSimulation("balancing");
    setSimProgress(100);
  };

  const triggerStressSimulation = () => {
    if (activeSimulation !== "normal") return;
    audio.playSweep();
    setActiveSimulation("stress");
    setSimProgress(100);
    setDischargeRate(9.8); // Kick up to track sports level!
    setCoolantFlow(20); // Simulates coolant fault or lower flowrate initially
  };

  const selectedCell = cells.find((c) => c.id === selectedCellId);
  const selectedCellStats = selectedCell ? getCellStats(selectedCell) : null;

  // Calculate high level metrics to display at the top of the heatmap
  const getGlobalMetrics = () => {
    let totalTemp = 0;
    let maxTemp = 0;
    let totalEff = 0;
    
    cells.forEach((c) => {
      const stats = getCellStats(c);
      totalTemp += stats.temp;
      totalEff += stats.efficiency;
      if (stats.temp > maxTemp) maxTemp = stats.temp;
    });

    const avgTemp = totalTemp / cells.length;
    const avgEff = totalEff / cells.length;

    return {
      avgTemp: avgTemp.toFixed(1),
      maxTemp: maxTemp.toFixed(1),
      avgEff: (avgEff * 100).toFixed(2),
    };
  };

  const globalMetrics = getGlobalMetrics();

  // Pulse rate derived from discharge rates (the higher the crop, the faster the pulse indicators)
  const pulseDuration = Math.max(0.2, 2.5 - (dischargeRate * 0.22));

  return (
    <div
      id="battery-interactive-blueprint"
      className="absolute inset-0 bg-[#0A0A0C]/95 z-40 flex flex-col justify-between p-4 sm:p-5 select-none font-sans overflow-y-auto"
    >
      {/* Header Diagnostic Strip */}
      <div className="flex justify-between items-start border-b border-[#2A2A30] pb-2.5">
        <div>
          <span className="font-mono text-[8px] text-[#E2C799] uppercase tracking-[0.25em] flex items-center gap-1">
            <Cpu className="w-2.5 h-2.5 animate-pulse text-[#E2C799]" />
            ELECTROCHEMICAL ANALYTICS CHANNEL
          </span>
          <h4 className="text-sm font-sans tracking-tight font-medium text-white uppercase mt-0.5">
            AETHERION SOLID-STATE V4 HEATMAP
          </h4>
        </div>
        <div className="text-right font-mono text-[9px]">
          <span className="text-[#8E8E93]">CORE_HEALTH: </span>
          <span
            className={
              systemHealth.includes("CRITICAL")
                ? "text-red-400 font-semibold"
                : systemHealth.includes("ACTIVE")
                ? "text-yellow-400"
                : "text-emerald-400"
            }
          >
            {systemHealth}
          </span>
        </div>
      </div>

      {/* Global Quick Dashboard View */}
      <div className="grid grid-cols-3 gap-3 my-3">
        <div className="bg-[#141417]/90 border border-[#232328] rounded-xl p-2.5 flex flex-col">
          <span className="font-mono text-[7px] text-[#8E8E93] tracking-widest uppercase flex items-center gap-1">
            <Thermometer className="w-2.5 h-2.5 text-[#E2C799]" /> AVG TEMP
          </span>
          <span className="text-base font-mono font-medium text-white mt-1">
            {globalMetrics.avgTemp}°C
          </span>
        </div>
        <div className="bg-[#141417]/90 border border-[#232328] rounded-xl p-2.5 flex flex-col">
          <span className="font-mono text-[7px] text-[#8E8E93] tracking-widest uppercase flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5 text-red-400" /> MAX TEMP
          </span>
          <span className="text-base font-mono font-medium text-red-400 mt-1">
            {globalMetrics.maxTemp}°C
          </span>
        </div>
        <div className="bg-[#141417]/90 border border-[#232328] rounded-xl p-2.5 flex flex-col">
          <span className="font-mono text-[7px] text-[#8E8E93] tracking-widest uppercase flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-[#E2C799]" /> NET EFFICIENCY
          </span>
          <span className="text-base font-mono font-medium text-emerald-400 mt-1">
            {globalMetrics.avgEff}%
          </span>
        </div>
      </div>

      {/* Main Core Layout Grid: Cells and Controller Dual Pane */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center justify-center flex-1 my-2">
        
        {/* LEFT COLUMN: THE CELLULAR MATRIX CORES */}
        <div className="md:col-span-8 flex flex-col gap-3">
          {/* View Modes Selector tabs */}
          <div className="flex gap-1.5 border-b border-[#232328] pb-1.5">
            {(["thermal", "efficiency", "soc"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  audio.playTick();
                }}
                className={`px-3 py-1 text-[9px] font-mono tracking-widest uppercase rounded-lg border transition-all cursor-pointer ${
                  viewMode === mode
                    ? "bg-[#E2C799]/15 text-[#E2C799] border-[#E2C799]"
                    : "bg-transparent text-[#8E8E93] border-[#2A2A30] hover:text-white"
                }`}
              >
                {mode === "thermal" && "Thermal Gradient"}
                {mode === "efficiency" && "Energy efficiency"}
                {mode === "soc" && "Charge symmetry (SOC)"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3.5 relative overflow-hidden">
            {/* Visual simulation status bar */}
            {activeSimulation !== "normal" && (
              <div className="absolute inset-x-0 top-0 h-1 bg-[#1A1A1E] rounded-full overflow-hidden z-20">
                <motion.div
                  className={`h-full ${
                    activeSimulation === "thermal_flush"
                      ? "bg-cyan-400"
                      : activeSimulation === "balancing"
                      ? "bg-purple-400"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${simProgress}%` }}
                />
              </div>
            )}

            {/* Render 4 electrochemical array modules */}
            {moduleNames.map((modName, mIdx) => (
              <div
                key={mIdx}
                className="bg-[#101012]/80 border border-[#242429] rounded-xl p-2.5 relative flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-2 border-b border-[#1C1C20] pb-1">
                  <span className="font-mono text-[7.5px] text-[#A2A2A9] tracking-wider uppercase block">
                    MOD_0{mIdx + 1}: {modName}
                  </span>
                  <span className="font-mono text-[7px] text-[#E2C799]/80">SOLID DECK</span>
                </div>

                {/* 3x4 layout of cells within the module */}
                <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                  {cells
                    .filter((c) => c.moduleIndex === mIdx)
                    .map((cell) => {
                      const color = getCellColor(cell);
                      const stats = getCellStats(cell);
                      const isSelected = selectedCellId === cell.id;

                      return (
                        <div
                          key={cell.id}
                          className="relative aspect-square"
                          onMouseEnter={() => {
                            setSelectedCellId(cell.id);
                            audio.playTick();
                          }}
                          onMouseLeave={() => setSelectedCellId(null)}
                        >
                          <motion.div
                            id={`cell-${cell.id}`}
                            className={`w-full h-full rounded cursor-crosshair transition-all flex flex-col items-center justify-center relative ${
                              isSelected ? "ring-2 ring-white ring-offset-1 ring-offset-[#0D0D0F]" : ""
                            }`}
                            style={{
                              backgroundColor: color,
                              boxShadow: isSelected
                                ? `0 0 14px ${color}`
                                : `0 0 4px ${color}`,
                            }}
                            animate={{
                              opacity: [0.88, 1.0, 0.88],
                            }}
                            transition={{
                              duration: pulseDuration,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            {/* Inner active ion directional arrow when highly active */}
                            {dischargeRate > 4 && (
                              <motion.div
                                className="w-1 h-3 rounded-full bg-white opacity-40"
                                animate={{
                                  y: [-4, 4],
                                  opacity: [0, 0.8, 0],
                                }}
                                transition={{
                                  duration: pulseDuration / 2,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                            )}
                          </motion.div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          {/* Thermal Flush Visual Indicator Sweep */}
          <AnimatePresence>
            {activeSimulation === "thermal_flush" && (
              <motion.div
                initial={{ y: "-100%", opacity: 0.8 }}
                animate={{ y: "150%", opacity: 0.1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-x-0 h-4 bg-cyan-400/20 blur-md pointer-events-none z-10"
              />
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE TUNING AND DETAILS */}
        <div className="md:col-span-4 flex flex-col gap-3 h-full justify-between">
          
          {/* Interactive sliders for dynamic heatmap simulation feedback */}
          <div className="bg-[#141417]/95 border border-[#232328] rounded-xl p-3.5 flex flex-col gap-3">
            <span className="font-mono text-[8px] text-[#E2C799] tracking-widest uppercase border-b border-[#2A2A30] pb-2 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" /> SIMULATION TUNERS
            </span>

            {/* Discharge/Load Rate slider */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[9px] font-mono mb-1.5">
                <span className="text-[#8E8E93]">CORES VOLTAGE DENSITY</span>
                <span className="text-white font-medium">{dischargeRate.toFixed(1)}C (LOAD)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.1"
                value={dischargeRate}
                onChange={(e) => {
                  setDischargeRate(parseFloat(e.target.value));
                  if (Math.random() > 0.7) audio.playTick();
                }}
                className="w-full h-1 bg-[#232328] rounded-lg appearance-none cursor-pointer accent-[#E2C799]"
              />
              <div className="flex justify-between font-mono text-[7px] text-[#555] mt-1.5">
                <span>0.5C (ECO DOCK)</span>
                <span>10.0C (SPORT MAX)</span>
              </div>
            </div>

            {/* Coolant manifold pump rate slider */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-[9px] font-mono mb-1.5">
                <span className="text-[#8E8E93]">CRYOGENIC COOLANT FLOW</span>
                <span className="text-cyan-400 font-medium">{coolantFlow}% PUMPRATE</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={coolantFlow}
                onChange={(e) => {
                  setCoolantFlow(parseInt(e.target.value));
                  if (Math.random() > 0.7) audio.playTick();
                }}
                className="w-full h-1 bg-[#232328] rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between font-mono text-[7px] text-[#555] mt-1.5">
                <span>10% (LO_FLOW)</span>
                <span>100% (CRYO_BOOST)</span>
              </div>
            </div>
          </div>

          {/* Quick System Action Stimulations */}
          <div className="bg-[#141417]/95 border border-[#232328] rounded-xl p-3.5 flex flex-col gap-2">
            <span className="font-mono text-[8px] text-[#A2A2A9] tracking-widest uppercase border-b border-[#2A2A30] pb-2">
              DIAGNOSTIC TEST COMMANDS
            </span>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={triggerThermalFlush}
                disabled={activeSimulation !== "normal"}
                className={`py-1.5 px-2 font-mono text-[8.5px] uppercase tracking-wider rounded-lg border transition-all cursor-pointer text-center ${
                  activeSimulation === "thermal_flush"
                    ? "bg-cyan-500/20 text-cyan-400 border-cyan-400"
                    : "bg-transparent text-[#8E8E93] border-[#2A2A30] hover:border-cyan-400 hover:text-white disabled:opacity-40"
                }`}
              >
                {activeSimulation === "thermal_flush" ? "Flushing..." : "Thermal Flush"}
              </button>
              <button
                onClick={triggerGridBalancing}
                disabled={activeSimulation !== "normal"}
                className={`py-1.5 px-2 font-mono text-[8.5px] uppercase tracking-wider rounded-lg border transition-all cursor-pointer text-center ${
                  activeSimulation === "balancing"
                    ? "bg-purple-500/20 text-purple-400 border-purple-400"
                    : "bg-transparent text-[#8E8E93] border-[#2A2A30] hover:border-purple-400 hover:text-white disabled:opacity-40"
                }`}
              >
                {activeSimulation === "balancing" ? "Balancing..." : "V-Balancing"}
              </button>
            </div>
            <button
              onClick={triggerStressSimulation}
              disabled={activeSimulation !== "normal"}
              className="w-full mt-1.5 py-2 px-2.5 bg-[#451010]/20 text-red-400 hover:bg-[#681818]/30 border border-red-500/30 hover:border-red-500/60 rounded-xl transition-all cursor-pointer font-mono text-[9px] font-medium tracking-wide uppercase disabled:opacity-40"
            >
              Simulate Track Stress Test
            </button>
          </div>

          {/* Selected cell local diagnostic telemetry readout */}
          <div className="bg-[#101012] border border-[#232328] rounded-xl p-3 flex flex-col justify-between flex-1 min-h-[110px]">
            {selectedCell && selectedCellStats ? (
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-center text-[7.5px] font-mono uppercase text-[#E2C799] tracking-widest border-b border-[#242429] pb-1.5">
                    <span>CELL ID: {selectedCell.id}</span>
                    <span>Zone: c{selectedCell.col}_r{selectedCell.row}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex flex-col">
                      <span className="font-mono text-[7px] text-[#8E8E93] tracking-wider uppercase">LOCAL HEAT</span>
                      <span className="font-mono text-xs font-semibold text-white">{selectedCellStats.temp.toFixed(1)}°C</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[7px] text-[#8E8E93] tracking-wider uppercase">INTERNAL R</span>
                      <span className="font-mono text-xs font-semibold text-white">{selectedCell.resistance.toFixed(3)} Ω</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[7px] text-[#8E8E93] tracking-wider uppercase">LOCAL EFFICIENCY</span>
                      <span className="font-mono text-xs font-semibold text-emerald-400">{(selectedCellStats.efficiency * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[7px] text-[#8E8E93] tracking-wider uppercase">STATE OF CHARGE</span>
                      <span className="font-mono text-xs font-semibold text-cyan-400">{selectedCellStats.soc.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                <p className="font-mono text-[7px] text-[#555] uppercase mt-2 select-none">
                  INTELLIGENT WEAK_CELL PREDICTION CHANNEL: NOMINAL
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-4">
                <Thermometer className="w-6 h-6 text-[#2A2A30] animate-pulse mb-1.5" />
                <span className="font-mono text-[8px] text-[#8E8E93] uppercase tracking-wider">
                  Hover over any battery cell module node above to stream local diagnostics
                </span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Footer System Status Banner */}
      <div className="flex items-center justify-between border-t border-[#232328] pt-2 mt-1 select-none font-mono text-[8px] text-[#8E8E93] tracking-widest">
        <span>AETHERION INFRASTRUCTURE CHASSIS INTERLINK</span>
        <span>STREAM_LINK: ON</span>
      </div>
    </div>
  );
};
