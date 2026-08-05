import Band from "@/components/Band";
import Feature from "@/components/Feature";
import { FLIGHT } from "@/lib/flight";

/* No screenshot exists for the menu-bar item — it lives in the system menu bar,
   not in the app window the capture tests photograph — so it is rebuilt here
   from the same tokens. Same for the drift alert, which is a notification. */
function MenuBarVisual() {
  return (
    <div className="flex flex-col gap-m">
      <div className="flex items-center justify-between gap-m border border-starlight/15 bg-nighttop/70 px-5 py-3">
        <span className="board-micro text-starlight/35 max-sm:hidden">
          FINDER&ensp;FILE&ensp;EDIT&ensp;VIEW&ensp;WINDOW&ensp;HELP
        </span>
        <span className="board tnum flex items-center gap-2 text-instrument">
          ✈ {FLIGHT.number.replace(" ", "")} · 42m → {FLIGHT.dest.iata}
        </span>
      </div>

      <div className="ml-auto w-full max-w-[420px] border border-turbulence/35 bg-nighttop/70 px-5 py-4">
        <p className="board-micro text-turbulence">● TURBULENCE</p>
        <p className="lede mt-2 text-starlight">Slack has been open for a while.</p>
      </div>
    </div>
  );
}

export default function During() {
  return (
    <Band
      id="during"
      tone="night"
      progress={0.62}
      label="IN THE AIR / CABIN MODE"
      title="An hour you can watch move."
    >
      <Feature
        tone="night"
        eyebrow="CABIN VIEW"
        title="Or nothing to look at, if you prefer."
        caption="A window seat at 37,000 feet, one countdown, and no interface left to fiddle with."
        shot="/shots/05-cabin-view.webp"
        alt="The app's cabin view: a darkened aircraft cabin window looking out over cloud at cruise altitude, a wing visible below, and the focus countdown reading 01:27:42."
      />

      <Feature
        tone="night"
        flip
        eyebrow="WHILE YOU WORK"
        title="It follows you to the work."
        caption="Progress stays in the menu bar, and drifting gets you a nudge rather than a locked Mac."
        visual={<MenuBarVisual />}
      />
    </Band>
  );
}
