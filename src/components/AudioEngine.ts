/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private idleOscillator: OscillatorNode | null = null;
  private idleGain: GainNode | null = null;

  constructor() {
    // Audio Context is initialized lazily after first user interaction
  }

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    this.init();
    
    if (this.isMuted) {
      this.stopIdleHum();
    } else {
      this.startIdleHum();
    }
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  // Soft, mechanically precise ticking sound for UI haptic hovers
  public playTick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(2000, this.ctx.currentTime); // High-frequency crisp click
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.008, this.ctx.currentTime); // Extremely subtle volume
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio Context Error", e);
    }
  }

  // Elegant luxury electric motor startup sound
  // Deep sub-octave tone ramping upwards with magnetic resonance
  public playStartup() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Deep harmonic frequencies
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(45, this.ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 1.2);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(45.5, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(90.5, this.ctx.currentTime + 1.2);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(80, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      
      osc1.stop(this.ctx.currentTime + 1.5);
      osc2.stop(this.ctx.currentTime + 1.5);
    } catch (e) {
      console.warn(e);
    }
  }

  // A soft, mysterious cinema sweep when sections transition or modes swap
  public playSweep() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.8);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.9);
    } catch (e) {
      console.warn(e);
    }
  }

  // Continuous subtle high-voltage humming representation of inactive status
  public startIdleHum() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.idleOscillator) return;

      this.idleOscillator = this.ctx.createOscillator();
      this.idleGain = this.ctx.createGain();
      
      const filter = this.ctx.createBiquadFilter();

      this.idleOscillator.type = "triangle";
      this.idleOscillator.frequency.value = 55; // A1 low frequency drone

      filter.type = "lowpass";
      filter.frequency.value = 110;

      this.idleGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.idleGain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 1.0); // fade in gracefully

      this.idleOscillator.connect(filter);
      filter.connect(this.idleGain);
      this.idleGain.connect(this.ctx.destination);

      this.idleOscillator.start();
    } catch (e) {
      console.warn(e);
    }
  }

  public stopIdleHum() {
    try {
      if (this.idleOscillator) {
        this.idleOscillator.stop();
        this.idleOscillator.disconnect();
        this.idleOscillator = null;
      }
      if (this.idleGain) {
        this.idleGain.disconnect();
        this.idleGain = null;
      }
    } catch (e) {
      console.warn(e);
    }
  }
}

// Export singleton instance
export const audio = new AudioEngine();
