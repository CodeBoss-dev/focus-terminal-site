import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import How from "@/sections/How";
import InFlight from "@/sections/InFlight";
import Price from "@/sections/Price";

/*
 * Four sections, in the order a skimmer needs them: what it is, how a session
 * goes, what it feels like while you work, what it costs.
 *
 * The previous page told the whole flight as thirteen pinned scroll chapters.
 * Reviewers liked how it looked and then skimmed straight past the product —
 * there was no path through it that did not involve reading. The metaphor now
 * lives in the route rule between sections and in the app furniture itself, so
 * every word left on the page is literal.
 */
export default function Home() {
  return (
    <>
      <Motion />
      <Nav />
      <main>
        <Hero />
        <How />
        <InFlight />
        <Price />
      </main>
      <Footer />
    </>
  );
}
