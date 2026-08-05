/**
 * The objections, answered in one line each.
 *
 * This is the most skimmable shape on the page and it earns its place: these
 * are the six things a visitor wants settled before spending anything, and
 * every answer opens with the word that settles it.
 */
const QUESTIONS = [
  ["Is it a subscription?", "No. $2.99 once, on the Mac App Store. There are no in-app purchases."],
  ["Does it block my apps?", "No. Cabin Mode nudges you back when you drift. It never locks your Mac."],
  ["Does my data leave the Mac?", "No. There is no account, no sync and no analytics. Sessions stay on the device."],
  ["Can I work in other apps?", "Yes. Use whatever you like — the flight runs in the menu bar while you do."],
  ["Are the airports real?", "Yes. 1,152 of them, at true great-circle distances from your home airport."],
  ["What does it need?", "macOS 14 Sonoma or later, on Apple silicon or Intel."],
];

export default function FAQ() {
  return (
    <section
      id="faq"
      data-mood="dark"
      className="bg-nighttop px-gutter py-[13vh] text-starlight max-md:px-m max-md:py-20"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-12 gap-x-l border-b border-starlight/12 pb-l max-lg:grid-cols-1 max-lg:gap-y-s">
          <p className="board-caption col-span-3 pt-2 text-instrument max-lg:col-span-1">
            GOOD TO KNOW
          </p>
          <h2 className="headline col-span-9 max-w-[20ch] max-lg:col-span-1">
            The short answers.
          </h2>
        </div>

        <dl className="grid grid-cols-2 gap-x-xl max-lg:grid-cols-1">
          {QUESTIONS.map(([question, answer]) => (
            <div key={question} className="border-b border-starlight/12 py-l">
              <dt className="headline-sm">{question}</dt>
              <dd className="lede mt-2 max-w-[42ch] text-starlight/65">{answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
