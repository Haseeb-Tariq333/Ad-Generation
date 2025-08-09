import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";

const Index: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [website, setWebsite] = useState("");
  const [brandName, setBrandName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!prompt || !website) {
      setErrorMessage("Please fill in at least the prompt and website.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("website", website);
      formData.append("brandName", brandName);
      formData.append("slogan", slogan);
      formData.append("instagram", instagram);
      formData.append("facebook", facebook);
      formData.append("linkedin", linkedin);
      if (logoFile) formData.append("logo", logoFile);

      // STEP 1: Scrape brand kit
      const scrapeRes = await fetch(`${API_BASE}/scrape`, {
        method: "POST",
        body: formData,
      });

      if (!scrapeRes.ok) {
        const text = await scrapeRes.text();
        throw new Error(`Scrape error: ${scrapeRes.status} ${text}`);
      }

      const brandKit = await scrapeRes.json();

      // STEP 2: Generate ad copy
      const adRes = await fetch(`${API_BASE}/generate-ad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          prompt,
          brand: brandKit,
        }),
      });

      if (!adRes.ok) {
        const text = await adRes.text();
        throw new Error(`Ad generation error: ${adRes.status} ${text}`);
      }

      const copy = await adRes.json();

      // STEP 3: Navigate to result
      navigate("/result", {
        state: {
          brand: brandKit,
          copy,
          prompt,
          format: "image",
        },
      });

    } catch (err: any) {
      console.error("Submit error:", err);
      setErrorMessage(
        err.message || "Failed to generate brand kit & ad copy"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen p-6">
      <SEO
        title="Trilent AI"
        description="Generate ad copy and images from a simple prompt."
      />

      <section className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold">Generate ads with Trilent</h1>
          <p className="mt-2 text-gray-600">
            Fill in details and we’ll fetch your brand kit.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md space-y-4"
        >
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}

          <label className="block">
            <div className="text-sm font-medium mb-1">Prompt</div>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Describe the campaign..."
              required
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium mb-1">Website URL</div>
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="https://example.com"
              required
            />
          </label>

          <label className="block grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm font-medium mb-1">Brand Name</div>
              <input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Optional brand name (override)"
              />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Slogan / Tagline</div>
              <input
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Optional slogan"
              />
            </div>
          </label>

          <label className="block">
            <div className="text-sm font-medium mb-1">Socials (optional)</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="Instagram URL"
              />
              <input
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="Facebook URL"
              />
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="border rounded px-3 py-2"
                placeholder="LinkedIn URL"
              />
            </div>
          </label>

          <label className="block">
            <div className="text-sm font-medium mb-1">Brand Logo (optional)</div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-xs text-gray-500 mt-1">
              Upload a logo to include in the brandkit preview.
            </p>
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              {loading ? "Processing..." : "Generate & Scrape"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Index;
