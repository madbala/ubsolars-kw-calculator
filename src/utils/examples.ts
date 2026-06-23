import { calculateEnergyCharge, calculateSolarGeneration } from "./calculations";
import { installerKwSteps, kwFromPanels, PANELS_PER_PAIR } from "./panels";
import type { AppSettings } from "./settings";
import { DEFAULT_SETTINGS } from "./settings";

/** Reference system size used for placeholders and examples */
export const BASE_KW = 3;

export function exampleBimonthlyUnits(
  settings: AppSettings = DEFAULT_SETTINGS,
): number {
  return Math.round(calculateSolarGeneration(BASE_KW, settings.monthlyUnitsPerKw));
}

export function exampleBillAmount(settings: AppSettings = DEFAULT_SETTINGS): number {
  return Math.round(calculateEnergyCharge(exampleBimonthlyUnits(settings), settings));
}

export function exampleBillPlaceholder(settings: AppSettings = DEFAULT_SETTINGS): string {
  return `e.g. ${exampleBillAmount(settings).toLocaleString("en-IN")}`;
}

export function exampleUnitsPlaceholder(settings: AppSettings = DEFAULT_SETTINGS): string {
  return `e.g. ${exampleBimonthlyUnits(settings).toLocaleString("en-IN")}`;
}

export function exampleInstallerKwSteps(
  panelWatts: number,
  count = 3,
): number[] {
  return installerKwSteps(panelWatts, count);
}

export function examplePairLabel(panelWatts: number, pairs = 3): string {
  const panels = pairs * PANELS_PER_PAIR;
  return `${panels} panels (${kwFromPanels(panels, panelWatts)} kW)`;
}
