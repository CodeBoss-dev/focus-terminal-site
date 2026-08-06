import Motion from "@/components/Motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import Introducing from "@/sections/Introducing";
import How from "@/sections/How";
import Before from "@/sections/Before";
import During from "@/sections/During";
import After from "@/sections/After";
import FAQ from "@/sections/FAQ";
import Price from "@/sections/Price";

/*
 * The page follows one session: the promise, the product named, the three beats
 * of a session, then a band each for before it, during it and after it, then
 * the answers and the price.
 *
 * Two rewrites got here. The first version told the whole flight as thirteen
 * pinned scroll chapters and buried the product in prose, so reviewers skimmed
 * past it. The second cut so hard there was nothing left to land on — sparse
 * text on flat colour is paradoxically hard to skim, because the eye has no
 * landmarks. What fixed it was screenshots: every claim now sits next to a
 * picture of the app making good on it, so a visitor can read six headlines and
 * six images and be done.
 */
export default function Home() {
  return (
    <>
      <Motion />
      <Nav />
      <main>
        <Hero />
        <Introducing />
        <How />
        <Before />
        <During />
        <After />
        <FAQ />
        <Price />
      </main>
      <Footer />
    </>
  );
}
