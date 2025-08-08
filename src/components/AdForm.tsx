import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateAdCopy, BrandInfo } from "@/lib/adgen";
import { useNavigate } from "react-router-dom";

export type FormValues = {
  prompt: string;
  name?: string;
  slogan?: string;
  website?: string;
  socials?: string;
  format: "image" | "video";
  runwareKey?: string;
};

export const AdForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState, setValue } = useForm<FormValues>({
    defaultValues: { format: "image" },
  });

  React.useEffect(() => {
    const savedKey = localStorage.getItem("runwareKey");
    if (savedKey) setValue("runwareKey", savedKey);
  }, [setValue]);

  const onSubmit = (data: FormValues) => {
    if (data.runwareKey) localStorage.setItem("runwareKey", data.runwareKey);

    const brand: BrandInfo = {
      name: data.name,
      slogan: data.slogan,
      website: data.website,
      socials: data.socials,
    };

    const copy = generateAdCopy(data.prompt, brand);

    navigate("/result", {
      state: {
        copy,
        brand,
        prompt: data.prompt,
        format: data.format,
        runwareKey: data.runwareKey || null,
      },
    });
  };

  return (
    <Card className="backdrop-blur-sm border border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Describe your campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" required placeholder="e.g. Launching a smart water bottle that tracks hydration and glows to remind you to drink" {...register("prompt", { required: true })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Brand name</Label>
              <Input id="name" placeholder="Acme Co." {...register("name")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slogan">Slogan</Label>
              <Input id="slogan" placeholder="Do more with less" {...register("slogan")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" placeholder="https://example.com" {...register("website")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="socials">Social links</Label>
              <Input id="socials" placeholder="@brand, /brand" {...register("socials")} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Ad format</Label>
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="image" defaultChecked {...register("format")} />
                <span>Image</span>
              </label>
              <label className="inline-flex items-center gap-2 opacity-60">
                <input type="radio" value="video" disabled {...register("format")} />
                <span>Video (coming soon)</span>
              </label>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="runwareKey">Runware API key (optional, for AI images)</Label>
            <Input id="runwareKey" placeholder="Paste your key to generate real AI images" {...register("runwareKey")} />
            <p className="text-sm text-muted-foreground">Without a key, you'll get a high-quality placeholder banner. Add a key to generate bespoke AI visuals.</p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="hero" size="lg" aria-label="Generate ad">
              Generate
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
