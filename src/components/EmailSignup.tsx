"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function EmailSignup() {
  const [status, setStatus] = useState<SubmitState>("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");

    try {
      const response = await fetch("https://formsubmit.co/ajax/waaridh@icloud.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (!response.ok) throw new Error("Unable to submit email");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-l">
      <form onSubmit={submit} className="flex max-w-[580px] max-sm:flex-col" aria-label="WindowSeat launch updates">
        <input type="hidden" name="_subject" value="New WindowSeat passenger" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="source" value="WindowSeat website" />
        <input
          type="text"
          name="_honey"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <label htmlFor="launch-email" className="sr-only">
          Email address
        </label>
        <input
          id="launch-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="YOU@EXAMPLE.COM"
          className="board-sm min-h-14 min-w-0 flex-1 border border-ink bg-paper px-5 text-ink placeholder:text-ink/35"
          onChange={() => status !== "idle" && setStatus("idle")}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="board-sm min-h-14 bg-ink px-8 font-bold text-paper transition-colors hover:bg-nightbottom disabled:cursor-wait disabled:opacity-65"
        >
          {status === "submitting" ? "BOARDING…" : "JOIN EARLY ACCESS →"}
        </button>
      </form>
      <div className="mt-s min-h-5" aria-live="polite">
        {status === "success" && (
          <p className="board-micro text-ink/65">YOU&apos;RE ON THE PASSENGER LIST. WATCH YOUR INBOX.</p>
        )}
        {status === "error" && (
          <p className="board-micro text-turbulence">
            SOMETHING WENT OFF COURSE. TRY AGAIN OR EMAIL WAARIDH@ICLOUD.COM.
          </p>
        )}
        {status === "idle" && (
          <p className="board-micro text-ink/45">
            LAUNCH UPDATES ONLY · NO ACCOUNT · <a href="https://codeboss-dev.github.io/windowseat-site/privacy.html" className="underline underline-offset-2">PRIVACY</a>
          </p>
        )}
      </div>
    </div>
  );
}
