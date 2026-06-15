import { DEFAULT_SETTINGS } from "./settings";

export function kwFromPanels(panels: number, panelWatts: number): number {
  return (panels * panelWatts) / 1000;
}

/** Bimonthly units one panel generates at given monthly benchmark */
export function generationPerPanelBimonthly(
  panelWatts: number,
  monthlyUnitsPerKw: number,
): number {
  return (panelWatts / 1000) * monthlyUnitsPerKw * 2;
}

export function sqftPerPanel(
  panelWatts: number,
  sqftPerKw: number = DEFAULT_SETTINGS.sqftPerKw,
): number {
  return sqftPerKw * (panelWatts / 1000);
}

export function maxPanelsOnRoof(
  roofSqFt: number,
  panelWatts: number,
  sqftPerKw: number = DEFAULT_SETTINGS.sqftPerKw,
): number {
  const perPanel = sqftPerPanel(panelWatts, sqftPerKw);
  if (perPanel <= 0) return 0;
  return Math.floor(roofSqFt / perPanel);
}

export function formatSystemLabel(panels: number, panelWatts: number): string {
  const kw = kwFromPanels(panels, panelWatts);
  return `${panels} panels (${kw} kW)`;
}

export type PanelSystemOptions = {
  minimum: { panels: number; kw: number };
  recommended: { panels: number; kw: number };
  maximum: { panels: number; kw: number };
};

/**
 * Minimum: 2 panels below recommended (budget).
 * Recommended: ~85% of consumption offset.
 * Maximum: 100% consumption offset (+1 panel buffer if tied).
 */
export function getPanelSystemOptions(
  bimonthlyUnits: number,
  panelWatts: number,
  monthlyUnitsPerKw: number,
): PanelSystemOptions {
  const genPerPanel = generationPerPanelBimonthly(panelWatts, monthlyUnitsPerKw);

  if (bimonthlyUnits <= 0 || panelWatts <= 0 || genPerPanel <= 0) {
    return {
      minimum: { panels: 0, kw: 0 },
      recommended: { panels: 0, kw: 0 },
      maximum: { panels: 0, kw: 0 },
    };
  }

  const maxPanels = Math.max(1, Math.ceil(bimonthlyUnits / genPerPanel));
  const recPanels = Math.max(1, Math.ceil((bimonthlyUnits * 0.85) / genPerPanel));
  const minPanels = Math.max(1, recPanels - 2);

  const maximumPanels = maxPanels > recPanels ? maxPanels : maxPanels + 1;

  return {
    minimum: {
      panels: minPanels,
      kw: kwFromPanels(minPanels, panelWatts),
    },
    recommended: {
      panels: recPanels,
      kw: kwFromPanels(recPanels, panelWatts),
    },
    maximum: {
      panels: maximumPanels,
      kw: kwFromPanels(maximumPanels, panelWatts),
    },
  };
}
