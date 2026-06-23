import { jsPDF } from "jspdf";
import type { ProposalData } from "@/types/solar";
import type { AppSettings } from "@/utils/settings";

const BRAND = { r: 15, g: 118, b: 110 }; // teal-700
const ACCENT = { r: 217, g: 119, b: 6 }; // amber-600
const INK = { r: 15, g: 23, b: 42 };
const MUTED = { r: 100, g: 116, b: 139 };
const LIGHT_BG = { r: 240, g: 253, b: 250 };

function formatRs(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;
}

function drawHeader(doc: jsPDF, company: AppSettings["company"], pageWidth: number): number {
  doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  doc.rect(0, 0, pageWidth, 42, "F");
  doc.setFillColor(ACCENT.r, ACCENT.g, ACCENT.b);
  doc.rect(0, 42, pageWidth, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(company.name, 14, 16);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Rooftop Solar Proposal", 14, 24);

  doc.setFontSize(8);
  doc.text(
    `${company.addressLine1}, ${company.addressLine2} - ${company.pincode}`,
    14,
    31,
  );
  doc.text(`${company.phone1}  |  ${company.phone2}`, 14, 37);

  doc.setFontSize(8);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, pageWidth - 14, 16, {
    align: "right",
  });

  return 52;
}

function drawSectionTitle(doc: jsPDF, title: string, y: number, margin: number): number {
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(BRAND.r, BRAND.g, BRAND.b);
  doc.text(title, margin, y);
  return y + 6;
}

function drawHighlightBox(
  doc: jsPDF,
  y: number,
  margin: number,
  pageWidth: number,
  kw: number,
  panels: number,
  panelWatts: number,
): number {
  const boxH = 22;
  doc.setFillColor(LIGHT_BG.r, LIGHT_BG.g, LIGHT_BG.b);
  doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, "FD");

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(ACCENT.r, ACCENT.g, ACCENT.b);
  doc.text(`${kw} kW`, margin + 6, y + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(`${panels} panels x ${panelWatts} W`, margin + 6, y + 17);

  return y + boxH + 8;
}

type TableRow = [string, string];

function drawTable(
  doc: jsPDF,
  startY: number,
  rows: TableRow[],
  margin: number,
  pageWidth: number,
): number {
  const tableW = pageWidth - margin * 2;
  const col1W = tableW * 0.48;
  const rowH = 8.5;
  let y = startY;

  rows.forEach(([label, value], i) => {
    if (y > 265) {
      doc.addPage();
      y = 20;
    }
    const fill = i % 2 === 0 ? 248 : 255;
    doc.setFillColor(fill, fill, fill);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, tableW, rowH, "FD");
    doc.line(margin + col1W, y, margin + col1W, y + rowH);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(label, margin + 3, y + 5.8);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(INK.r, INK.g, INK.b);
    doc.text(String(value), margin + col1W + 3, y + 5.8, {
      maxWidth: tableW - col1W - 6,
    });

    y += rowH;
  });

  return y + 6;
}

function drawCashflowBanner(
  doc: jsPDF,
  y: number,
  margin: number,
  pageWidth: number,
  data: ProposalData,
): number {
  const boxH = 28;
  const positive = data.netMonthlyCashflow >= 0;

  doc.setFillColor(positive ? 236 : 254, positive ? 253 : 242, positive ? 245 : 242);
  doc.setDrawColor(positive ? 34 : 220, positive ? 197 : 38, positive ? 94 : 38);
  doc.roundedRect(margin, y, pageWidth - margin * 2, boxH, 3, 3, "FD");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(INK.r, INK.g, INK.b);
  doc.text("Monthly cashflow (avg.)", margin + 6, y + 8);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(
    `Solar savings ${formatRs(data.monthlySavings)}  -  EMI ${formatRs(data.emi)}  =  Net ${data.netMonthlyCashflow >= 0 ? "+" : ""}${formatRs(data.netMonthlyCashflow)}`,
    margin + 6,
    y + 15,
  );

  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(
    "TNEB is billed every 2 months — monthly figures are averages for easy comparison with loan EMI.",
    margin + 6,
    y + 22,
  );

  return y + boxH + 8;
}

export function generateProposalPdf(data: ProposalData, settings: AppSettings): void {
  const { company, proposalValidDays, roiYears } = settings;
  const doc = new jsPDF();
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = drawHeader(doc, company, pageWidth);

  if (data.lead) {
    y = drawSectionTitle(doc, "Customer", y, margin);
    y = drawTable(
      doc,
      y,
      [
        ["Name", data.lead.name],
        ["Phone", data.lead.phone],
        ["Location", data.lead.location],
      ],
      margin,
      pageWidth,
    );
  }

  y = drawSectionTitle(doc, "Recommended system", y, margin);
  y = drawHighlightBox(
    doc,
    y,
    margin,
    pageWidth,
    data.suggestedKW,
    data.panelCount,
    data.panelWatts,
  );

  y = drawSectionTitle(doc, "Your consumption & generation", y, margin);
  y = drawTable(
    doc,
    y,
    [
      ["Bimonthly consumption", `${data.bimonthlyUnits} units`],
      ["Est. solar generation (bimonthly)", `${Math.round(data.solarGeneration)} units`],
      ["Roof area provided", data.roofAreaSqFt ? `${data.roofAreaSqFt} sq.ft` : "Not provided"],
      ["System size range considered", `${data.systemMin} – ${data.systemMax} kW`],
    ],
    margin,
    pageWidth,
  );

  y = drawSectionTitle(doc, "Electricity bill impact", y, margin);
  y = drawTable(
    doc,
    y,
    [
      ["Current EB bill (bimonthly)", formatRs(data.energyCharge)],
      ["Avg. monthly EB bill", formatRs(data.monthlyBillAvg)],
      ["EB bill after solar (bimonthly)", formatRs(data.postSolarBill)],
      ["Bimonthly savings", formatRs(data.bimonthlySavings)],
      ["Avg. monthly savings", formatRs(data.monthlySavings)],
    ],
    margin,
    pageWidth,
  );

  y = drawSectionTitle(doc, "Investment & loan", y, margin);
  y = drawTable(
    doc,
    y,
    [
      ["Total system cost", formatRs(data.totalCost)],
      ["PM Surya Ghar subsidy (est.)", formatRs(data.subsidy)],
      ["Net investment", formatRs(data.netInvestment)],
      [`Monthly EMI (${data.interestRate}% / ${data.tenureYears} yr)`, formatRs(data.emi)],
      ["Payback period (est.)", `${data.paybackYears.toFixed(1)} years`],
      [`${roiYears}-year cumulative savings`, formatRs(data.totalSavings25Years)],
    ],
    margin,
    pageWidth,
  );

  y = drawCashflowBanner(doc, y, margin, pageWidth, data);

  const footerY = Math.min(y + 4, 280);
  doc.setDrawColor(BRAND.r, BRAND.g, BRAND.b);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(
    `Valid for ${proposalValidDays} days from date above. TNEB LT-IA energy charge estimate only (excludes fixed charges, FSA & taxes). Actual generation varies by roof, shading & season.`,
    margin,
    footerY + 5,
    { maxWidth: pageWidth - margin * 2 },
  );
  doc.text(`© ${new Date().getFullYear()} ${company.name}. All rights reserved.`, margin, footerY + 14);

  doc.save(`${company.name.replace(/\s+/g, "-")}-proposal-${data.suggestedKW}kW.pdf`);
}
