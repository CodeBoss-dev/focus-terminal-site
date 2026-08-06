import Band from "@/components/Band";
import Feature from "@/components/Feature";

export default function Before() {
  return (
    <Band
      id="before"
      tone="terminal"
      progress={0.3}
      label="BEFORE / AT THE GATE"
      title="Starting is the hardest part. So we made it feel like going somewhere."
    >
      <Feature
        tone="terminal"
        eyebrow="DEPARTURES BOARD"
        title="Choose where you are going, not just how long."
        caption="Every row is a real airport at a real distance. A long session is a long flight."
        shot="/shots/01-departures.webp"
        alt="The Focus Terminal departures board listing four flights out of Mumbai, each with a gate, route, focus class and duration from 27 to 90 minutes."
        priority
      />

      <Feature
        tone="terminal"
        flip
        eyebrow="BOARDING PASS"
        title="Your task gets a ticket."
        caption="The thing you are working on prints on the pass, next to the gate, the seat and the minutes you are protecting."
        shot="/shots/03-boarding-pass.webp"
        ratio={[1600, 661]}
        alt="A printed boarding pass in the app for flight FT 236, Mumbai to Colombo, showing gate B24, seat 36K, 123 minutes of focus time and the task Deep Work."
      />
    </Band>
  );
}
