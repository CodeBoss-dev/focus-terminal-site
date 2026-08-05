import Band from "@/components/Band";
import Feature from "@/components/Feature";

export default function Before() {
  return (
    <Band
      id="before"
      tone="terminal"
      progress={0.3}
      label="BEFORE / AT THE GATE"
      title="Starting is the hard part, so it looks like something."
    >
      <Feature
        tone="terminal"
        eyebrow="DEPARTURES BOARD"
        title="Pick a destination, not a duration."
        caption="Every row is a real airport at its real distance, so the length you choose already means somewhere."
        shot="/shots/01-departures.webp"
        alt="The Focus Terminal departures board listing four flights out of Mumbai, each with a gate, route, focus class and duration from 27 to 90 minutes."
        priority
      />

      <Feature
        tone="terminal"
        flip
        eyebrow="BOARDING PASS"
        title="Every session gets a reason."
        caption="Your task prints on the pass beside the gate, the seat and the minutes you are protecting."
        shot="/shots/03-boarding-pass.webp"
        ratio={[1600, 661]}
        alt="A printed boarding pass in the app for flight FT 236, Mumbai to Colombo, showing gate B24, seat 36K, 123 minutes of focus time and the task Deep Work."
      />
    </Band>
  );
}
