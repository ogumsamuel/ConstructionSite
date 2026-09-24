import Image from "next/image";
import Link from "next/link";

export default function AboutPreview() {
  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl">
          <Image
            src="/images/hero/about.jpeg"
            alt="GILGAL LAND CONSTRUCTION LIMITED construction project"
            width={900}
            height={700}
            className="h-[420px] w-full object-cover sm:h-[500px]"
          />

          <div className="absolute bottom-0 left-0 bg-primary px-6 py-5 text-white">
            <p className="text-2xl font-bold">Building</p>
            <p className="text-sm font-medium text-white/90">
              With Purpose & Excellence
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            About Us
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Building sustainable projects with purpose.
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
            GILGAL LAND CONSTRUCTION LIMITED is a reputable construction and civil
            engineering company committed to delivering high-quality, reliable,
            and sustainable solutions for our clients.
          </p>

          <p className="mt-4 text-base leading-8 text-slate-600">
            We combine professional expertise, quality workmanship, safety,
            and effective project management to deliver projects that create
            lasting value.
          </p>

          <Link
            href="/about"
            className="mt-8 inline-flex rounded-md bg-primary px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}