import Hero from "@/components/layouts/home/Hero";
import { NavbarHome } from "@/components/layouts/home/NavbarHome";
import Supported from "@/components/layouts/home/Supported";
import Benefits from "@/components/layouts/home/Benefits";
import { Testimonials } from "@/components/layouts/home/Testimonials";

export default function Home() {
  return (
    <main className="px-4 py-2 xl:max-w-6xl mx-auto m-5 space-y-20">
      <NavbarHome />
      <Hero />
      <Supported />
      <Benefits />
      <Testimonials />
    </main>
  );
}
