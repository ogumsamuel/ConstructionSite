const stats = [
  {
    value: "50+",
    label: "Projects Completed",
  },
  {
    value: "10+",
    label: "Years Experience",
  },
  {
    value: "48+",
    label: "Satisfied Clients",
  },
  {
    value: "100%",
    label: "Safety Commitment",
  },
];

export default function Stats() {
  return (
    <section className="border-b border-border bg-slate-900">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`px-6 py-10 text-center sm:py-12 ${
              index !== stats.length - 1
                ? "border-r border-border"
                : ""
            }`}
          >
            <p className="text-3xl font-bold text-primary sm:text-4xl">
              {stat.value}
            </p>

            <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}