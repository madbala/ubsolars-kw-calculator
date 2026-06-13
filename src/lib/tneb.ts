export const BIMONTHLY_DAYS = 60;
export const UNITS_PER_KW_PER_DAY = 4;

export function calculateEnergyCharge(units: number): number {
  if (units <= 0) return 0;

  if (units <= 500) {
    let charge = 0;
    if (units > 200) charge += Math.min(units - 200, 200) * 4.95;
    if (units > 400) charge += Math.min(units - 400, 100) * 6.65;
    return charge;
  }

  let charge = 0;
  if (units > 100) charge += Math.min(units - 100, 300) * 4.95;
  if (units > 400) charge += Math.min(units - 400, 100) * 6.65;
  if (units > 500) charge += Math.min(units - 500, 100) * 8.8;
  if (units > 600) charge += Math.min(units - 600, 200) * 9.95;
  if (units > 800) charge += Math.min(units - 800, 200) * 11.05;
  if (units > 1000) charge += (units - 1000) * 12.15;
  return charge;
}

export function estimateUnitsFromBill(billAmount: number): {
  units: number;
  estimatedCharge: number;
} {
  if (billAmount <= 0) return { units: 0, estimatedCharge: 0 };

  let high = 500;
  while (calculateEnergyCharge(high) < billAmount) {
    high *= 2;
    if (high > 500_000) break;
  }

  let low = 0;
  let upper = high;

  while (low < upper) {
    const mid = Math.floor((low + upper) / 2);
    if (calculateEnergyCharge(mid) < billAmount) low = mid + 1;
    else upper = mid;
  }

  let bestUnits = low;
  let bestDiff = Math.abs(calculateEnergyCharge(low) - billAmount);

  if (low > 0) {
    const prevDiff = Math.abs(calculateEnergyCharge(low - 1) - billAmount);
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
    const diff = Math.abs(calculateEnergyCharge(units) - billAmount);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestUnits = units;
    }
  }

  return {
    units: bestUnits,
    estimatedCharge: calculateEnergyCharge(bestUnits),
  };
}

export function getSlabBreakdown(units: number): Array<{
  range: string;
  unitsInSlab: number;
  rate: number;
  charge: number;
}> {
  if (units <= 0) return [];

  const rows: Array<{
    range: string;
    unitsInSlab: number;
    rate: number;
    charge: number;
  }> = [];

  const add = (range: string, count: number, rate: number) => {
    if (count > 0) rows.push({ range, unitsInSlab: count, rate, charge: count * rate });
  };

  if (units <= 500) {
    add("1 – 200", Math.min(units, 200), 0);
    if (units > 200) add("201 – 400", Math.min(units - 200, 200), 4.95);
    if (units > 400) add("401 – 500", units - 400, 6.65);
  } else {
    add("1 – 100", 100, 0);
    add("101 – 400", Math.min(units - 100, 300), 4.95);
    if (units > 400) add("401 – 500", Math.min(units - 400, 100), 6.65);
    if (units > 500) add("501 – 600", Math.min(units - 500, 100), 8.8);
    if (units > 600) add("601 – 800", Math.min(units - 600, 200), 9.95);
    if (units > 800) add("801 – 1000", Math.min(units - 800, 200), 11.05);
    if (units > 1000) add("1001+", units - 1000, 12.15);
  }

  return rows;
}

export function suggestKW(bimonthlyUnits: number): number {
  if (bimonthlyUnits <= 0) return 0;
  const kw = bimonthlyUnits / BIMONTHLY_DAYS / UNITS_PER_KW_PER_DAY;
  return Math.ceil(kw * 10) / 10;
}

export function unitStats(values: number[]) {
  if (values.length === 0) return { min: 0, max: 0, average: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = values.reduce((s, v) => s + v, 0) / values.length;
  return { min, max, average: Math.round(average * 10) / 10 };
}

export function solarOffsetUnits(kw: number): number {
  return kw * UNITS_PER_KW_PER_DAY * BIMONTHLY_DAYS;
}

export function simulateAtKw(bimonthlyUnits: number, kw: number) {
  const baselineBill = calculateEnergyCharge(bimonthlyUnits);
  const offset = solarOffsetUnits(kw);
  const gridUnits = Math.max(0, bimonthlyUnits - offset);
  const bill = calculateEnergyCharge(gridUnits);
  return {
    kw,
    offset,
    gridUnits,
    bill,
    savings: baselineBill - bill,
    baselineBill,
  };
}
