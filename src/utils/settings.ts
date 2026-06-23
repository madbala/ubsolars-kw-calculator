export type CompanyInfo = {
  name: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  phone1: string;
  phone2: string;
};

export type TnebUnder500 = {
  freeUpTo: number;
  rate201to400: number;
  rate401to500: number;
};

export type TnebOver500 = {
  freeUpTo: number;
  rate101to400: number;
  rate401to500: number;
  rate501to600: number;
  rate601to800: number;
  rate801to1000: number;
  rate1001plus: number;
};

export type SubsidySettings = {
  tier1MaxKw: number;
  tier1Amount: number;
  tier2MaxKw: number;
  tier2Amount: number;
  tier3Amount: number;
};

export type AppSettings = {
  company: CompanyInfo;
  proposalValidDays: number;
  sqftPerKw: number;
  defaultInterestRate: number;
  defaultTenureYears: number;
  roiYears: number;
  annualSavingsGrowthPercent: number;
  unitsPerKwYear: number;
  tnebUnder500: TnebUnder500;
  tnebOver500: TnebOver500;
  subsidy: SubsidySettings;
  costPerKw: number;
  monthlyUnitsPerKw: number;
};

export type StoredSettings = AppSettings & { updatedAt?: string };

export const DEFAULT_SETTINGS: AppSettings = {
  company: {
    name: "UB Solars",
    addressLine1: "34A, Dr.Besant Road, Vijayalakshmi Theatre(opp)",
    addressLine2: "Kumbakonam",
    pincode: "612001",
    phone1: "+91 7200100864",
    phone2: "+91 9597552232",
  },
  proposalValidDays: 7,
  sqftPerKw: 80,
  defaultInterestRate: 10,
  defaultTenureYears: 5,
  roiYears: 25,
  annualSavingsGrowthPercent: 3,
  unitsPerKwYear: 1500,
  tnebUnder500: {
    freeUpTo: 200,
    rate201to400: 4.95,
    rate401to500: 6.65,
  },
  tnebOver500: {
    freeUpTo: 100,
    rate101to400: 4.95,
    rate401to500: 6.65,
    rate501to600: 8.8,
    rate601to800: 9.95,
    rate801to1000: 11.05,
    rate1001plus: 12.15,
  },
  subsidy: {
    tier1MaxKw: 1.9,
    tier1Amount: 30_000,
    tier2MaxKw: 2.9,
    tier2Amount: 60_000,
    tier3Amount: 78_000,
  },
  costPerKw: 66_000,
  monthlyUnitsPerKw: 135,
};

export function mergeSettings(partial: Partial<AppSettings>): AppSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...partial,
    company: { ...DEFAULT_SETTINGS.company, ...partial.company },
    tnebUnder500: { ...DEFAULT_SETTINGS.tnebUnder500, ...partial.tnebUnder500 },
    tnebOver500: { ...DEFAULT_SETTINGS.tnebOver500, ...partial.tnebOver500 },
    subsidy: { ...DEFAULT_SETTINGS.subsidy, ...partial.subsidy },
  };
}
