import React, { useState } from "react";

const AdForm: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [website, setWebsite] = useState("");
  const [brandName, setBrandName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("website", website);
    formData.append("brand_name", brandName);
    formData.append("slogan", slogan);
    formData.append("instagram", instagram);
    formData.append("facebook", facebook);
    formData.append("linkedin", linkedin);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      const res = await fetch("http://localhost:5001/scrape", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error scraping:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>Generate ads with Trilent</h1>
      <p style={{ textAlign: "center" }}>
        Turn a short prompt into polished ad copy and visuals.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter your prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <input
          type="url"
          placeholder="Enter website URL"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Brand Name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Slogan / Tagline"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
        />
        <input
          type="url"
          placeholder="Instagram URL"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
        <input
          type="url"
          placeholder="Facebook URL"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />
        <input
          type="url"
          placeholder="LinkedIn URL"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
        />

        {/* Logo Upload */}
        <div
          style={{
            border: "2px dashed #ccc",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={() => document.getElementById("logo-upload")?.click()}
        >
          {logo ? (
            <p>{logo.name}</p>
          ) : (
            <p>Drag & drop your logo here or click to upload</p>
          )}
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleLogoUpload}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {/* Display Results */}
      {result && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
          <h2>Scraped Brand Info</h2>
          <p><strong>Brand Name:</strong> {result.name}</p>
          <p><strong>Slogan:</strong> {result.slogan}</p>
          <p><strong>Website:</strong> {result.website}</p>
          <p><strong>Instagram:</strong> {result.instagram}</p>
          <p><strong>Facebook:</strong> {result.facebook}</p>
          <p><strong>LinkedIn:</strong> {result.linkedin}</p>
          {result.logo && (
            <div>
              <strong>Logo:</strong>
              <img src={result.logo} alt="Brand Logo" style={{ maxWidth: "100px", display: "block" }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdForm;
