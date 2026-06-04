/**
 * SoundManager.js
 * Web Audio API synthesizer — no external files required.
 * Produces cinematic sound effects using oscillators and noise.
 */

let audioCtx = null;
let muted = false;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function resume() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
}

export function setMuted(val) { muted = val; }
export function getMuted() { return muted; }

/** Creates a noise buffer */
function createNoise(ctx, duration) {
  const sampleRate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  return buffer;
}

/**
 * Iron Man — metallic impact sound
 */
export function playIronManSound() {
  if (muted) return;
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Metallic clang — high frequency ring
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(1200, now);
  osc1.frequency.exponentialRampToValueAtTime(200, now + 1.2);
  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 1.5);

  // Arc reactor hum
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(60, now);
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.15, now + 0.3);
  gain2.gain.linearRampToValueAtTime(0.08, now + 2);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 2);
}

/**
 * Captain America — swoosh sound (shield spin)
 */
export function playCapSound() {
  if (muted) return;
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.linearRampToValueAtTime(800, now + 0.3);
  osc.frequency.exponentialRampToValueAtTime(200, now + 1.2);

  filter.type = 'bandpass';
  filter.frequency.value = 600;
  filter.Q.value = 2;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.3);
}

/**
 * Thor — thunder rumble + lightning crack
 */
export function playThorSound() {
  if (muted) return;
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Thunder rumble using noise
  const noiseBuffer = createNoise(ctx, 3);
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.linearRampToValueAtTime(80, now + 2);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.6, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 3);

  noiseSource.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noiseSource.start(now);

  // Lightning crack
  const crackOsc = ctx.createOscillator();
  const crackGain = ctx.createGain();
  crackOsc.type = 'sawtooth';
  crackOsc.frequency.setValueAtTime(2000, now);
  crackOsc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
  crackGain.gain.setValueAtTime(0.5, now);
  crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  crackOsc.connect(crackGain);
  crackGain.connect(ctx.destination);
  crackOsc.start(now);
  crackOsc.stop(now + 0.15);
}

/**
 * Hulk — low-frequency seismic SMASH
 */
export function playHulkSound() {
  if (muted) return;
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Seismic impact
  const noiseBuffer = createNoise(ctx, 2);
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(120, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.9, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 2);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);

  // Sub bass punch
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = 'sine';
  sub.frequency.setValueAtTime(80, now);
  sub.frequency.exponentialRampToValueAtTime(30, now + 0.8);
  subGain.gain.setValueAtTime(0.8, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 1);
  sub.connect(subGain);
  subGain.connect(ctx.destination);
  sub.start(now);
  sub.stop(now + 1);
}

/**
 * Black Widow — stealth whoosh
 */
export function playWidowSound() {
  if (muted) return;
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.linearRampToValueAtTime(600, now + 0.8);
  osc.frequency.linearRampToValueAtTime(200, now + 1.5);

  filter.type = 'highpass';
  filter.frequency.value = 200;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 2);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 2);
}

/**
 * Assemble — epic cinematic buildup
 */
export function playAssembleSound() {
  if (muted) return;
  resume();
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Cinematic swell
  [55, 110, 220, 440].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.1);
    gain.gain.linearRampToValueAtTime(0.12, now + i * 0.1 + 0.3);
    gain.gain.linearRampToValueAtTime(0.06, now + 3);
    gain.gain.linearRampToValueAtTime(0, now + 4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + 4);
  });
}

export const HeroSounds = {
  ironman: playIronManSound,
  cap: playCapSound,
  thor: playThorSound,
  hulk: playHulkSound,
  widow: playWidowSound,
  hawkeye: playWidowSound, // reuse
};
