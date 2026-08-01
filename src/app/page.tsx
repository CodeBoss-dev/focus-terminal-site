import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import PlainTerms from "@/sections/PlainTerms";
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
 *
 * PlainTerms sits between the hero and the story on purpose: it states the
 * product in ordinary words for visitors who skim, so the flight narrative is
 * a way of explaining something they already understand rather than the only
 * explanation on offer.
 */
export default function Home() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <PlainTerms />
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
