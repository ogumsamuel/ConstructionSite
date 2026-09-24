import Link from "next/link";

const contactDetails = [
  {
    title: "Visit Our Office",
    value: "Suit B1 1BN Hameed Plaza, 1st Avenue, FHA, Lugbe, Abuja.",
    href: null,
    icon: "⌖",
  },
  {
    title: "Call Us",
    value: "+2347032502618 / +2349017596886",
    href: "tel:+2347032502618",
    icon: "☎",
  },
  {
    title: "WhatsApp",
    value: "+2348146967924",
    href: "https://wa.me/2348146967924",
    icon: "◉",
  },
  {
    title: "Email Us",
    value: "gilgallandconstructionlimited@gmail.com",
    href: "mailto:gilgallandconstructionlimited@gmail.com",
    icon: "✉",
  },
];

export default function ContactPage() {
  return (
    <main>
      {/* Page Hero */}
      <section className="bg-slate-900 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Contact Us
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s talk about your next project.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
              Have a construction, engineering, renovation, or property
              project in mind? Get in touch with GILGAL LAND CONSTRUCTION
              LIMITED and tell us how we can help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left */}
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Get In Touch
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                We&apos;re ready to hear about your project.
              </h2>

              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                Whether you are planning a new building, renovation,
                infrastructure project, engineering work, or property
                development, our team is available to discuss your
                requirements.
              </p>

              <div className="mt-10 space-y-5">
                {contactDetails.map((contact) => (
                  <div
                    key={contact.title}
                    className="flex gap-5 rounded-2xl border border-border bg-surface p-6"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl text-white">
                      {contact.icon}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-slate-900">
                        {contact.title}
                      </h3>

                      {contact.href ? (
                        <a
                          href={contact.href}
                          target={
                            contact.href.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            contact.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="mt-1 block break-words text-sm leading-7 text-slate-600 transition-colors hover:text-primary"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-sm leading-7 text-slate-600">
                          {contact.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Contact Card */}
            <div className="rounded-2xl bg-surface p-8 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Start A Conversation
              </p>

              <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                Tell us what you&apos;re planning.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-600">
                For project enquiries, you can contact our team directly or
                submit a detailed quote request through our website.
              </p>

              <div className="mt-8 space-y-4">
                <Link
                  href="/quote"
                  className="flex w-full items-center justify-center rounded-md bg-primary px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}