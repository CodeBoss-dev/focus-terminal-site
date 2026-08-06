import Band from "@/components/Band";
import Feature from "@/components/Feature";

export default function After() {
  return (
    <Band
      id="after"
      tone="terminal"
      progress={0.88}
      label="AFTER / ON ARRIVAL"
      title="Every hour you finish leaves something behind."
    >
      <Feature
        tone="terminal"
        eyebrow="PASSPORT"
        title="Collect countries, not just hours."
        caption="Land somewhere new and it is stamped in your passport. The miles add up for as long as you keep flying."
        shot="/shots/07-passport.webp"
        alt="The app's passport view showing two countries visited, 1,491 lifetime miles, two flights, stamps for Pakistan and Sri Lanka, and seven achievements with Maiden Flight and Long Haul unlocked."
      />

      <Feature
        tone="terminal"
        flip
        eyebrow="STATS"
        title="See how far you have come."
        caption="Total focus, your streak, your longest flight, and what kind of work you have been doing."
        shot="/shots/08-stats.webp"
        ratio={[1600, 632]}
        alt="The app's statistics view: total focus 3h 19m, average session 100 minutes, longest flight 123 minutes, a one-day streak, a focus-by-day chart and a breakdown by cabin class."
      />
    </Band>
  );
}
