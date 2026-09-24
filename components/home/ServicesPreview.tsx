import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Architectural Design",
    description:
      "Thoughtful architectural solutions that combine functionality, aesthetics, sustainability, and each client's project requirements.",
  },
  {
    number: "02",
    title: "Building Construction",
    description:
      "Quality building construction from foundation to completion, with a strong focus on workmanship, durability, safety, and client requirements.",
  },
  {
    number: "03",
    title: "Road Construction",
    description:
      "Reliable road construction solutions covering essential infrastructure works, from preparation and earthworks to road base and surfacing.",
  },
];

export default function ServicesPreview() {
  return (
    <section className="bg-slate-900 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Our Services
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Professional solutions for every stage of your project.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
            From architectural design and construction to infrastructure and
            project management, we provide dependable solutions tailored to
            each client&apos;s needs.
          </p>
        </div>

        {/* Featured services */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.number}
              className="group rounded-2xl border border-border bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">
                  {service.number}
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-slate-400 transition-colors group-hover:border-primary group-hover:text-primary">
                  →
                </span>
              </div>

              <h3 className="mt-8 text-xl font-bold text-slate-900">
                {service.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* View all services */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex rounded-md bg-primary px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
          >
            Explore All Services
          </Link>
        </div>
      </div>
    </section>
  );
}