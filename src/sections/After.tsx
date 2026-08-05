import Band from "@/components/Band";
import Feature from "@/components/Feature";

export default function After() {
  return (
    <Band
      id="after"
      tone="terminal"
      progress={0.88}
      label="AFTER / ON ARRIVAL"
      title="Finished hours leave something behind."
    >
      <Feature
        tone="terminal"
        eyebrow="PASSPORT"
        title="Sessions add up to a place you have been."
        caption="Land somewhere new and the country is stamped. Miles accumulate toward the next tier."
        shot="/shots/07-passport.webp"
        alt="The app's passport view showing two countries visited, 1,491 lifetime miles, two flights, stamps for Pakistan and Sri Lanka, and seven achievements with Maiden Flight and Long Haul unlocked."
      />

      <Feature
        tone="terminal"
        flip
        eyebrow="STATS"
        title="See where the time actually went."
        caption="Total focus, streak, longest session, and a breakdown by the kind of work you were doing."
        shot="/shots/08-stats.webp"
        ratio={[1600, 632]}
        alt="The app's statistics view: total focus 3h 19m, average session 100 minutes, longest flight 123 minutes, a one-day streak, a focus-by-day chart and a breakdown by cabin class."
      />
    </Band>
  );
}
