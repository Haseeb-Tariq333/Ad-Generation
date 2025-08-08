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
  instagram?: string;
  facebook?: string;
  twitter?: string;
  format: "image" | "video";
};

export const AdForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { format: "image" },
  });

  const onSubmit = (data: FormValues) => {
    const socials = [
      data.instagram && `Instagram: ${data.instagram}`,
      data.facebook && `Facebook: ${data.facebook}`,
      data.twitter && `Twitter: ${data.twitter}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const brand: BrandInfo = {
      name: data.name,
      slogan: data.slogan,
      website: data.website,
      socials,
    };

    const copy = generateAdCopy(data.prompt, brand);

    navigate("/result", {
      state: {
        copy,
        brand,
        prompt: data.prompt,
        format: data.format,
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
              <Label htmlFor="name">Brand name (optional)</Label>
              <Input id="name" placeholder="Acme Co." {...register("name")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slogan">Slogan (optional)</Label>
              <Input id="slogan" placeholder="Do more with less" {...register("slogan")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website URL (optional)</Label>
              <Input id="website" type="url" placeholder="https://example.com" {...register("website")} />
            </div>
            <div className="grid gap-2">
              <Label>Social links (optional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="instagram" className="text-xs text-muted-foreground">Instagram</Label>
                  <Input id="instagram" placeholder="@yourbrand" {...register("instagram")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="facebook" className="text-xs text-muted-foreground">Facebook</Label>
                  <Input id="facebook" placeholder="/yourbrand" {...register("facebook")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="twitter" className="text-xs text-muted-foreground">Twitter/X</Label>
                  <Input id="twitter" placeholder="@yourbrand" {...register("twitter")} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Ad format</Label>
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="image" defaultChecked {...register("format")} />
                <span>Image</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" value="video" {...register("format")} />
                <span>Video</span>
              </label>
            </div>
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
