import {
  getPanelSystemOptions,
  kwFromPanels,
  maxPanelsOnRoof,
  type PanelSystemOptions,
} from "./panels";
import { DEFAULT_SETTINGS, type AppSettings } from "./settings";

export type { PanelSystemOptions };

export type SlabRow = {
  range: string;
  unitsInSlab: number;
  rate: number;
  charge: number;
};

export type SolarScoreLevel = "highly" | "moderate" | "not_ideal";

export function calculateEnergyCharge(
  units: number,
  settings: AppSettings = DEFAULT_SETTINGS,
): number {
  if (units <= 0) return 0;
  const u = settings.tnebUnder500;
  const o = settings.tnebOver500;

  if (units <= 500) {
    let charge = 0;
    if (units > u.freeUpTo) {
      charge += Math.min(units - u.freeUpTo, 200) * u.rate201to400;
    }
    if (units > 400) charge += Math.min(units - 400, 100) * u.rate401to500;
    return charge;
  }

  let charge = 0;
  if (units > o.freeUpTo) {
    charge += Math.min(units - o.freeUpTo, 300) * o.rate101to400;
  }
  if (units > 400) charge += Math.min(units - 400, 100) * o.rate401to500;
  if (units > 500) charge += Math.min(units - 500, 100) * o.rate501to600;
  if (units > 600) charge += Math.min(units - 600, 200) * o.rate601to800;
  if (units > 800) charge += Math.min(units - 800, 200) * o.rate801to1000;
  if (units > 1000) charge += (units - 1000) * o.rate1001plus;
  return charge;
}

export function calculatePostSolarBill(
  units: number,
  settings?: AppSettings,
): number {
  return calculateEnergyCharge(units, settings);
}

export function calculatePostSolarUnits(
  unitsConsumed: number,
  solarGeneration: number,
): number {
  return Math.max(unitsConsumed - solarGeneration, 0);
}

/** Bimonthly generation from installed kW (MNRE ~135 units/kW/month benchmark) */
export function calculateSolarGeneration(
  kw: number,
  monthlyUnitsPerKw: number = DEFAULT_SETTINGS.monthlyUnitsPerKw,
): number {
  if (kw <= 0) return 0;
  return kw * monthlyUnitsPerKw * 2;
}

export function billToUnits(
  billAmount: number,
  settings: AppSettings = DEFAULT_SETTINGS,
): { units: number; estimatedCharge: number } {
  if (billAmount <= 0) return { units: 0, estimatedCharge: 0 };

  let high = 500;
  while (calculateEnergyCharge(high, settings) < billAmount) {
    high *= 2;
    if (high > 500_000) break;
  }

  let low = 0;
  let upper = high;

  while (low < upper) {
    const mid = Math.floor((low + upper) / 2);
    if (calculateEnergyCharge(mid, settings) < billAmount) low = mid + 1;
    else upper = mid;
  }

  let bestUnits = low;
  let bestDiff = Math.abs(calculateEnergyCharge(low, settings) - billAmount);

  if (low > 0) {
    const prevDiff = Math.abs(calculateEnergyCharge(low - 1, settings) - billAmount);
    if (prevDiff < bestDiff) {
      bestUnits = low - 1;
      bestDiff = prevDiff;
    }
  }

  for (
    let units = Math.max(0, bestUnits - 3);
    units <= Math.min(high, bestUnits + 3);
    units++
  ) {
    const diff = Math.abs(calculateEnergyCharge(units, settings) - billAmount);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestUnits = units;
    }
  }

  return {
    units: bestUnits,
    estimatedCharge: calculateEnergyCharge(bestUnits, settings),
  };
}

export function unitsToSlabBreakdown(
  units: number,
  settings: AppSettings = DEFAULT_SETTINGS,
): SlabRow[] {
  if (units <= 0) return [];
  const u = settings.tnebUnder500;
  const o = settings.tnebOver500;
  const rows: SlabRow[] = [];

  const add = (range: string, count: number, rate: number) => {
    if (count <= 0) return;
    rows.push({ range, unitsInSlab: count, rate, charge: count * rate });
  };

  if (units <= 500) {
    add(`1 – ${u.freeUpTo}`, Math.min(units, u.freeUpTo), 0);
    if (units > u.freeUpTo) {
      add("201 – 400", Math.min(units - u.freeUpTo, 200), u.rate201to400);
    }
    if (units > 400) add("401 – 500", units - 400, u.rate401to500);
  } else {
    add(`1 – ${o.freeUpTo}`, o.freeUpTo, 0);
    add("101 – 400", Math.min(units - o.freeUpTo, 300), o.rate101to400);
    if (units > 400) add("401 – 500", Math.min(units - 400, 100), o.rate401to500);
    if (units > 500) add("501 – 600", Math.min(units - 500, 100), o.rate501to600);
    if (units > 600) add("601 – 800", Math.min(units - 600, 200), o.rate601to800);
    if (units > 800) add("801 – 1000", Math.min(units - 800, 200), o.rate801to1000);
    if (units > 1000) add("1001+", units - 1000, o.rate1001plus);
  }

  return rows;
}

/** Panel-aligned recommended kW */
export function solarSizing(
  bimonthlyUnits: number,
  panelWatts: number,
  settings: AppSettings = DEFAULT_SETTINGS,
): number {
  const opts = getPanelSystemOptions(
    bimonthlyUnits,
    panelWatts,
    settings.monthlyUnitsPerKw,
  );
  return opts.recommended.kw;
}

export function getSystemRecommendations(
  bimonthlyUnits: number,
  panelWatts: number,
  settings: AppSettings = DEFAULT_SETTINGS,
): PanelSystemOptions {
  return getPanelSystemOptions(
    bimonthlyUnits,
    panelWatts,
    settings.monthlyUnitsPerKw,
  );
}

export function unitStats(values: number[]) {
  if (values.length === 0) return { min: 0, max: 0, average: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = values.reduce((s, v) => s + v, 0) / values.length;
  return { min, max, average: Math.round(average * 10) / 10 };
}

export function solarOffsetUnits(
  kw: number,
  monthlyUnitsPerKw: number = DEFAULT_SETTINGS.monthlyUnitsPerKw,
): number {
  return calculateSolarGeneration(kw, monthlyUnitsPerKw);
}

export function simulateAtKw(
  bimonthlyUnits: number,
  kw: number,
  settings: AppSettings = DEFAULT_SETTINGS,
) {
  const baselineBill = calculateEnergyCharge(bimonthlyUnits, settings);
  const offset = solarOffsetUnits(kw, settings.monthlyUnitsPerKw);
  const gridUnits = calculatePostSolarUnits(bimonthlyUnits, offset);
  const bill = calculatePostSolarBill(gridUnits, settings);
  return {
    kw,
    offset,
    gridUnits,
    bill,
    savings: baselineBill - bill,
    baselineBill,
  };
}

export function effectiveUnitRate(
  units: number,
  settings: AppSettings = DEFAULT_SETTINGS,
): number {
  if (units <= 0) return 0;
  return calculateEnergyCharge(units, settings) / units;
}

export function calculateSubsidy(
  systemKw: number,
  settings: AppSettings = DEFAULT_SETTINGS,
): number {
  if (systemKw <= 0) return 0;
  const s = settings.subsidy;
  if (systemKw <= s.tier1MaxKw) return s.tier1Amount;
  if (systemKw <= s.tier2MaxKw) return s.tier2Amount;
  return s.tier3Amount;
}

export function calculateSystemCost(
  systemKw: number,
  costPerKw: number,
): number {
  return systemKw * costPerKw;
}

export function calculateEmi(
  principal: number,
  annualRatePercent: number,
  tenureYears: number,
): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  const n = tenureYears * 12;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return principal / n;
  const factor = Math.pow(1 + r, n);
  return (principal * r * factor) / (factor - 1);
}

export type RoiResult = {
  paybackYears: number;
  totalSavings25Years: number;
  yearlySavings: { year: number; savings: number; cumulative: number }[];
};

export function calculateRoi(
  systemKw: number,
  unitRate: number,
  netInvestment: number,
  settings: AppSettings = DEFAULT_SETTINGS,
): RoiResult {
  const { roiYears, annualSavingsGrowthPercent, unitsPerKwYear } = settings;
  const growth = annualSavingsGrowthPercent / 100;
  const baseAnnualSavings = systemKw * unitsPerKwYear * unitRate;
  const yearlySavings: RoiResult["yearlySavings"] = [];
  let cumulative = 0;
  let paybackYears = roiYears;

  for (let year = 1; year <= roiYears; year++) {
    const savings = baseAnnualSavings * Math.pow(1 + growth, year - 1);
    cumulative += savings;
    yearlySavings.push({ year, savings, cumulative });
    if (paybackYears === roiYears && cumulative >= netInvestment && netInvestment > 0) {
      const prev = yearlySavings[year - 2]?.cumulative ?? 0;
      const fraction = (netInvestment - prev) / (savings || 1);
      paybackYears = year - 1 + Math.min(Math.max(fraction, 0), 1);
    }
  }

  return {
    paybackYears: netInvestment > 0 ? paybackYears : 0,
    totalSavings25Years: cumulative,
    yearlySavings,
  };
}

export function roofMaxKw(
  roofAreaSqFt: number,
  panelWatts: number,
  sqftPerKw: number = DEFAULT_SETTINGS.sqftPerKw,
): number {
  const panels = maxPanelsOnRoof(roofAreaSqFt, panelWatts, sqftPerKw);
  return kwFromPanels(panels, panelWatts);
}

export function getSolarScore(
  bimonthlyUnits: number,
  recommendedKw: number,
  roofAreaSqFt: number | undefined,
  panelWatts: number,
  sqftPerKw: number = DEFAULT_SETTINGS.sqftPerKw,
): SolarScoreLevel {
  let score: SolarScoreLevel = "not_ideal";

  if (bimonthlyUnits >= 500) score = "highly";
  else if (bimonthlyUnits >= 250) score = "moderate";

  if (roofAreaSqFt && roofAreaSqFt > 0) {
    const maxKw = roofMaxKw(roofAreaSqFt, panelWatts, sqftPerKw);
    if (maxKw < recommendedKw) return "not_ideal";
    if (maxKw >= recommendedKw && bimonthlyUnits >= 400) return "highly";
  }

  return score;
}

export function computePostSolarSummary(
  bimonthlyUnits: number,
  systemKw: number,
  settings: AppSettings = DEFAULT_SETTINGS,
) {
  const currentBill = calculateEnergyCharge(bimonthlyUnits, settings);
  const generation = calculateSolarGeneration(systemKw, settings.monthlyUnitsPerKw);
  const postSolarUnits = calculatePostSolarUnits(bimonthlyUnits, generation);
  const newBill = calculatePostSolarBill(postSolarUnits, settings);
  const bimonthlySavings = currentBill - newBill;

  return {
    currentBill,
    newBill,
    bimonthlyUnits,
    postSolarUnits,
    generation,
    bimonthlySavings,
    monthlySavings: bimonthlySavings / 2,
  };
}

