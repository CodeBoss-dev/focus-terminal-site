import Image from "next/image";
import { withBasePath } from "@/lib/site";

/**
 * A screenshot of the shipping app, framed.
 *
 * These are genuine window captures from the App Store submission set, so they
 * are the real interface rather than a mockup — the frame is deliberately plain
 * (hairline plus a soft shadow, no rounding, no fake title bar) so nothing
 * competes with what is inside it.
 *
 * Sources are 2560x1600. `scripts/build-shots.sh` downsamples them to 1600px
 * wide WebP, which is 2x the widest slot any of them render into.
 */
export default function Shot({
  src,
  alt,
  tone = "night",
  priority = false,
  ratio = [1600, 1000],
  className = "",
}: {
  src: string;
  alt: string;
  tone?: "night" | "terminal";
  priority?: boolean;
  /* Intrinsic size of the built WebP, so the slot reserves the right height
     before it loads. Cropped shots differ — see scripts/build-shots.sh. */
  ratio?: [number, number];
  className?: string;
}) {
  /* The app's Terminal surface is the same #f7f6f2 as the page's paper bands,
     so a light screenshot sitting on one has no edge of its own. The frame has
     to supply that edge — a visible hairline plus a close contact shadow under
     a wider ambient one, which is what separates it from the page. */
  const frame =
    tone === "night"
      ? "border-starlight/15 shadow-[0_24px_70px_rgba(0,0,0,0.45)]"
      : "border-ink/15 shadow-[0_2px_6px_rgba(20,22,26,0.07),0_22px_60px_rgba(20,22,26,0.13)]";

  return (
    <Image
      src={withBasePath(src)}
      alt={alt}
      width={ratio[0]}
      height={ratio[1]}
      priority={priority}
      sizes="(max-width: 1024px) 100vw, 60vw"
      className={`h-auto w-full border ${frame} ${className}`}
    />
  );
}
