/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TelemetryStat {
  id: string;
  label: string;
  value: string;
  unit: string;
  targetValue: number;
  decimals: number;
  info: string;
}

export interface EngineeringPart {
  id: string;
  name: string;
  title: string;
  description: string;
  specifications: string[];
  efficiency: string;
  voltage?: string;
  materials?: string;
  position: { x: number; y: number; z: number }; // 3D coordinates for highlight focus
}

export type BodyThemeType = "carbon" | "aurora" | "cyber";

export interface CustomizationOption {
  id: BodyThemeType;
  name: string;
  color: string; // CSS color string
  accentColor: string;
  description: string;
  alloyDetails: string;
}
