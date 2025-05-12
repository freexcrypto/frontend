import { Button } from "@/components/ui/button";
import React from "react";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export default function Hero() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 items-center gap-5">
      <section className="space-y-5">
        <div className="space-y-2">
          <h1 className="text-3xl xl:text-5xl font-bold">
            Simplified Crypto Payments, <br /> Seamless Everywhere
          </h1>
          <h2 className="text-muted-foreground">
            Accept, send, and manage payments in crypto—effortlessly. With
            Freex, you are always in control.
          </h2>
        </div>
        <div className="space-x-5">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
      </section>

      <section>
        <div className="relative">
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/watch?v=hOujeRJsS7s"
            thumbnailSrc="https://hpeomxpauqyqnmdejfgb.supabase.co/storage/v1/object/public/images/thumbnail.png"
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/watch?v=hOujeRJsS7s"
            thumbnailSrc="https://hpeomxpauqyqnmdejfgb.supabase.co/storage/v1/object/public/images/thumbnail.png"
            thumbnailAlt="Hero Video"
          />
        </div>
      </section>
    </div>
  );
}
