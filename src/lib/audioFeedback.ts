/**
 * Lightweight UI sound engine using the Web Audio API.
 *
 * Generates short, synthetic mechanical "tick"/"click" sounds on demand — no
 * audio asset files are loaded. The AudioContext is created lazily on the first
 * user gesture (required by browser autoplay policies) and reused thereafter.
 */

type SoundType = 'hover' | 'click' | 'toggle' | 'open' | 'close';

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let enabled = false;
let masterVolume = 0.3;
let lastHover = 0;

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
      masterGain = ctx.createGain();
      masterGain.gain.value = masterVolume;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }
    return ctx;
  } catch {
    return null;
  }
}

/** Update the engine's enabled state and master volume from preferences. */
export function configureAudio(opts: { enabled: boolean; volume: number }): void {
  enabled = opts.enabled;
  masterVolume = Math.max(0, Math.min(1, opts.volume));
  if (masterGain) masterGain.gain.value = masterVolume;
}

interface ToneSpec {
  freq: number;
  duration: number;
  type: OscillatorType;
  gain: number;
}

const SOUND_SPECS: Record<SoundType, ToneSpec> = {
  // Very short, high, quiet tick for hover
  hover: { freq: 2200, duration: 0.025, type: 'square', gain: 0.06 },
  // Crisp mechanical click
  click: { freq: 1500, duration: 0.045, type: 'triangle', gain: 0.12 },
  // Two-state toggle blip
  toggle: { freq: 900, duration: 0.05, type: 'sine', gain: 0.1 },
  // Soft rising open
  open: { freq: 660, duration: 0.08, type: 'sine', gain: 0.1 },
  // Soft falling close
  close: { freq: 420, duration: 0.08, type: 'sine', gain: 0.1 },
};

/** Play a synthetic UI sound. No-op when disabled or audio is unavailable. */
export function playSound(type: SoundType): void {
  if (!enabled) return;

  // Throttle hover ticks so rapid pointer movement doesn't machine-gun.
  if (type === 'hover') {
    const now = Date.now();
    if (now - lastHover < 60) return;
    lastHover = now;
  }

  const audio = ensureContext();
  if (!audio || !masterGain) return;

  const spec = SOUND_SPECS[type];
  const t0 = audio.currentTime;

  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = spec.type;
  osc.frequency.setValueAtTime(spec.freq, t0);
  // Slight downward pitch glide gives a more "mechanical" feel.
  osc.frequency.exponentialRampToValueAtTime(spec.freq * 0.7, t0 + spec.duration);

  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(spec.gain, t0 + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + spec.duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(t0);
  osc.stop(t0 + spec.duration + 0.02);

  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}
