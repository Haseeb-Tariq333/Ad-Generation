export interface BrandInfo {
  name?: string;
  slogan?: string;
  website?: string;
  socials?: string;
}

export interface AdCopy {
  headline: string;
  description: string;
  cta: string;
}

export function generateAdCopy(prompt: string, brand: BrandInfo = {}): AdCopy {
  const brandName = brand.name || "Your Brand";
  const slogan = brand.slogan ? ` – ${brand.slogan}` : "";

  const headline = `${capitalize(firstWords(prompt, 6))} | ${brandName}`;
  const description = `Introducing ${brandName}${slogan}. ${capitalize(prompt)}. Designed to make your life easier, faster, and more delightful. Learn more at ${brand.website || "your-website.com"}.`;
  const cta = suggestCTA(prompt);

  return { headline, description, cta };
}

function suggestCTA(prompt: string): string {
  const p = prompt.toLowerCase();
  if (/(buy|shop|sale|discount|offer)/.test(p)) return "Shop Now";
  if (/(launch|new|introduc)/.test(p)) return "Discover What's New";
  if (/(signup|subscribe|join)/.test(p)) return "Sign Up Free";
  if (/(download|app|tool)/.test(p)) return "Download Now";
  if (/(book|demo|call|consult)/.test(p)) return "Book a Demo";
  return "Learn More";
}

function firstWords(text: string, n: number) {
  return text.split(/\s+/).slice(0, n).join(" ");
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
