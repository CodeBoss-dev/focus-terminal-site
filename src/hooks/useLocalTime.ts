"use client";

import { useEffect, useState } from "react";

/**
 * Live clock in an arbitrary IANA timezone. Returns "--:--" style
 * placeholders until mounted so SSR output is stable.
 */
export function useLocalTime(tz: string, withSeconds = false): string {
  const [now, setNow] = useState<string>(withSeconds ? "--:--:--" : "--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      ...(withSeconds ? { second: "2-digit" } : {}),
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, withSeconds ? 1000 : 15000);
    return () => clearInterval(id);
  }, [tz, withSeconds]);

  return now;
}

/** Departure = now in Tokyo; arrival = now + flight time. Real local times. */
export function useFlightTimes(tz: string, minutes: number) {
  const [times, setTimes] = useState({
    depart: "--:--",
    arrive: "--:--",
    date: "·· ··· ····",
  });

  useEffect(() => {
    const timeFmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateFmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const tick = () => {
      const now = new Date();
      const arr = new Date(now.getTime() + minutes * 60000);
      setTimes({
        depart: timeFmt.format(now),
        arrive: timeFmt.format(arr),
        date: dateFmt.format(now).toUpperCase().replace(/ /g, " "),
      });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [tz, minutes]);

  return times;
}
