#!/usr/bin/env python3
"""Render the original, procedural score for the WindowSeat launch film.

The score is intentionally sparse. A calm piano progression carries the edit;
product sounds appear only when a matching event is visible on screen.
"""

from __future__ import annotations

import argparse
import math
import wave
from pathlib import Path

import numpy as np


SAMPLE_RATE = 48_000
DURATION = 50.5
FRAME_COUNT = round(SAMPLE_RATE * DURATION)
TEMPO = 72.0
BEAT = 60.0 / TEMPO


def smoothstep(values: np.ndarray) -> np.ndarray:
    values = np.clip(values, 0.0, 1.0)
    return values * values * (3.0 - 2.0 * values)


def envelope(length: int, attack: float, release: float) -> np.ndarray:
    result = np.ones(length, dtype=np.float32)
    attack_frames = min(length, round(attack * SAMPLE_RATE))
    release_frames = min(length, round(release * SAMPLE_RATE))

    if attack_frames:
        result[:attack_frames] = smoothstep(
            np.linspace(0.0, 1.0, attack_frames, endpoint=False, dtype=np.float32)
        )
    if release_frames:
        result[-release_frames:] *= smoothstep(
            np.linspace(1.0, 0.0, release_frames, endpoint=True, dtype=np.float32)
        )
    return result


def pan_gains(pan: float) -> tuple[float, float]:
    angle = (np.clip(pan, -1.0, 1.0) + 1.0) * math.pi / 4.0
    return math.cos(angle), math.sin(angle)


def add_mono(
    mix: np.ndarray,
    signal: np.ndarray,
    start: float,
    gain: float = 1.0,
    pan: float = 0.0,
) -> None:
    start_frame = max(0, round(start * SAMPLE_RATE))
    end_frame = min(FRAME_COUNT, start_frame + len(signal))
    if end_frame <= start_frame:
        return

    left, right = pan_gains(pan)
    signal = signal[: end_frame - start_frame] * gain
    mix[start_frame:end_frame, 0] += signal * left
    mix[start_frame:end_frame, 1] += signal * right


def add_piano_note(
    mix: np.ndarray,
    at: float,
    frequency: float,
    gain: float,
    duration: float,
    decay: float,
    pan: float = 0.0,
) -> None:
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    key_attack = (1.0 - np.exp(-115.0 * time)).astype(np.float32)
    natural_decay = np.exp(-decay * time).astype(np.float32)
    release = envelope(count, attack=0.004, release=min(0.45, duration * 0.22))

    # Slightly detuned strings and faster-decaying upper partials create a
    # warm felt-piano character without relying on a sampled instrument.
    voice = (
        np.sin(2.0 * math.pi * frequency * time)
        + 0.16 * np.sin(2.0 * math.pi * frequency * 1.0015 * time + 0.22)
        + 0.30
        * np.sin(2.0 * math.pi * frequency * 2.006 * time + 0.11)
        * np.exp(-0.85 * time)
        + 0.11
        * np.sin(2.0 * math.pi * frequency * 3.012 * time + 0.37)
        * np.exp(-1.55 * time)
        + 0.04
        * np.sin(2.0 * math.pi * frequency * 4.021 * time)
        * np.exp(-2.25 * time)
    ).astype(np.float32)
    voice *= key_attack * natural_decay * release
    add_mono(mix, voice, at, gain=gain, pan=pan)

    # A very small, asymmetric room reflection keeps the piano from sounding
    # pasted on while avoiding a persistent ambient bed.
    add_mono(mix, voice, at + 0.075, gain=gain * 0.085, pan=-pan * 0.7)
    add_mono(mix, voice, at + 0.145, gain=gain * 0.045, pan=pan * 0.5)


def add_bell(
    mix: np.ndarray,
    at: float,
    frequency: float,
    duration: float,
    gain: float,
    pan: float = 0.0,
) -> None:
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    shape = envelope(count, attack=0.035, release=duration * 0.72)
    bell = (
        np.sin(2.0 * math.pi * frequency * time)
        + 0.10 * np.sin(2.0 * math.pi * frequency * 2.0 * time)
    ).astype(np.float32)
    add_mono(mix, bell * shape, at, gain=gain, pan=pan)


def add_riser(
    mix: np.ndarray,
    start: float,
    duration: float,
    from_frequency: float,
    to_frequency: float,
    gain: float,
) -> None:
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    slope = (to_frequency - from_frequency) / duration
    phase = 2.0 * math.pi * (from_frequency * time + 0.5 * slope * time * time)
    shape = envelope(count, attack=duration * 0.14, release=duration * 0.34)
    voice = (
        np.sin(phase) + 0.11 * np.sin(2.0 * math.pi * 196.0 * time)
    ).astype(np.float32)
    add_mono(mix, voice * shape, start, gain=gain)


def add_stamp(mix: np.ndarray, at: float) -> None:
    duration = 0.32
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    generator = np.random.default_rng(0x5354414D50)
    noise = generator.standard_normal(count).astype(np.float32)
    decay = np.exp(-18.0 * time).astype(np.float32)
    thump = np.sin(2.0 * math.pi * 72.0 * time).astype(np.float32) * np.exp(-10.0 * time)
    signal = (noise * 0.09 + thump * 0.9).astype(np.float32) * decay
    add_mono(mix, signal, at, gain=0.20, pan=-0.05)


def render_score() -> np.ndarray:
    mix = np.zeros((FRAME_COUNT, 2), dtype=np.float32)

    # Fifteen four-beat phrases fill the film without looping. The harmony
    # begins in D minor, opens up through the product journey, and resolves to
    # D major/add9 on the WindowSeat mark.
    bars = (
        (73.42, 110.00, (293.66, 349.23, 440.00, 659.25), (0, 1), 0.62),
        (73.42, 110.00, (293.66, 349.23, 440.00, 659.25), (0, 2, 1), 0.68),
        (58.27, 87.31, (233.08, 293.66, 349.23, 440.00), (0, 1, 2, 3), 0.74),
        (87.31, 130.81, (220.00, 261.63, 349.23, 392.00), (1, 2, 3, 2), 0.78),
        (65.41, 98.00, (261.63, 293.66, 392.00, 523.25), (0, 1, 2, 1), 0.80),
        (73.42, 110.00, (293.66, 349.23, 440.00, 659.25), (0, 1, 2, 3), 0.84),
        (58.27, 87.31, (233.08, 293.66, 349.23, 440.00), (0, 2, 1, 3), 0.86),
        (87.31, 130.81, (220.00, 261.63, 349.23, 392.00), (1, 2, 3, 2), 0.90),
        (73.42, 110.00, (293.66, 349.23, 440.00, 659.25), (0, 1, 2, 3), 0.94),
        (65.41, 98.00, (261.63, 293.66, 392.00, 523.25), (0, 2, 1, 3), 0.92),
        (58.27, 87.31, (233.08, 293.66, 349.23, 440.00), (0, 1, 2, 3), 0.90),
        (65.41, 98.00, (261.63, 293.66, 392.00, 523.25), (2, 1, 0, 1), 0.86),
        (98.00, 146.83, (196.00, 233.08, 293.66, 440.00), (0, 1, 2), 0.78),
        (55.00, 73.42, (293.66, 329.63, 440.00, 587.33), (0, 1, 2), 0.72),
        (73.42, 110.00, (293.66, 369.99, 440.00, 659.25), (0, 1, 2), 0.68),
    )

    bar_duration = BEAT * 4.0
    for bar_index, (root, fifth, notes, pattern, dynamic) in enumerate(bars):
        bar_start = bar_index * bar_duration + 0.12
        add_piano_note(
            mix,
            bar_start,
            root,
            gain=0.115 * dynamic,
            duration=4.4,
            decay=0.55,
            pan=-0.10,
        )
        add_piano_note(
            mix,
            bar_start + BEAT * 2.0,
            fifth,
            gain=0.070 * dynamic,
            duration=3.2,
            decay=0.72,
            pan=0.08,
        )

        spacing = 3.0 / max(1, len(pattern) - 1) if len(pattern) > 1 else 0.0
        for note_index, note_position in enumerate(pattern):
            note_at = bar_start + BEAT * (0.48 + spacing * note_index)
            add_piano_note(
                mix,
                note_at,
                notes[note_position],
                gain=0.052 * dynamic,
                duration=2.25,
                decay=1.05,
                pan=-0.14 if note_index % 2 == 0 else 0.14,
            )

    # Only four product events interrupt the piano, and each is visible:
    # boarding, takeoff, arrival, and the passport stamp.
    add_bell(mix, 21.65, 440.00, 0.52, gain=0.070, pan=-0.16)
    add_bell(mix, 22.03, 554.37, 0.59, gain=0.070, pan=0.16)
    add_riser(mix, 26.2, 1.65, 82.0, 132.0, gain=0.060)
    add_riser(mix, 38.25, 1.55, 128.0, 76.0, gain=0.052)
    add_bell(mix, 38.38, 349.23, 0.76, gain=0.030, pan=-0.12)
    add_bell(mix, 38.92, 293.66, 0.80, gain=0.026, pan=0.12)
    add_stamp(mix, 40.05)

    master_fade = np.ones(FRAME_COUNT, dtype=np.float32)
    master_fade[: round(0.7 * SAMPLE_RATE)] = smoothstep(
        np.linspace(0.0, 1.0, round(0.7 * SAMPLE_RATE), dtype=np.float32)
    )
    master_fade[-round(2.0 * SAMPLE_RATE) :] = smoothstep(
        np.linspace(1.0, 0.0, round(2.0 * SAMPLE_RATE), dtype=np.float32)
    )
    mix *= master_fade[:, None]

    # Soft saturation catches stacked transitions without flattening the dynamics.
    mix = np.tanh(mix * 1.35) / 1.35
    peak = float(np.max(np.abs(mix))) or 1.0
    if peak > 0.88:
        mix *= 0.88 / peak
    return mix


def write_wave(path: Path, audio: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    pcm = np.round(np.clip(audio, -1.0, 1.0) * 32_767.0).astype("<i2")
    with wave.open(str(path), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(SAMPLE_RATE)
        output.writeframes(pcm.tobytes())


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path, help="Destination WAV path")
    args = parser.parse_args()
    write_wave(args.output, render_score())


if __name__ == "__main__":
    main()
