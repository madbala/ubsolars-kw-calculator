"use client";

import { useEffect, useMemo, useState } from "react";
import BillBreakdown from "./BillBreakdown";
import SubsidyCard from "./SubsidyCard";
import EmiCalculator from "./EmiCalculator";
import RoiDashboard from "./RoiDashboard";
import RoofCalculator from "./RoofCalculator";
import SystemRecommendations from "./SystemRecommendations";
import PostSolarEstimate from "./PostSolarEstimate";
import ComparisonTable from "./ComparisonTable";
import SolarScore from "./SolarScore";
import LeadForm from "./LeadForm";
import { useCalculator } from "@/context/CalculatorContext";
import {
  calculateEmi,
  calculateRoi,
  calculateSubsidy,
  calculateSystemCost,
  computePostSolarSummary,
  effectiveUnitRate,
  getSolarScore,
  getSystemRecommendations,
} from "@/utils/calculations";
import type { SolarResultContext } from "@/types/solar";

type Props = SolarResultContext;

export default function ResultEnhancements({
  bimonthlyUnits,
  suggestedKW,
  energyCharge,
}: Props) {
  const { panelWatts, settings } = useCalculator();

  const systems = useMemo(
    () => getSystemRecommendations(bimonthlyUnits, panelWatts, settings),
    [bimonthlyUnits, panelWatts, settings],
  );

  const [selectedKw, setSelectedKw] = useState(suggestedKW);
  const [selectedPanels, setSelectedPanels] = useState(systems.recommended.panels);
  const [interestRate, setInterestRate] = useState(settings.defaultInterestRate);
  const [tenureYears, setTenureYears] = useState(settings.defaultTenureYears);
  const [roofArea, setRoofArea] = useState(0);

  useEffect(() => {
    setInterestRate(settings.defaultInterestRate);
    setTenureYears(settings.defaultTenureYears);
  }, [settings.defaultInterestRate, settings.defaultTenureYears]);

  useEffect(() => {
    setSelectedKw(suggestedKW);
    setSelectedPanels(systems.recommended.panels);
  }, [suggestedKW, systems.recommended.panels]);

  const postSolar = useMemo(
    () => computePostSolarSummary(bimonthlyUnits, selectedKw, settings),
    [bimonthlyUnits, selectedKw, settings],
  );

  const financials = useMemo(() => {
    const totalCost = calculateSystemCost(selectedKw, settings.costPerKw);
    const subsidy = calculateSubsidy(selectedKw, settings);
    const netInvestment = Math.max(0, totalCost - subsidy);
    const emi = calculateEmi(netInvestment, interestRate, tenureYears);
    const unitRate = effectiveUnitRate(bimonthlyUnits, settings);
    const roi = calculateRoi(selectedKw, unitRate, netInvestment, settings);
    return { totalCost, subsidy, netInvestment, emi, roi, unitRate };
  }, [selectedKw, settings, interestRate, tenureYears, bimonthlyUnits]);

  const score = getSolarScore(
    bimonthlyUnits,
    selectedKw,
    roofArea || undefined,
    panelWatts,
    settings.sqftPerKw,
  );

  const proposal = {
    bimonthlyUnits,
    suggestedKW: selectedKw,
    panelWatts,
    panelCount: selectedPanels,
    energyCharge,
    totalCost: financials.totalCost,
    subsidy: financials.subsidy,
    netInvestment: financials.netInvestment,
    emi: financials.emi,
    paybackYears: financials.roi.paybackYears,
    totalSavings25Years: financials.roi.totalSavings25Years,
    monthlySavings: postSolar.monthlySavings,
    postSolarBill: postSolar.newBill,
    roofAreaSqFt: roofArea,
    systemMin: systems.minimum.kw,
    systemMax: systems.maximum.kw,
  };

  function handleSelect(kw: number, panels: number) {
    setSelectedKw(kw);
    setSelectedPanels(panels);
  }

  return (
    <div className="mt-4 space-y-4 border-t border-amber-200 pt-4">
      <SystemRecommendations
        systems={systems}
        selectedKw={selectedKw}
        onSelect={handleSelect}
      />

      <PostSolarEstimate
        bimonthlyUnits={bimonthlyUnits}
        systemKw={selectedKw}
        panelCount={selectedPanels}
      />

      <ComparisonTable
        unitsBefore={bimonthlyUnits}
        unitsAfter={postSolar.postSolarUnits}
        billBefore={postSolar.currentBill}
        billAfter={postSolar.newBill}
        savings={postSolar.bimonthlySavings}
      />

      <BillBreakdown units={bimonthlyUnits} />

      <SubsidyCard
        systemKw={selectedKw}
        totalCost={financials.totalCost}
        subsidy={financials.subsidy}
        netInvestment={financials.netInvestment}
      />

      <EmiCalculator
        netInvestment={financials.netInvestment}
        bimonthlyBill={energyCharge}
        interestRate={interestRate}
        tenureYears={tenureYears}
        defaultInterestRate={settings.defaultInterestRate}
        defaultTenureYears={settings.defaultTenureYears}
        onInterestRateChange={setInterestRate}
        onTenureYearsChange={setTenureYears}
      />

      <RoiDashboard roi={financials.roi} roiYears={settings.roiYears} />

      <RoofCalculator
        suggestedKw={selectedKw}
        roofArea={roofArea}
        onRoofAreaChange={setRoofArea}
      />

      <SolarScore score={score} />

      <LeadForm proposal={proposal} companyName={settings.company.name} />
    </div>
  );
}
