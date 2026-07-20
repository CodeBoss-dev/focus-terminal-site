#!/usr/bin/env python3
"""Render the original, procedural score for the WindowSeat launch film.

The score is intentionally sparse. Music carries the edit; product sounds only
appear at narrative transitions, and cabin ambience is limited to the portion
of the film that is actually in flight.
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


def sine(frequency: float, duration: float, phase: float = 0.0) -> np.ndarray:
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    return np.sin(2.0 * math.pi * frequency * time + phase).astype(np.float32)


def add_pad(
    mix: np.ndarray,
    start: float,
    end: float,
    frequencies: tuple[float, ...],
    gain: float,
) -> None:
    duration = end - start
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    shape = envelope(count, attack=2.0, release=2.2)
    shape *= 0.96 + 0.04 * np.sin(2.0 * math.pi * 0.10 * time).astype(np.float32)

    for index, frequency in enumerate(frequencies):
        detune = 1.0025 if index % 2 else 0.9975
        phase = index * 0.71
        voice = (
            np.sin(2.0 * math.pi * frequency * time + phase)
            + 0.22 * np.sin(2.0 * math.pi * frequency * 2.0 * time + phase * 0.6)
            + 0.08 * np.sin(2.0 * math.pi * frequency * detune * time - phase)
        ).astype(np.float32)
        voice *= shape / math.sqrt(len(frequencies))
        add_mono(mix, voice, start, gain=gain, pan=-0.34 + index * 0.17)


def add_pulse(mix: np.ndarray, at: float, frequency: float, gain: float) -> None:
    duration = 0.48
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    decay = np.exp(-7.0 * time).astype(np.float32)
    attack = smoothstep(np.minimum(time / 0.018, 1.0)).astype(np.float32)
    body = (
        np.sin(2.0 * math.pi * frequency * time)
        + 0.18 * np.sin(2.0 * math.pi * frequency * 2.0 * time)
    ).astype(np.float32)
    add_mono(mix, body * decay * attack, at, gain=gain)


def add_pluck(mix: np.ndarray, at: float, frequency: float, gain: float, pan: float) -> None:
    duration = 1.15
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    decay = np.exp(-3.6 * time).astype(np.float32)
    attack = smoothstep(np.minimum(time / 0.012, 1.0)).astype(np.float32)
    voice = (
        np.sin(2.0 * math.pi * frequency * time)
        + 0.16 * np.sin(2.0 * math.pi * frequency * 2.01 * time)
        + 0.06 * np.sin(2.0 * math.pi * frequency * 3.0 * time)
    ).astype(np.float32)
    add_mono(mix, voice * decay * attack, at, gain=gain, pan=pan)


def add_terminal_tick(mix: np.ndarray, at: float, pan: float = 0.0) -> None:
    duration = 0.075
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    decay = np.exp(-55.0 * time).astype(np.float32)
    tick = (
        np.sin(2.0 * math.pi * 1_350.0 * time)
        + 0.45 * np.sin(2.0 * math.pi * 2_760.0 * time)
    ).astype(np.float32)
    add_mono(mix, tick * decay, at, gain=0.035, pan=pan)


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


def colored_noise(duration: float, seed: int, color: float = 0.75) -> np.ndarray:
    count = round(duration * SAMPLE_RATE)
    generator = np.random.default_rng(seed)
    source = generator.standard_normal(count).astype(np.float32)
    spectrum = np.fft.rfft(source)
    frequencies = np.fft.rfftfreq(count, d=1.0 / SAMPLE_RATE)
    weighting = np.ones_like(frequencies)
    weighting[1:] = 1.0 / np.power(np.maximum(frequencies[1:], 28.0), color)
    result = np.fft.irfft(spectrum * weighting, n=count).astype(np.float32)
    peak = float(np.max(np.abs(result))) or 1.0
    return result / peak


def add_cabin_air(mix: np.ndarray, start: float, end: float) -> None:
    duration = end - start
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    noise = colored_noise(duration, seed=0x57494E44, color=1.05)
    body = 0.24 * np.sin(2.0 * math.pi * 73.0 * time).astype(np.float32)
    shape = envelope(count, attack=1.9, release=2.1)
    signal = (noise + body) * shape
    add_mono(mix, signal, start, gain=0.055, pan=-0.08)
    add_mono(mix, np.roll(signal, 317), start, gain=0.050, pan=0.08)


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


def chord_at(at: float) -> tuple[float, tuple[float, ...]]:
    if at < 17.0:
        return 73.42, (293.66, 349.23, 440.00, 659.25)
    if at < 26.0:
        return 58.27, (233.08, 293.66, 440.00, 523.25)
    if at < 38.5:
        return 73.42, (293.66, 349.23, 440.00, 659.25)
    return 65.41, (261.63, 329.63, 392.00, 587.33)


def render_score() -> np.ndarray:
    mix = np.zeros((FRAME_COUNT, 2), dtype=np.float32)

    # Long harmonic phrases mirror the edit's major narrative cuts.
    add_pad(mix, 0.0, 12.4, (73.42, 110.00, 174.61, 329.63), gain=0.060)
    add_pad(mix, 10.5, 23.5, (58.27, 87.31, 146.83, 220.00), gain=0.067)
    add_pad(mix, 21.5, 32.0, (65.41, 98.00, 164.81, 293.66), gain=0.072)
    add_pad(mix, 26.0, 41.5, (73.42, 110.00, 174.61, 329.63), gain=0.080)
    add_pad(mix, 38.5, 46.0, (65.41, 98.00, 164.81, 293.66), gain=0.068)
    add_pad(mix, 43.0, 50.5, (73.42, 110.00, 185.00, 329.63), gain=0.076)

    # A measured pulse gives the middle of the film momentum, then steps back.
    beat_time = 10.5
    pulse_index = 0
    while beat_time < 43.0:
        root, _ = chord_at(beat_time)
        if beat_time < 17.0:
            gain = 0.028
        elif beat_time < 29.0:
            gain = 0.040
        elif beat_time < 38.5:
            gain = 0.047
        else:
            gain = 0.027
        if pulse_index % 2:
            gain *= 0.72
        add_pulse(mix, beat_time, root, gain)
        beat_time += BEAT
        pulse_index += 1

    # Sparse melodic points; never a constant arpeggio competing with the copy.
    pluck_time = 13.0
    pluck_index = 0
    while pluck_time < 42.0:
        _, notes = chord_at(pluck_time)
        frequency = notes[pluck_index % len(notes)]
        add_pluck(
            mix,
            pluck_time,
            frequency,
            gain=0.018 if pluck_time < 26.0 else 0.023,
            pan=-0.32 if pluck_index % 2 == 0 else 0.32,
        )
        pluck_time += BEAT * 2.0
        pluck_index += 1

    # Editorial accents are deliberately limited to story-changing moments.
    add_terminal_tick(mix, 5.0, pan=-0.20)
    add_terminal_tick(mix, 10.5, pan=0.18)
    add_terminal_tick(mix, 13.0, pan=-0.10)
    add_terminal_tick(mix, 13.16, pan=0.10)
    add_terminal_tick(mix, 17.0, pan=0.20)

    # Boarding, takeoff, and arrival use the app's own restrained tonal language.
    add_bell(mix, 21.65, 440.00, 0.52, gain=0.070, pan=-0.16)
    add_bell(mix, 22.03, 554.37, 0.59, gain=0.070, pan=0.16)
    add_riser(mix, 26.2, 1.65, 82.0, 132.0, gain=0.072)
    add_cabin_air(mix, 27.6, 39.2)
    add_riser(mix, 38.25, 1.55, 128.0, 76.0, gain=0.066)
    add_bell(mix, 38.38, 349.23, 0.76, gain=0.035, pan=-0.12)
    add_bell(mix, 38.92, 293.66, 0.80, gain=0.030, pan=0.12)
    add_stamp(mix, 40.05)

    # The brand resolves gently into D major/add9, with room after the last note.
    add_bell(mix, 43.25, 293.66, 1.65, gain=0.040, pan=-0.18)
    add_bell(mix, 43.64, 440.00, 1.75, gain=0.034, pan=0.18)
    add_bell(mix, 44.10, 659.25, 2.10, gain=0.027)

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
