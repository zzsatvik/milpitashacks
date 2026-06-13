import type { LawnAnalysis, LawnZone, ZoneActionPlan } from "@terraview/shared";
import { jsPDF } from "jspdf";

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    doc.addPage();
    return 20;
  }
  return y;
}

function writeActionPlan(
  doc: jsPDF,
  plan: ZoneActionPlan,
  x: number,
  y: number,
  maxWidth: number,
): number {
  let cy = ensureSpace(doc, y, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("What to get:", x, cy);
  cy += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const item of plan.items) {
    cy = ensureSpace(doc, cy, 12);
    cy = addWrappedText(
      doc,
      `• ${item.name}${item.quantity ? ` (${item.quantity})` : ""} — ${item.purpose}`,
      x + 2,
      cy,
      maxWidth - 2,
      4,
    );
    cy += 2;
  }

  cy = ensureSpace(doc, cy, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Where to buy:", x, cy);
  cy += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const store of plan.where_to_buy) {
    cy = ensureSpace(doc, cy, 14);
    const parts = [
      store.store_name,
      store.distance ? store.distance : null,
      store.address_hint,
      store.notes,
    ].filter(Boolean);
    cy = addWrappedText(doc, `• ${parts.join(" — ")}`, x + 2, cy, maxWidth - 2, 4);
    cy += 2;
  }

  cy = ensureSpace(doc, cy, 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Steps:", x, cy);
  cy += 5;
  doc.setFont("helvetica", "normal");
  plan.steps.forEach((step, i) => {
    cy = ensureSpace(doc, cy, 10);
    cy = addWrappedText(doc, `${i + 1}. ${step}`, x + 2, cy, maxWidth - 2, 4);
    cy += 2;
  });

  return cy + 4;
}

function writeZone(doc: jsPDF, zone: LawnZone, index: number, y: number): number {
  const margin = 14;
  const maxWidth = 182;
  let cy = ensureSpace(doc, y, 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`${index}. ${zone.label} [${zone.severity}]`, margin, cy);
  cy += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  cy = addWrappedText(doc, zone.issue, margin, cy, maxWidth, 5);
  cy += 2;
  cy = addWrappedText(
    doc,
    `Recommendation: ${zone.recommendation}`,
    margin,
    cy,
    maxWidth,
    5,
  );
  cy += 2;
  if (zone.after_suggestion) {
    cy = addWrappedText(
      doc,
      `Swap: ${zone.after_suggestion}`,
      margin,
      cy,
      maxWidth,
      5,
    );
    cy += 2;
  }
  const impacts = [zone.water_impact, zone.co2_impact].filter(Boolean).join(" · ");
  if (impacts) {
    cy = addWrappedText(doc, impacts, margin, cy, maxWidth, 5);
    cy += 4;
  }

  if (zone.action_plan) {
    cy = writeActionPlan(doc, zone.action_plan, margin, cy, maxWidth);
  }

  return cy + 4;
}

export function exportAuditPdf(analysis: LawnAnalysis, zipCode?: string) {
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const margin = 14;
  const maxWidth = 182;
  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Terraview Report", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated ${date}`, margin, y);
  y += 5;

  const loc = analysis.location?.zip_code ?? zipCode;
  if (loc) {
    doc.text(`ZIP ${loc}${analysis.location?.region_hint ? ` · ${analysis.location.region_hint}` : ""}`, margin, y);
    y += 5;
  }
  doc.setTextColor(0);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Overall grade: ${analysis.scores.overall_grade}`, margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y = addWrappedText(doc, analysis.summary, margin, y, maxWidth, 5);
  y += 4;

  const scoreLines = [
    `Water efficiency: ${analysis.scores.water_efficiency}/100`,
    `Biodiversity: ${analysis.scores.biodiversity}/100`,
    `Heat island risk: ${analysis.scores.heat_island_risk}`,
    `Carbon sequestration: ${analysis.scores.carbon_sequestration}`,
    `Soil health: ${analysis.scores.soil_health}`,
  ];
  if (analysis.scores.estimated_water_waste_gal != null) {
    scoreLines.push(
      `Estimated excess water: ~${analysis.scores.estimated_water_waste_gal.toLocaleString()} gal/yr`,
    );
  }
  if (analysis.scores.potential_co2_sequestration_lbs != null) {
    scoreLines.push(
      `CO₂ potential: +${analysis.scores.potential_co2_sequestration_lbs} lbs/yr`,
    );
  }
  for (const line of scoreLines) {
    y = ensureSpace(doc, y, 6);
    doc.text(line, margin, y);
    y += 5;
  }
  y += 4;

  if (analysis.regional_tips?.length) {
    y = ensureSpace(doc, y, 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Regional tips", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    for (const tip of analysis.regional_tips) {
      y = ensureSpace(doc, y, 10);
      y = addWrappedText(doc, `• ${tip}`, margin, y, maxWidth, 5);
      y += 2;
    }
    y += 4;
  }

  y = ensureSpace(doc, y, 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Zones & action plans", margin, y);
  y += 8;

  const sorted = [...analysis.zones].sort((a, b) => a.id - b.id);
  sorted.forEach((zone, i) => {
    y = writeZone(doc, zone, i + 1, y);
  });

  doc.setFontSize(8);
  doc.setTextColor(120);
  y = ensureSpace(doc, y, 10);
  doc.text(
    "Store distances are estimates for planning. Verify inventory and hours before visiting.",
    margin,
    y,
  );

  const slug = loc ?? "report";
  doc.save(`terraview-${slug}-${new Date().toISOString().slice(0, 10)}.pdf`);
}
