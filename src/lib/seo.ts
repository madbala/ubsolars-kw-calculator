/** Canonical site origin for sitemap, robots, and absolute metadata URLs. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  // Fallback used at build time when env is unset
  return "https://ubsolars-kw-calculator.vercel.app";
}

export const SITE_NAME = "UB Solars";
export const SITE_TITLE = "UB Solars — Free TNEB Solar kW Calculator";
export const SITE_DESCRIPTION =
  "Free Tamil Nadu TNEB solar calculator: turn your bimonthly electricity bill into the right rooftop kW, PM Surya Ghar subsidy estimate, EMI, and post-solar savings. No signup.";

export const SITE_KEYWORDS = [
  "TNEB solar calculator",
  "Tamil Nadu solar calculator",
  "rooftop solar kW calculator",
  "PM Surya Ghar subsidy calculator",
  "solar system size calculator India",
  "TNEB bill to solar kW",
  "UB Solars",
  "Kumbakonam solar",
  "solar EMI calculator",
  "post solar bill estimate",
] as const;
