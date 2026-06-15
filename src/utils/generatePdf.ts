import { jsPDF } from "jspdf";
import type { ProposalData } from "@/types/solar";
import { loadSettings } from "./settings";

function formatRs(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString("en-IN")}`;
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
  const col1W = tableW * 0.42;
  const rowH = 8;
  let y = startY;

  rows.forEach(([label, value], i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(i % 2 === 0 ? 245 : 255, i % 2 === 0 ? 247 : 255, i % 2 === 0 ? 250 : 255);
    doc.rect(margin, y, tableW, rowH, "FD");
    doc.line(margin + col1W, y, margin + col1W, y + rowH);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(label, margin + 2, y + 5.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(String(value), margin + col1W + 2, y + 5.5, { maxWidth: tableW - col1W - 4 });

    y += rowH;
  });

  return y + 8;
}

export function generateProposalPdf(data: ProposalData): void {
  const { company, proposalValidDays, roiYears } = loadSettings();
  const doc = new jsPDF();
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 83, 9);
  doc.text("SOLAR PROPOSAL", pageWidth / 2, y, { align: "center" });
  y += 7;

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(company.name, pageWidth / 2, y, { align: "center" });
  y += 5;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(company.addressLine1, pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.text(`${company.addressLine2} - ${company.pincode}`, pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.text(`Tel: ${company.phone1}  |  ${company.phone2}`, pageWidth / 2, y, { align: "center" });
  y += 4;
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, pageWidth / 2, y, { align: "center" });
  y += 10;

  if (data.lead) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text("Customer Details", margin, y);
    y += 5;
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

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("System Summary", margin, y);
  y += 5;

  y = drawTable(
    doc,
    y,
    [
      ["Bimonthly consumption", `${data.bimonthlyUnits} units`],
      ["System size", `${data.panelCount} x ${data.panelWatts} W (${data.suggestedKW} kW)`],
      ["Roof area entered", data.roofAreaSqFt ? `${data.roofAreaSqFt} sq.ft` : "Not provided"],
      ["Current EB bill (est.)", formatRs(data.energyCharge)],
      ["Bill after solar (est.)", formatRs(data.postSolarBill)],
      ["Monthly savings (est.)", formatRs(data.monthlySavings)],
    ],
    margin,
    pageWidth,
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Investment", margin, y);
  y += 5;

  y = drawTable(
    doc,
    y,
    [
      ["Total system cost", formatRs(data.totalCost)],
      ["Government subsidy", formatRs(data.subsidy)],
      ["Net investment", formatRs(data.netInvestment)],
      ["Monthly EMI (est.)", formatRs(data.emi)],
      ["Payback period", `${data.paybackYears.toFixed(1)} years`],
      [`${roiYears}-year savings (est.)`, formatRs(data.totalSavings25Years)],
    ],
    margin,
    pageWidth,
  );

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Rates mentioned are valid only for ${proposalValidDays} days from the date above.`,
    margin,
    y,
  );
  y += 4;
  doc.text("TNEB slab-based estimate. Actual generation and savings may vary.", margin, y);

  doc.save(`${company.name.replace(/\s+/g, "-")}-proposal-${data.suggestedKW}kW.pdf`);
}
