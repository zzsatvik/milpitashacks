export function ScoringSection() {
  const metrics = [
    {
      name: "Water efficiency",
      range: "0–100",
      desc: "How much of your landscape relies on irrigation vs. drought-tolerant or native planting. Lower turf coverage usually means a higher score.",
      icon: "💧",
    },
    {
      name: "Biodiversity",
      range: "0–100",
      desc: "Variety of plant types, native species, and habitat value. Monoculture lawns score low; mixed native beds score high.",
      icon: "🌿",
    },
    {
      name: "Heat island risk",
      range: "Low · Medium · High",
      desc: "Hardscape and bare soil absorb heat. More shade trees, mulch, and living ground cover reduce surface temperatures.",
      icon: "🌡️",
    },
    {
      name: "Carbon sequestration",
      range: "Low · Medium · High",
      desc: "Trees and deep-rooted perennials pull CO₂ from the air. Turf sequesters little; oaks and native shrubs sequester significantly more.",
      icon: "🌱",
    },
    {
      name: "Soil health",
      range: "Low · Medium · High",
      desc: "Bare patches erode and lose carbon. Mulched beds, ground cover, and reduced compaction improve retention and microbial life.",
      icon: "♻️",
    },
  ];

  const grades = [
    { grade: "A / A+", meaning: "Mostly natives, minimal turf, strong tree cover" },
    { grade: "B / B+", meaning: "Balanced mix with room for targeted improvements" },
    { grade: "C / D", meaning: "Turf-heavy or hardscape-heavy — high water & heat impact" },
  ];

  return (
    <section id="scoring" className="scroll-mt-24 mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 font-mono-data text-[10px] uppercase tracking-[0.18em] text-forest-100/40">
          <span className="inline-block h-1 w-1 rounded-full bg-glow-400" />
          Scoring
        </div>
        <h2 className="mt-2 font-display text-3xl tracking-tight-display text-forest-50 sm:text-4xl text-balance">
          How we grade your <em className="italic text-glow-300">yard</em>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-forest-100/55">
          Every audit produces five sustainability metrics plus an overall letter
          grade. Scores are estimated from what the AI sees in your photo — not
          a site visit.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.name} className="bento glass rounded-3xl p-6">
            <span className="text-xl">{m.icon}</span>
            <h3 className="mt-3 font-display text-xl tracking-tight-display text-forest-50">
              {m.name}
            </h3>
            <p className="mt-1 font-mono-data text-[10px] uppercase tracking-[0.14em] text-glow-400">
              {m.range}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-forest-100/60">
              {m.desc}
            </p>
          </div>
        ))}

        <div className="bento glass rounded-3xl p-6 md:col-span-2 lg:col-span-1">
          <span className="text-xl">📊</span>
          <h3 className="mt-3 font-display text-xl tracking-tight-display text-forest-50">
            Overall grade
          </h3>
          <p className="mt-1 font-mono-data text-[10px] uppercase tracking-[0.14em] text-glow-400">
            A+ through F
          </p>
          <ul className="mt-4 space-y-3">
            {grades.map((g) => (
              <li
                key={g.grade}
                className="border-l-2 border-glow-400/40 pl-3 text-sm text-forest-100/60"
              >
                <span className="font-semibold text-forest-50">{g.grade}</span>
                {" — "}
                {g.meaning}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
