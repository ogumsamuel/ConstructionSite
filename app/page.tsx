import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import AboutPreview from "@/components/home/AboutPreview";
import ServicesPreview from "@/components/home/ServicesPreview";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats/>
      <AboutPreview/>
      <ServicesPreview/>
    </main>
  );
}