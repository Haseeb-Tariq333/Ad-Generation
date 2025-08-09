export type BrandKit = {
    title: string;
    description: string;
    logo: string;
    favicon: string;
  };
  
  export async function fetchBrandKit(url: string): Promise<BrandKit> {
    const response = await fetch("http://localhost:5001/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  
    if (!response.ok) throw new Error("Failed to fetch brand kit");
  
    return await response.json();
  }
  