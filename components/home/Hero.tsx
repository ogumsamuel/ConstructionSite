import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/hero/hero.jpeg"
        alt="GILGAL LAND CONSTRUCTION LIMITED construction project"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl items-center px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-primary">
            GILGAL LAND CONSTRUCTION LIMITED
          </p>

          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
            Building Sustainable Projects
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
            We deliver reliable construction and civil engineering solutions
            with a strong commitment to quality, safety, sustainability, and
            client satisfaction.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/quote"
              className="rounded-md bg-primary px-7 py-4 text-center text-sm font-bold text-white transition-all hover:bg-primary-dark"
            >
              Get a Quote
            </Link>

            <Link
              href="/projects"
              className="rounded-md border border-white/70 bg-white/10 px-7 py-4 text-center text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-slate-900"
            >
              Explore Our Projects
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
    </section>

    
  );
}