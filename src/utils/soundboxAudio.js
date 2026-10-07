// Soundbox Audio Chime & Speech Synthesis Engine

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays the authentic dual-tone UPI Soundbox chime (Ding-Dong!)
 */
export function playSoundboxChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First Tone (D5 - 587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.35, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.38);

    // Second Tone (A5 - 880 Hz) - 140ms later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.14);

    gain2.gain.setValueAtTime(0, now + 0.14);
    gain2.gain.linearRampToValueAtTime(0.45, now + 0.17);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.14);
    osc2.stop(now + 0.75);
  } catch (err) {
    console.error('Audio chime error:', err);
  }
}

/**
 * Speaks the payment announcement in the chosen language
 */
export function speakPaymentAnnouncement(amount, language = 'en', brandName = 'Rakexura') {
  if (!('speechSynthesis' in window)) return;

  const num = parseFloat(amount) || 0;
  if (num <= 0) return;

  window.speechSynthesis.cancel(); // Cancel any existing speech

  let text = '';
  let langCode = 'en-IN';

  if (language === 'hi') {
    langCode = 'hi-IN';
    text = `${brandName} par ${Math.round(num)} rupaye prapt hue.`;
  } else if (language === 'ta') {
    langCode = 'ta-IN';
    text = `${brandName}-il ${Math.round(num)} roobai petrapatathu.`;
  } else {
    langCode = 'en-IN';
    text = `Payment of ${Math.round(num)} Rupees received on ${brandName} UPI.`;
  }

  // Delay speech slightly to let the chime play first
  setTimeout(() => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.slice(0, 2)));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech error:', e);
    }
  }, 450);
}
