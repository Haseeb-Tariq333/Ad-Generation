import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as any;
  const brand = state.brand || null;
  const prompt = state.prompt || "";

  if (!brand) {
    return (
      <div className="min-h-screen p-6">
        <button className="text-blue-600 mb-4" onClick={() => navigate(-1)}>&larr; Back</button>
        <div>No brand data found. Go back and submit a website.</div>
      </div>
    );
  }

  const logoUrl = brand.logo_url || brand.uploaded_logo_path || null;
  // if uploaded_logo_path is a server path, prefer returned logo_url (we return full URL when possible)

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <button className="text-blue-600 mb-4" onClick={() => navigate(-1)}>&larr; Back</button>

      <section className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">AI Ad Copy</h2>
          <h3 className="text-xl font-bold">{state.copy?.headline || "Your AI-Generated Headline"}</h3>
          <p className="text-gray-600 mt-2">{state.copy?.description || "An example description generated using AI."}</p>
          <div className="mt-4 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded">{state.copy?.cta || "Learn More"}</div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Brand Kit</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Source</p>
              <p className="text-lg font-bold">{brand.brand_name || "Not found"}</p>
              <p className="text-gray-600 mt-1">{brand.slogan || "No slogan found"}</p>

              <div className="mt-4">
                <h4 className="text-sm font-medium">Socials</h4>
                <ul className="mt-2 space-y-1">
                  {brand.socials && Object.keys(brand.socials).length > 0 ? (
                    Object.entries(brand.socials).map(([k, v]) => (
                      v ? <li key={k}><a className="text-indigo-600" href={v} target="_blank" rel="noreferrer">{k}: {v}</a></li> : null
                    ))
                  ) : (
                    <li className="text-gray-500">No social links found</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Brand logo" className="max-h-24 object-contain" />
              ) : (
                <div className="h-24 w-40 bg-gray-100 flex items-center justify-center rounded">No logo</div>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default Result;
