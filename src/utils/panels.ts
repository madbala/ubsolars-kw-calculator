import { DEFAULT_SETTINGS } from "./settings";

/** Installers sell in pairs of panels (minimum 2 panels per system) */
export const PANELS_PER_PAIR = 2;
export const MIN_INSTALLER_PANELS = 2;

export function kwFromPanels(panels: number, panelWatts: number): number {
  return Math.round(((panels * panelWatts) / 1000) * 100) / 100;
}

/** Snap raw panel count up to an even installer count (2, 4, 6, …) */
export function snapToInstallerPanels(rawPanels: number): number {
  if (rawPanels <= 0) return 0;
  const pairs = Math.ceil(rawPanels / PANELS_PER_PAIR);
  return Math.max(MIN_INSTALLER_PANELS, pairs * PANELS_PER_PAIR);
}

/** Panels needed for a target kW, snapped to installer pairs */
export function panelsForTargetKw(targetKw: number, panelWatts: number): number {
  if (targetKw <= 0 || panelWatts <= 0) return 0;
  const raw = Math.ceil((targetKw * 1000) / panelWatts);
  return snapToInstallerPanels(raw);
}

/** First N installer kW steps: 2 panels, 4 panels, 6 panels, … */
export function installerKwSteps(panelWatts: number, count = 3): number[] {
  return Array.from({ length: count }, (_, i) =>
    kwFromPanels((i + 1) * PANELS_PER_PAIR, panelWatts),
  );
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
  const raw = Math.floor(roofSqFt / perPanel);
  return raw >= MIN_INSTALLER_PANELS ? snapToInstallerPanels(raw) : 0;
}

export function formatSystemLabel(panels: number, panelWatts: number): string {
  const kw = kwFromPanels(panels, panelWatts);
  return `${kw} kW · ${panels} panels`;
}

export type PanelSystemOptions = {
  minimum: { panels: number; kw: number };
  recommended: { panels: number; kw: number };
  maximum: { panels: number; kw: number };
};

function panelsFromUnits(
  bimonthlyUnits: number,
  fraction: number,
  panelWatts: number,
  monthlyUnitsPerKw: number,
): number {
  const genPerPanel = generationPerPanelBimonthly(panelWatts, monthlyUnitsPerKw);
  if (genPerPanel <= 0) return 0;
  const raw = Math.ceil((bimonthlyUnits * fraction) / genPerPanel);
  return snapToInstallerPanels(raw);
}

/**
 * Minimum: 2 panel-pairs below recommended (budget).
 * Recommended: ~85% of consumption offset.
 * Maximum: 100% consumption offset (+1 pair buffer if tied).
 * All sizes use even panel counts (2, 4, 6, …).
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

  const recPanels = panelsFromUnits(bimonthlyUnits, 0.85, panelWatts, monthlyUnitsPerKw);
  const maxPanelsRaw = Math.ceil(bimonthlyUnits / genPerPanel);
  const maxPanelsSnapped = snapToInstallerPanels(maxPanelsRaw);
  const maximumPanels =
    maxPanelsSnapped > recPanels ? maxPanelsSnapped : snapToInstallerPanels(maxPanelsRaw + PANELS_PER_PAIR);

  const minPanels = Math.max(
    MIN_INSTALLER_PANELS,
    snapToInstallerPanels(recPanels - PANELS_PER_PAIR * 2),
  );

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
