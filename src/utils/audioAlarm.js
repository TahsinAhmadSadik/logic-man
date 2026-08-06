// Web Audio API Beep Generator (No external audio files needed!)
let audioCtx = null;
let alarmInterval = null;

export const playBeep = () => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz (A5 pitch)

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch (err) {
    console.error('Audio playback error:', err);
  }
};

export const startAlarmBeeping = () => {
  if (alarmInterval) return;
  playBeep();
  alarmInterval = setInterval(playBeep, 600); // Beep every 600ms
};

export const stopAlarmBeeping = () => {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
};