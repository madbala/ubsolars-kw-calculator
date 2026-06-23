export type SolarResultContext = {
  bimonthlyUnits: number;
  suggestedKW: number;
  energyCharge: number;
};

export type LeadInfo = {
  name: string;
  phone: string;
  location: string;
};

export type ProposalData = {
  bimonthlyUnits: number;
  suggestedKW: number;
  panelWatts: number;
  panelCount: number;
  energyCharge: number;
  totalCost: number;
  subsidy: number;
  netInvestment: number;
  emi: number;
  interestRate: number;
  tenureYears: number;
  paybackYears: number;
  totalSavings25Years: number;
  monthlySavings: number;
  bimonthlySavings: number;
  monthlyBillAvg: number;
  netMonthlyCashflow: number;
  postSolarBill: number;
  solarGeneration: number;
  roofAreaSqFt?: number;
  systemMin?: number;
  systemMax?: number;
  lead?: LeadInfo;
};
