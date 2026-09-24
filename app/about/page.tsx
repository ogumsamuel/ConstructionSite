import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      {/* Page Hero */}
      <section className="bg-slate-900 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              About Us
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Building sustainable projects with purpose.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Discover who we are, what we stand for, and how we approach
              construction, engineering, and property development.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Who We Are
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            GILGAL LAND CONSTRUCTION LIMITED
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
            <p>
            GILGAL LAND CONSTRUCTION LIMITED is a reputable construction and civil
            engineering company committed to delivering high-quality, reliable,
            and sustainable solutions for our clients.
            </p>
             <p>
               With over 10 years of industry experience, the company has established a
             strong track record of successful projects, professional excellence, and client 
             satisfaction. 
             </p>
             <p>
            Over the past decade and beyond, Gilgal Land Construction Limited has 
            successfully undertaken and completed numerous construction projects across
             various sectors, demonstrating its expertise, reliability, and commitment to
              delivering projects to the highest professional standards.
             </p>
            <p>
               Our portfolio encompasses building construction, civil engineering works, 
               road construction, structural works, renovation and rehabilitation,
               infrastructure development, and other related construction services.
            </p>

            <p>
              We approach every project with attention to quality, safety,
              functionality, durability, and client requirements. Our goal is
              to contribute to projects that provide lasting value while
              maintaining professional standards throughout the project
              lifecycle.
            </p>
            <p>
             Our accomplishments have been driven by a team of experienced professionals,
             skilled craftsmen, engineers, project managers, and technical specialists who 
             work collaboratively to ensure that every project is delivered with quality, 
             safety, efficiency, durability, and cost-effectiveness in mind.
            </p>
            <p>
            At Gilgal Land Construction Limited, we understand that every project is unique.
            We therefore adopt a professional and client-focused approach, combining modern 
            construction techniques, appropriate technology, quality materials, sound 
            engineering principles, and effective project management to achieve outstanding results.
            </p>
            <p>
            Our reputation has been built on integrity, professionalism, timely delivery, 
            attention to detail, technical competence, and long-term value. As we continue
            to grow, our vision remains focused on contributing to the development of durable
            infrastructure and creating built environments that meet the needs of individuals,
            businesses, communities, and institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-surface py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-border bg-white p-8 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Our Mission
            </p>

            <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              Delivering quality with purpose.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Our mission is to deliver dependable construction and engineering
              solutions that meet client expectations through quality
              workmanship, professional expertise, safety, and responsible
              project execution.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-8 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Our Vision
            </p>

            <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              Creating lasting value through construction.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Our vision is to build a trusted construction and engineering
              company recognized for quality, innovation, professionalism,
              safety, and sustainable development.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Our Values
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Principles that guide our work.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600">
              Our approach is built around principles that help us deliver
              dependable projects and build lasting relationships with our
              clients.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Quality",
                description:
                  "We maintain high standards in our workmanship, materials, and project execution.",
              },
              {
                title: "Safety",
                description:
                  "We place safety at the center of our construction and engineering activities.",
              },
              {
                title: "Integrity",
                description:
                  "We value transparency, accountability, professionalism, and responsible business practices.",
              },
              {
                title: "Sustainability",
                description:
                  "We consider long-term value and responsible development in the projects we undertake.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-border bg-surface p-7"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {value.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}