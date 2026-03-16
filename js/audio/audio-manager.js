// Procedural audio using Web Audio API
// Calm ambient office atmosphere with interaction SFX
export class AudioManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.initialized = false;
        this.tickInterval = null;
        this.ambienceNodes = [];
        this._musicInterval = null;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();

            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.25;
            this.masterGain.connect(this.ctx.destination);

            // Separate gain for music vs SFX
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.85;
            this.musicGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.7;
            this.sfxGain.connect(this.masterGain);

            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio not available:', e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    startAmbience() {
        if (!this.initialized) return;
        this._createRoomTone();
        this._createOfficeMusic();
    }

    // Subtle brown noise room tone
    _createRoomTone() {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            last = (last + 0.02 * white) / 1.02;
            data[i] = last * 3.5;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 100;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.06;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);
        source.start();
        this.ambienceNodes.push(source);
    }

    // Office lo-fi music — upbeat funky groove with rhythm
    _createOfficeMusic() {
        const chords = [
            { notes: [261.63, 329.63, 392.00, 493.88], bass: 130.81 }, // Cmaj7
            { notes: [220.00, 261.63, 329.63, 415.30], bass: 110.00 }, // Am9
            { notes: [293.66, 349.23, 440.00, 523.25], bass: 146.83 }, // Dm7
            { notes: [196.00, 246.94, 293.66, 369.99], bass: 98.00 },  // G9
            { notes: [174.61, 220.00, 277.18, 349.23], bass: 87.31 },  // Fmaj9
            { notes: [164.81, 207.65, 261.63, 329.63], bass: 82.41 },  // Em7
            { notes: [220.00, 277.18, 329.63, 415.30], bass: 110.00 }, // Am9
            { notes: [196.00, 246.94, 311.13, 369.99], bass: 98.00 },  // G9
        ];

        let chordIndex = 0;
        const CHORD_DUR = 2.5; // faster chord changes
        const BEAT = CHORD_DUR / 4; // 4 beats per chord

        const playChord = () => {
            if (!this.initialized || !this.ctx || this.ctx.state === 'closed') return;

            const c = chords[chordIndex % chords.length];
            chordIndex++;
            const now = this.ctx.currentTime;

            // ── Staccato chord stabs (funky rhythm) ──
            const stabPattern = [0, 1.5, 3]; // beats 1, off-beat 2, beat 4
            for (const beatPos of stabPattern) {
                const t = now + beatPos * BEAT;
                for (const freq of c.notes) {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const filter = this.ctx.createBiquadFilter();

                    osc.type = 'triangle';
                    osc.frequency.value = freq;
                    osc.detune.value = (Math.random() - 0.5) * 6;

                    filter.type = 'lowpass';
                    filter.frequency.value = 1200;

                    gain.gain.setValueAtTime(0, t);
                    gain.gain.linearRampToValueAtTime(0.032, t + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.005, t + BEAT * 0.8);
                    gain.gain.linearRampToValueAtTime(0, t + BEAT * 0.9);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.musicGain);
                    osc.start(t);
                    osc.stop(t + BEAT + 0.1);
                }
            }

            // ── Punchy bass (syncopated rhythm) ──
            const bassPattern = [0, 1.5, 2.5]; // root, syncopated hits
            const bassNotes = [c.bass, c.bass, c.bass * 1.5]; // root, root, fifth
            bassPattern.forEach((beatPos, i) => {
                const t = now + beatPos * BEAT;
                const bassOsc = this.ctx.createOscillator();
                const bassGain = this.ctx.createGain();
                const bassFilter = this.ctx.createBiquadFilter();

                bassOsc.type = 'triangle';
                bassOsc.frequency.value = bassNotes[i];
                bassFilter.type = 'lowpass';
                bassFilter.frequency.value = 300;

                bassGain.gain.setValueAtTime(0, t);
                bassGain.gain.linearRampToValueAtTime(0.07, t + 0.02);
                bassGain.gain.exponentialRampToValueAtTime(0.001, t + BEAT * 1.2);

                bassOsc.connect(bassFilter);
                bassFilter.connect(bassGain);
                bassGain.connect(this.musicGain);
                bassOsc.start(t);
                bassOsc.stop(t + BEAT * 1.3);
            });

            // ── Hi-hat pattern (noise-based percussion) ──
            for (let beat = 0; beat < 4; beat++) {
                const t = now + beat * BEAT;
                const isOffBeat = beat % 2 === 1;

                const bufLen = Math.floor(this.ctx.sampleRate * 0.04);
                const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
                const d = buf.getChannelData(0);
                for (let j = 0; j < bufLen; j++) {
                    d[j] = (Math.random() * 2 - 1) * (1 - j / bufLen);
                }

                const src = this.ctx.createBufferSource();
                src.buffer = buf;

                const hpf = this.ctx.createBiquadFilter();
                hpf.type = 'highpass';
                hpf.frequency.value = 7000;

                const g = this.ctx.createGain();
                const vol = isOffBeat ? 0.025 : 0.015;
                g.gain.setValueAtTime(vol, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

                src.connect(hpf);
                hpf.connect(g);
                g.connect(this.musicGain);
                src.start(t);
                src.stop(t + 0.05);

                // Extra open hat on off-beats
                if (isOffBeat) {
                    const bufLen2 = Math.floor(this.ctx.sampleRate * 0.08);
                    const buf2 = this.ctx.createBuffer(1, bufLen2, this.ctx.sampleRate);
                    const d2 = buf2.getChannelData(0);
                    for (let j = 0; j < bufLen2; j++) {
                        d2[j] = (Math.random() * 2 - 1) * (1 - j / bufLen2);
                    }
                    const src2 = this.ctx.createBufferSource();
                    src2.buffer = buf2;
                    const hpf2 = this.ctx.createBiquadFilter();
                    hpf2.type = 'highpass';
                    hpf2.frequency.value = 5000;
                    const g2 = this.ctx.createGain();
                    g2.gain.setValueAtTime(0.018, t);
                    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
                    src2.connect(hpf2);
                    hpf2.connect(g2);
                    g2.connect(this.musicGain);
                    src2.start(t);
                    src2.stop(t + 0.09);
                }
            }

            // ── Bouncy arpeggio melody (plucky, faster) ──
            const melodyNotes = [c.notes[2], c.notes[3], c.notes[1], c.notes[3],
                                 c.notes[0], c.notes[2], c.notes[3], c.notes[1]];
            const melodyBeats = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
            melodyBeats.forEach((beatPos, i) => {
                // Skip some notes randomly for variation
                if (Math.random() < 0.3) return;
                const t = now + beatPos * BEAT;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.value = melodyNotes[i % melodyNotes.length] * 2;

                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.03, t + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, t + BEAT * 0.7);

                osc.connect(gain);
                gain.connect(this.musicGain);
                osc.start(t);
                osc.stop(t + BEAT * 0.8);
            });
        };

        playChord();
        this._musicInterval = setInterval(playChord, CHORD_DUR * 1000);
    }

    // Dialogue interaction start — gentle chime
    playDialogueStart() {
        if (!this.initialized) return;
        const now = this.ctx.currentTime;

        const notes = [523.25, 659.25]; // C5, E5
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const t = now + i * 0.08;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t);
            osc.stop(t + 0.35);
        });
    }

    // Dialogue blip per character
    playDialogueBlip(pitch) {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = pitch || (300 + Math.random() * 100);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    // Door open sound — low whoosh
    playDoorOpen() {
        if (!this.initialized) return;
        const now = this.ctx.currentTime;

        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        let last = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            last = (last + 0.1 * white) / 1.1;
            data[i] = last * 2;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 200;
        filter.Q.value = 0.5;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        source.start(now);
        source.stop(now + 0.3);
    }

    // Printer noise — mechanical buzz
    playPrinterNoise() {
        if (!this.initialized) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.5);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
        gain.gain.setValueAtTime(0.03, now + 0.4);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.55);
    }

    // Coffee machine — gurgling/dripping
    playCoffeeMachine() {
        if (!this.initialized) return;
        const now = this.ctx.currentTime;

        for (let i = 0; i < 4; i++) {
            const t = now + i * 0.15;
            const bufLen = this.ctx.sampleRate * 0.12;
            const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
            const d = buf.getChannelData(0);

            let last = 0;
            for (let j = 0; j < bufLen; j++) {
                const w = Math.random() * 2 - 1;
                last = (last + 0.15 * w) / 1.15;
                d[j] = last * 3;
            }

            const src = this.ctx.createBufferSource();
            src.buffer = buf;

            const filt = this.ctx.createBiquadFilter();
            filt.type = 'bandpass';
            filt.frequency.value = 300 + Math.random() * 200;
            filt.Q.value = 2;

            const g = this.ctx.createGain();
            g.gain.setValueAtTime(0.04, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

            src.connect(filt);
            filt.connect(g);
            g.connect(this.sfxGain);
            src.start(t);
            src.stop(t + 0.12);
        }
    }

    // Timer tick (used in final minute) — softer
    playTick() {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 660;

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    }

    startTickTimer(interval) {
        this.stopTickTimer();
        this.tickInterval = setInterval(() => this.playTick(), interval);
    }

    stopTickTimer() {
        if (this.tickInterval) {
            clearInterval(this.tickInterval);
            this.tickInterval = null;
        }
    }

    destroy() {
        this.stopTickTimer();
        if (this._musicInterval) {
            clearInterval(this._musicInterval);
            this._musicInterval = null;
        }
        for (const node of this.ambienceNodes) {
            try { node.stop(); } catch (e) {}
        }
        this.ambienceNodes = [];
        if (this.ctx) {
            this.ctx.close();
        }
        this.initialized = false;
    }
}
