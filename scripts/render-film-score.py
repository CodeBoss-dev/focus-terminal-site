#!/usr/bin/env python3
"""Render the original, procedural score for the Focus Terminal launch film.

The score uses a focused electronic pulse, instrument-panel textures, and the
app's own tonal language. Every accent is tied to a visible product event, while
scene-shaped harmonic air and diffused tails keep those accents from feeling
like disconnected audio cuts.
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
TEMPO = 120.0
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


def add_split_flap(
    mix: np.ndarray,
    at: float,
    pitch: float,
    gain: float,
    pan: float = 0.0,
) -> None:
    duration = 0.105
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    generator = np.random.default_rng(0x464C4150 + round(at * 100))
    noise = generator.standard_normal(count).astype(np.float32)
    snap = (
        np.sin(2.0 * math.pi * pitch * time)
        + 0.34 * np.sin(2.0 * math.pi * pitch * 1.91 * time + 0.45)
    ).astype(np.float32)
    first = np.exp(-62.0 * time).astype(np.float32)
    second_time = np.maximum(0.0, time - 0.038)
    second = (time >= 0.038).astype(np.float32) * np.exp(-74.0 * second_time).astype(np.float32)
    signal = snap * (first + second * 0.58) + noise * first * 0.075
    add_mono(mix, signal, at, gain=gain, pan=pan)


def add_noise_gesture(
    mix: np.ndarray,
    start: float,
    duration: float,
    gain: float,
    seed: int,
    pan: float = 0.0,
    reverse: bool = False,
) -> None:
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    generator = np.random.default_rng(seed)
    noise = generator.standard_normal(count).astype(np.float32)
    smooth = np.convolve(noise, np.ones(18, dtype=np.float32) / 18.0, mode="same")
    texture = noise * 0.34 + smooth * 0.82
    progress = time / duration
    if reverse:
        shape = smoothstep(progress.astype(np.float32))
        shape *= smoothstep(np.minimum((1.0 - progress) / 0.10, 1.0).astype(np.float32))
    else:
        shape = smoothstep(np.minimum(progress / 0.10, 1.0).astype(np.float32))
        shape *= smoothstep((1.0 - progress).astype(np.float32))
    add_mono(mix, texture * shape, start, gain=gain, pan=pan)


def add_focus_pad(
    mix: np.ndarray,
    start: float,
    duration: float,
    root: float,
    gain: float,
    phase_offset: float,
) -> None:
    """Add a quiet, scene-bound electronic cushion with soft crossfade edges."""
    count = round(duration * SAMPLE_RATE)
    time = np.arange(count, dtype=np.float64) / SAMPLE_RATE
    attack = min(0.72, duration * 0.24)
    release = min(0.92, duration * 0.30)
    shape = envelope(count, attack=attack, release=release)
    breath = 0.84 + 0.16 * np.sin(
        2.0 * math.pi * 0.17 * time + phase_offset
    )
    drift = 0.075 * np.sin(2.0 * math.pi * 0.11 * time + phase_offset)

    left = (
        0.62 * np.sin(2.0 * math.pi * root * 0.997 * time + drift)
        + 0.29 * np.sin(2.0 * math.pi * root * 1.498 * time + 0.6)
        + 0.16 * np.sin(2.0 * math.pi * root * 2.247 * time + 1.1)
    )
    right = (
        0.62 * np.sin(2.0 * math.pi * root * 1.003 * time - drift)
        + 0.29 * np.sin(2.0 * math.pi * root * 1.502 * time + 0.9)
        + 0.16 * np.sin(2.0 * math.pi * root * 2.253 * time + 1.4)
    )
    pad_shape = (shape * breath).astype(np.float32)
    add_mono(mix, left.astype(np.float32) * pad_shape, start, gain=gain, pan=-0.28)
    add_mono(mix, right.astype(np.float32) * pad_shape, start, gain=gain, pan=0.28)


def add_diffused_tails(mix: np.ndarray) -> None:
    """Give short cues a restrained room tail without moving their attack."""
    source = mix.copy()
    taps = (
        (0.073, 0.105, False),
        (0.149, 0.070, True),
        (0.271, 0.044, False),
        (0.463, 0.027, True),
        (0.697, 0.015, False),
    )
    for delay, gain, crossfeed in taps:
        frames = round(delay * SAMPLE_RATE)
        if crossfeed:
            mix[frames:, 0] += source[:-frames, 1] * gain
            mix[frames:, 1] += source[:-frames, 0] * gain
        else:
            mix[frames:] += source[:-frames] * gain


def add_scene_hit(mix: np.ndarray, at: float, gain: float) -> None:
    add_kick(mix, at, gain=gain)
    add_synth_pluck(
        mix,
        at + 0.015,
        146.83,
        gain=gain * 0.42,
        pan=0.0,
        duration=1.1,
        decay=3.1,
    )


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

    motif = (293.66, 440.00, 659.25, 392.00)

    # Each cushion belongs to one shot or thought. Their overlaps crossfade at
    # the edit points, creating continuity without an independent backing track.
    scene_pads = (
        (0.55, 4.82, 146.83, 0.0068),
        (4.60, 6.30, 110.00, 0.0072),
        (10.24, 7.18, 164.81, 0.0068),
        (16.76, 5.16, 196.00, 0.0064),
        (21.26, 5.17, 146.83, 0.0070),
        (25.76, 8.18, 110.00, 0.0074),
        (33.24, 6.10, 164.81, 0.0067),
        (38.64, 4.82, 196.00, 0.0064),
        (42.76, 7.32, 146.83, 0.0072),
    )
    for index, (start, duration, root, gain) in enumerate(scene_pads):
        add_focus_pad(
            mix,
            start,
            duration,
            root,
            gain,
            phase_offset=index * 0.71,
        )

    # 00.00–04.97 · The hook assembles character by character. The flap
    # mechanics become the rhythm, then the amber line completes the motif.
    hook_flaps = (0.93, 1.17, 1.53, 1.97, 2.27, 2.47, 3.47)
    for index, at in enumerate(hook_flaps):
        add_split_flap(
            mix,
            at,
            pitch=470.0 + (index % 4) * 72.0,
            gain=0.036 if at < 3.0 else 0.046,
            pan=-0.22 + (index % 4) * 0.14,
        )
    add_synth_pluck(mix, 2.47, motif[0], gain=0.026, pan=-0.12, duration=1.6, decay=2.0)
    add_synth_pluck(mix, 3.47, motif[1], gain=0.030, pan=0.12, duration=1.5, decay=2.1)
    add_noise_gesture(mix, 4.70, 0.27, gain=0.016, seed=0x0500, reverse=True)
    add_scene_hit(mix, 4.97, gain=0.105)

    # 04.97–10.57 · Departures rows populate and the yellow selection moves.
    # Each visible board action supplies the next note of the musical phrase.
    departure_events = (5.40, 6.50, 6.73, 7.10, 7.93, 8.33, 8.77)
    for index, at in enumerate(departure_events):
        add_split_flap(
            mix,
            at,
            pitch=330.0 + (index % 3) * 52.0,
            gain=0.037 if index < 4 else 0.046,
            pan=-0.24 + (index % 4) * 0.16,
        )
        add_synth_pluck(
            mix,
            at + 0.025,
            motif[index % len(motif)],
            gain=0.022 if index < 4 else 0.029,
            pan=-0.16 if index % 2 == 0 else 0.16,
            duration=1.0,
            decay=3.0,
        )
    add_bass_note(mix, 5.40, 73.42, gain=0.078)
    add_bass_note(mix, 7.93, 58.27, gain=0.080)
    add_ui_click(mix, 10.03, gain=0.033, pan=0.10)
    add_scene_hit(mix, 10.57, gain=0.090)

    # 10.57–17.07 · Duration and route characters scramble, then lock.
    # The pitches climb with the changing data and stop on confirmation.
    add_noise_gesture(mix, 12.72, 0.22, gain=0.014, seed=0x1300, reverse=True)
    route_events = (12.93, 13.50, 13.73, 14.67, 14.90, 15.13, 15.37)
    route_notes = (293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25)
    for index, (at, frequency) in enumerate(zip(route_events, route_notes)):
        add_split_flap(
            mix,
            at,
            pitch=560.0 + index * 38.0,
            gain=0.039,
            pan=-0.22 + (index % 4) * 0.15,
        )
        add_synth_pluck(
            mix,
            at,
            frequency,
            gain=0.021 + index * 0.001,
            pan=-0.15 if index % 2 == 0 else 0.15,
            duration=0.85,
            decay=3.5,
        )
    add_bass_note(mix, 12.93, 65.41, gain=0.070)
    add_bass_note(mix, 14.67, 73.42, gain=0.074)
    add_bell(mix, 15.97, 659.25, 0.72, gain=0.037, pan=0.08)
    add_scene_hit(mix, 17.07, gain=0.088)

    # 17.07–21.57 · Two statements, two sustained thoughts, then a breath.
    add_synth_pluck(mix, 17.10, 146.83, gain=0.046, pan=-0.08, duration=2.8, decay=1.25)
    add_synth_pluck(mix, 17.18, 440.00, gain=0.027, pan=0.12, duration=2.5, decay=1.45)
    add_synth_pluck(mix, 19.33, 164.81, gain=0.043, pan=-0.10, duration=2.4, decay=1.35)
    add_synth_pluck(mix, 19.42, 523.25, gain=0.025, pan=0.13, duration=2.1, decay=1.55)
    add_noise_gesture(mix, 21.17, 0.40, gain=0.015, seed=0x2157, reverse=True)

    # 21.57–26.07 · The physical boarding pass enters, the seatbelt chime
    # sounds, and the three tear movements are audible as one gesture.
    add_noise_gesture(mix, 21.57, 0.78, gain=0.026, seed=0x2250, pan=-0.14)
    add_scene_hit(mix, 21.57, gain=0.070)
    add_bell(mix, 21.75, 440.00, 0.52, gain=0.064, pan=-0.16)
    add_bell(mix, 22.13, 554.37, 0.59, gain=0.064, pan=0.16)
    tear_events = (24.17, 24.83, 25.13)
    for index, at in enumerate(tear_events):
        add_noise_gesture(
            mix,
            at,
            0.16,
            gain=0.025 + index * 0.005,
            seed=0x2400 + index,
            pan=-0.16 + index * 0.16,
        )
        add_split_flap(
            mix,
            at + 0.015,
            pitch=300.0 - index * 46.0,
            gain=0.037 + index * 0.004,
            pan=-0.12 + index * 0.12,
        )
    add_riser(mix, 25.13, 0.92, 132.0, 72.0, gain=0.046)

    # 26.07–33.57 · The cabin dims, the flight deck appears, and only now does
    # a timer pulse begin. It follows the visible countdown and route motion.
    add_scene_hit(mix, 26.07, gain=0.076)
    add_synth_pluck(mix, 26.10, 146.83, gain=0.043, pan=0.0, duration=2.4, decay=1.35)
    add_noise_gesture(mix, 28.32, 0.58, gain=0.018, seed=0x2887, reverse=True)
    add_riser(mix, 28.43, 0.56, 82.0, 132.0, gain=0.048)
    add_scene_hit(mix, 28.87, gain=0.082)

    flight_ticks = (29.83, 30.30, 30.77, 31.30, 31.80, 32.30, 32.53, 33.03)
    for index, at in enumerate(flight_ticks):
        if index % 2 == 0:
            add_kick(mix, at, gain=0.080)
            add_bass_note(mix, at, 73.42, gain=0.055)
        else:
            add_rim(mix, at, gain=0.020, pan=0.10)
        add_hat(mix, at + 0.23, gain=0.007, pan=-0.16 if index % 2 == 0 else 0.16)
        add_synth_pluck(
            mix,
            at + 0.02,
            motif[index % len(motif)],
            gain=0.020,
            pan=-0.14 if index % 2 == 0 else 0.14,
            duration=0.72,
            decay=4.1,
        )

    # 33.57–38.97 · The pulse cuts with “No feeds”, the second statement
    # answers it, and the landing/stamp sequence carries the resolution.
    add_scene_hit(mix, 33.57, gain=0.074)
    add_synth_pluck(mix, 33.60, 293.66, gain=0.031, pan=-0.10, duration=1.8, decay=1.8)
    add_split_flap(mix, 34.70, pitch=520.0, gain=0.038, pan=0.10)
    add_synth_pluck(mix, 34.72, 440.00, gain=0.029, pan=0.10, duration=1.5, decay=2.0)
    add_riser(mix, 35.72, 0.55, 128.0, 76.0, gain=0.044)
    add_scene_hit(mix, 36.27, gain=0.072)
    add_bell(mix, 36.36, 349.23, 0.76, gain=0.029, pan=-0.12)
    add_bell(mix, 36.88, 293.66, 0.80, gain=0.025, pan=0.12)
    add_noise_gesture(mix, 37.13, 0.34, gain=0.018, seed=0x3747, reverse=True)
    add_stamp(mix, 37.47)
    add_noise_gesture(mix, 38.72, 0.34, gain=0.021, seed=0x3897, pan=0.10)
    add_scene_hit(mix, 38.97, gain=0.065)

    # 38.97–43.07 · Passport details animate in a four-note reprise.
    passport_events = (39.93, 40.63, 41.60, 42.37)
    passport_notes = (392.00, 659.25, 440.00, 293.66)
    for index, (at, frequency) in enumerate(zip(passport_events, passport_notes)):
        add_ui_click(mix, at, gain=0.025, pan=-0.16 + index * 0.10)
        add_synth_pluck(
            mix,
            at + 0.015,
            frequency,
            gain=0.022,
            pan=-0.14 if index % 2 == 0 else 0.14,
            duration=1.1,
            decay=2.8,
        )
    add_scene_hit(mix, 43.07, gain=0.078)

    # 43.07–50.50 · The promise, the wordmark, then the sonic logo. The final
    # chord arrives with the identity rather than running underneath it.
    add_synth_pluck(mix, 43.10, 146.83, gain=0.044, pan=0.0, duration=2.4, decay=1.35)
    add_noise_gesture(mix, 45.30, 0.62, gain=0.016, seed=0x4590, reverse=True)
    add_scene_hit(mix, 45.90, gain=0.078)
    for note_index, frequency in enumerate((293.66, 369.99, 440.00, 659.25)):
        add_synth_pluck(
            mix,
            45.92 + note_index * 0.08,
            frequency,
            gain=0.041 - note_index * 0.003,
            pan=-0.18 + note_index * 0.12,
            duration=3.0,
            decay=1.30,
        )
    for index, at in enumerate((47.23, 47.48, 47.90)):
        add_split_flap(
            mix,
            at,
            pitch=620.0 + index * 85.0,
            gain=0.030,
            pan=-0.12 + index * 0.12,
        )
    add_bell(mix, 48.27, 587.33, 1.40, gain=0.023)

    # Preserve the exact attack of every frame-locked cue while extending its
    # decay into the surrounding scene. This is intentionally subtle.
    add_diffused_tails(mix)

    master_fade = np.ones(FRAME_COUNT, dtype=np.float32)
    master_fade[: round(0.7 * SAMPLE_RATE)] = smoothstep(
        np.linspace(0.0, 1.0, round(0.7 * SAMPLE_RATE), dtype=np.float32)
    )
    master_fade[-round(1.40 * SAMPLE_RATE) :] = smoothstep(
        np.linspace(1.0, 0.0, round(1.40 * SAMPLE_RATE), dtype=np.float32)
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
