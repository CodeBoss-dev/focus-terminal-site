import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FilmHero from "@/sections/FilmHero";
import Briefing from "@/sections/Briefing";
import Departures from "@/sections/Departures";
import BoardingPass from "@/sections/BoardingPass";
import CabinDim from "@/sections/CabinDim";
import InFlight from "@/sections/InFlight";
import Landing from "@/sections/Landing";
import PassportStamp from "@/sections/PassportStamp";
import { Manifesto, Numbers, Craft, CTABand } from "@/sections/Brand";

/*
 * One continuous scroll = one flight, the app's real first-run loop:
 * briefing → (light) departures/booking/pass → doors close (dark)
 * → in-flight → landing → stamp (light returns) → brand page → CTA.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <FilmHero />
        <Briefing />
        <Departures />
        <BoardingPass />
        <CabinDim />
        <InFlight />
        <Landing />
        <PassportStamp />
        <Manifesto />
        <Numbers />
        <Craft />
        <CTABand />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
