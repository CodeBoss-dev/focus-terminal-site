#!/usr/bin/env python3
"""Render the original, procedural score for the WindowSeat launch film.

The score uses a focused electronic pulse, instrument-panel textures, and the
app's own tonal language. Every accent is either on the musical grid or tied to
a visible product event.
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
TEMPO = 105.0
BEAT = 60.0 / TEMPO
SCORE_START = 0.43


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


def add_kick(mix: np.ndarray, at: float, gain: float) -> None:
    duration = 0.34
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    frequency = 48.0 + 52.0 * np.exp(-18.0 * time)
    phase = 2.0 * math.pi * np.cumsum(frequency) / SAMPLE_RATE
    shape = (1.0 - np.exp(-150.0 * time)) * np.exp(-11.0 * time)
    voice = (np.sin(phase) + 0.18 * np.sin(phase * 2.0)) * shape
    add_mono(mix, voice.astype(np.float32), at, gain=gain)


def add_rim(mix: np.ndarray, at: float, gain: float, pan: float = 0.0) -> None:
    duration = 0.11
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    shape = (1.0 - np.exp(-260.0 * time)) * np.exp(-42.0 * time)
    voice = (
        np.sin(2.0 * math.pi * 1_180.0 * time)
        + 0.62 * np.sin(2.0 * math.pi * 1_790.0 * time + 0.2)
        + 0.24 * np.sin(2.0 * math.pi * 2_620.0 * time + 0.7)
    ) * shape
    add_mono(mix, voice.astype(np.float32), at, gain=gain, pan=pan)


def add_hat(mix: np.ndarray, at: float, gain: float, pan: float) -> None:
    duration = 0.065
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    generator = np.random.default_rng(0x5748 + round(at * 100))
    noise = generator.standard_normal(count).astype(np.float32)
    high = np.empty_like(noise)
    high[0] = noise[0]
    high[1:] = noise[1:] - noise[:-1] * 0.92
    shape = ((1.0 - np.exp(-320.0 * time)) * np.exp(-58.0 * time)).astype(np.float32)
    add_mono(mix, high * shape, at, gain=gain, pan=pan)


def add_bass_note(
    mix: np.ndarray,
    at: float,
    frequency: float,
    gain: float,
) -> None:
    duration = BEAT * 1.35
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    shape = ((1.0 - np.exp(-95.0 * time)) * np.exp(-2.9 * time)).astype(np.float32)
    voice = (
        np.sin(2.0 * math.pi * frequency * time)
        + 0.20 * np.sin(2.0 * math.pi * frequency * 2.0 * time)
    ).astype(np.float32)
    add_mono(mix, voice * shape, at, gain=gain)


def add_synth_pluck(
    mix: np.ndarray,
    at: float,
    frequency: float,
    gain: float,
    pan: float,
    duration: float = 0.92,
    decay: float = 4.2,
) -> None:
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    carrier = 2.0 * math.pi * frequency * time
    modulation = 1.35 * np.exp(-7.5 * time) * np.sin(carrier * 2.01)
    shape = (1.0 - np.exp(-190.0 * time)) * np.exp(-decay * time)
    voice = (
        np.sin(carrier + modulation)
        + 0.16 * np.sin(carrier * 2.0 + 0.18)
        + 0.05 * np.sin(carrier * 3.0 + 0.42)
    ) * shape
    voice = voice.astype(np.float32)
    add_mono(mix, voice, at, gain=gain, pan=pan)
    add_mono(mix, voice, at + 0.105, gain=gain * 0.11, pan=-pan * 0.65)


def add_ui_click(mix: np.ndarray, at: float, gain: float, pan: float = 0.0) -> None:
    duration = 0.052
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    shape = ((1.0 - np.exp(-420.0 * time)) * np.exp(-72.0 * time)).astype(np.float32)
    voice = (
        np.sin(2.0 * math.pi * 1_480.0 * time)
        + 0.42 * np.sin(2.0 * math.pi * 2_310.0 * time + 0.3)
    ).astype(np.float32)
    add_mono(mix, voice * shape, at, gain=gain, pan=pan)


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

    # Twenty-two compact phrases follow the film's motion at 105 BPM. The
    # arrangement moves like a focus session: choose, commit, work, arrive.
    bars = (
        (73.42, (293.66, 349.23, 440.00, 659.25), (0, 2), 0.48),
        (73.42, (293.66, 349.23, 440.00, 659.25), (0, 1), 0.56),
        (58.27, (233.08, 293.66, 349.23, 440.00), (0, 1, 2, 3), 0.66),
        (65.41, (261.63, 293.66, 392.00, 523.25), (0, 2, 1, 3), 0.69),
        (73.42, (293.66, 349.23, 440.00, 659.25), (0, 1, 2, 3), 0.72),
        (87.31, (220.00, 261.63, 349.23, 392.00), (1, 2, 3, 2), 0.74),
        (65.41, (261.63, 293.66, 392.00, 523.25), (0, 1, 2, 1), 0.76),
        (73.42, (293.66, 349.23, 440.00, 659.25), (0, 2, 1, 3), 0.80),
        (98.00, (196.00, 233.08, 293.66, 440.00), (0, 1, 2, 3), 0.80),
        (58.27, (233.08, 293.66, 349.23, 440.00), (0, 2), 0.68),
        (65.41, (261.63, 293.66, 392.00, 523.25), (0, 1), 0.64),
        (73.42, (293.66, 349.23, 440.00, 659.25), (0, 1, 2), 0.74),
        (73.42, (293.66, 349.23, 440.00, 659.25), (0, 1, 2, 3), 0.88),
        (65.41, (261.63, 293.66, 392.00, 523.25), (0, 2, 1, 3), 0.90),
        (58.27, (233.08, 293.66, 349.23, 440.00), (0, 1, 2, 3), 0.92),
        (87.31, (220.00, 261.63, 349.23, 392.00), (1, 2, 3, 2), 0.90),
        (65.41, (261.63, 293.66, 392.00, 523.25), (2, 1, 0, 1), 0.84),
        (98.00, (196.00, 233.08, 293.66, 440.00), (0, 2), 0.68),
        (58.27, (233.08, 293.66, 349.23, 440.00), (0, 1), 0.70),
        (73.42, (293.66, 369.99, 440.00, 659.25), (0, 1, 2, 3), 0.80),
        (65.41, (261.63, 329.63, 392.00, 587.33), (0, 2, 1, 3), 0.74),
        (73.42, (293.66, 369.99, 440.00, 659.25), (0, 1), 0.66),
    )

    bar_duration = BEAT * 4.0
    for bar_index, (root, notes, pattern, dynamic) in enumerate(bars):
        bar_start = SCORE_START + bar_index * bar_duration

        if bar_index in {1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 18, 19, 20}:
            add_bass_note(mix, bar_start, root, gain=0.105 * dynamic)
            add_bass_note(mix, bar_start + BEAT * 2.0, root, gain=0.075 * dynamic)
        elif bar_index == 21:
            add_bass_note(mix, bar_start, root, gain=0.095 * dynamic)

        if bar_index == 1:
            for beat in (0.0, 2.0):
                add_kick(mix, bar_start + BEAT * beat, gain=0.085)
        elif 2 <= bar_index <= 8:
            for beat in (0.0, 2.0 if bar_index % 2 == 0 else 2.5):
                add_kick(mix, bar_start + BEAT * beat, gain=0.10)
            for beat in (1.0, 3.0):
                add_rim(mix, bar_start + BEAT * beat, gain=0.024, pan=0.08)
            for hat_index, beat in enumerate((0.5, 1.5, 2.5, 3.5)):
                add_hat(
                    mix,
                    bar_start + BEAT * beat,
                    gain=0.010,
                    pan=-0.20 if hat_index % 2 == 0 else 0.20,
                )
        elif bar_index in {9, 10}:
            add_kick(mix, bar_start, gain=0.076)
            for beat in (1.5, 3.5):
                add_hat(mix, bar_start + BEAT * beat, gain=0.008, pan=0.14)
        elif bar_index == 11:
            add_kick(mix, bar_start, gain=0.082)
            for hat_index, beat in enumerate((2.5, 3.0, 3.5)):
                add_hat(
                    mix,
                    bar_start + BEAT * beat,
                    gain=0.009 + hat_index * 0.002,
                    pan=-0.12 + hat_index * 0.12,
                )
        elif 12 <= bar_index <= 16:
            for beat in (0.0, 2.5):
                add_kick(mix, bar_start + BEAT * beat, gain=0.115)
            for beat in (1.0, 3.0):
                add_rim(mix, bar_start + BEAT * beat, gain=0.027, pan=0.10)
            for hat_index, beat in enumerate((0.5, 1.5, 2.0, 3.5)):
                add_hat(
                    mix,
                    bar_start + BEAT * beat,
                    gain=0.012,
                    pan=-0.22 if hat_index % 2 == 0 else 0.22,
                )
        elif bar_index in {18, 19, 20}:
            for beat in (0.0, 2.0):
                add_kick(mix, bar_start + BEAT * beat, gain=0.082)
            add_rim(mix, bar_start + BEAT * 3.0, gain=0.020, pan=0.08)

        spacing = 3.0 / max(1, len(pattern) - 1) if len(pattern) > 1 else 0.0
        for note_index, note_position in enumerate(pattern):
            note_at = bar_start + BEAT * (0.48 + spacing * note_index)
            add_synth_pluck(
                mix,
                note_at,
                notes[note_position],
                gain=0.045 * dynamic,
                pan=-0.18 if note_index % 2 == 0 else 0.18,
            )

    # Interface feedback is tied to visible state changes rather than every cut.
    add_ui_click(mix, 5.00, gain=0.052, pan=-0.12)
    add_ui_click(mix, 10.50, gain=0.045, pan=0.12)
    add_ui_click(mix, 13.00, gain=0.042, pan=-0.08)
    add_ui_click(mix, 13.15, gain=0.035, pan=0.08)
    add_ui_click(mix, 17.00, gain=0.048, pan=0.10)

    # Boarding, takeoff, arrival, and stamping retain the app's sonic language.
    add_bell(mix, 21.65, 440.00, 0.52, gain=0.070, pan=-0.16)
    add_bell(mix, 22.03, 554.37, 0.59, gain=0.070, pan=0.16)
    add_riser(mix, 26.2, 1.65, 82.0, 132.0, gain=0.056)
    add_riser(mix, 38.25, 1.55, 128.0, 76.0, gain=0.048)
    add_bell(mix, 38.38, 349.23, 0.76, gain=0.030, pan=-0.12)
    add_bell(mix, 38.92, 293.66, 0.80, gain=0.026, pan=0.12)
    add_stamp(mix, 40.05)

    # The final product mark gets one confident, bright electronic resolution.
    add_ui_click(mix, 43.00, gain=0.050)
    for note_index, frequency in enumerate((293.66, 369.99, 440.00, 659.25)):
        add_synth_pluck(
            mix,
            45.05 + note_index * 0.11,
            frequency,
            gain=0.048 - note_index * 0.004,
            pan=-0.18 + note_index * 0.12,
            duration=3.2,
            decay=1.25,
        )
    add_synth_pluck(
        mix,
        48.55,
        587.33,
        gain=0.028,
        pan=0.0,
        duration=1.6,
        decay=2.0,
    )

    master_fade = np.ones(FRAME_COUNT, dtype=np.float32)
    master_fade[: round(0.7 * SAMPLE_RATE)] = smoothstep(
        np.linspace(0.0, 1.0, round(0.7 * SAMPLE_RATE), dtype=np.float32)
    )
    master_fade[-round(1.25 * SAMPLE_RATE) :] = smoothstep(
        np.linspace(1.0, 0.0, round(1.25 * SAMPLE_RATE), dtype=np.float32)
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
