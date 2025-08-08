import React from "react";
import { SEO } from "@/components/SEO";
import { AdForm } from "@/components/AdForm";

const Index = () => {
  return (
    <main>
      <SEO
        title="AI Ad Generator – Create Ads Instantly"
        description="Generate ad copy and images from a simple prompt. Fast AI ad creator for marketers and founders."
        canonical={typeof window !== "undefined" ? window.location.origin : undefined}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "AI Ad Generator",
          applicationCategory: "MarketingApplication",
        }}
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="mx-auto max-w-5xl h-[500px] blur-3xl opacity-30 bg-gradient-to-r from-brand to-primary rounded-full mt-[-120px] animate-float" />
        </div>
        <div className="container py-16 md:py-24">
          <header className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Create compelling ads with AI
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Turn a short prompt into polished ad copy and visuals. Perfect for campaigns, landing pages, and socials.
            </p>
          </header>
          <div className="mt-10">
            <AdForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
