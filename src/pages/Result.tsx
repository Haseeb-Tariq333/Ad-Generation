import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { downloadImage, generatePlaceholderBanner } from "@/lib/image";
import type { AdCopy, BrandInfo } from "@/lib/adgen";

interface ResultState {
  copy: AdCopy;
  brand: BrandInfo;
  prompt: string;
  format: "image" | "video";
  runwareKey?: string | null;
}

const Result: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as Partial<ResultState>;

  React.useEffect(() => {
    if (!state.copy || !state.prompt) {
      navigate("/", { replace: true });
    }
  }, []);

  const [imageURL, setImageURL] = React.useState<string | null>(null);
  const [loadingImg, setLoadingImg] = React.useState(false);

  React.useEffect(() => {
    if (!state.copy) return;
    let cancelled = false;
    const run = async () => {
      setLoadingImg(true);
      try {
        const key = state.runwareKey || localStorage.getItem("runwareKey") || "";
        if (key) {
          // Lazy-load Runware service only when key present
          const { RunwareService } = await import("@/lib/runware");
          const service = new RunwareService(key);
          const result = await service.generateImage({
            positivePrompt: `${state.prompt} – branded as ${state.brand?.name || "Your Brand"}`,
            width: 1024,
            height: 1024,
            numberResults: 1,
          });
          if (!cancelled) setImageURL(result.imageURL);
        } else {
          const placeholder = generatePlaceholderBanner(state.copy!.headline, state.copy!.cta);
          if (!cancelled) setImageURL(placeholder);
        }
      } catch (e) {
        console.error(e);
        const placeholder = generatePlaceholderBanner(state.copy!.headline, state.copy!.cta);
        if (!cancelled) setImageURL(placeholder);
      } finally {
        if (!cancelled) setLoadingImg(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [state.copy]);

  if (!state.copy) return null;

  const { headline, description, cta } = state.copy;

  return (
    <main className="min-h-screen py-10">
      <SEO
        title={`Ad Result – ${headline}`}
        description={description}
        canonical={typeof window !== "undefined" ? window.location.href : undefined}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: headline,
          description,
        }}
      />
      <div className="container grid gap-8">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)}>&larr; Back</Button>
        </div>
        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle>AI Ad Copy</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <h2 className="text-2xl font-bold">{headline}</h2>
              <p className="text-muted-foreground mt-2">{description}</p>
            </div>
            <div>
              <span className="inline-flex items-center rounded-md bg-accent px-3 py-1 text-sm text-accent-foreground">CTA: {cta}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle>Visual Preview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="w-full flex items-center justify-center">
              {loadingImg ? (
                <div className="h-72 w-full max-w-3xl bg-muted animate-pulse rounded-lg" />
              ) : imageURL ? (
                <img
                  src={imageURL}
                  alt={`Ad image for ${state.brand?.name || "brand"}`}
                  className="w-full max-w-3xl rounded-lg border border-border/60"
                  loading="lazy"
                />
              ) : null}
            </div>
            {imageURL && (
              <div className="flex gap-3">
                <Button variant="default" onClick={() => downloadImage(imageURL, "ad-image.png")}>Download Image</Button>
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(`${headline}\n\n${description}\n\n${cta}`)}>Copy Text</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Result;
