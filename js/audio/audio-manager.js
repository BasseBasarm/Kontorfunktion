// Procedural audio using Web Audio API
export class AudioManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.initialized = false;
        this.tickInterval = null;
    }

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 0.25;
            this.masterGain.connect(this.ctx.destination);
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

        // Room tone — filtered brown noise
        this.createRoomTone();

        // Periodic typing sounds
        this.startTypingSounds();

        // Occasional printer/coffee sounds
        this.startOccasionalSounds();
    }

    createRoomTone() {
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
        filter.frequency.value = 180;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.15;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
    }

    startTypingSounds() {
        const scheduleClick = () => {
            if (!this.initialized) return;
            const delay = 80 + Math.random() * 300;
            setTimeout(() => {
                this.playTypingClick();
                scheduleClick();
            }, delay);
        };
        // Start a few typing "threads"
        scheduleClick();
        setTimeout(() => scheduleClick(), 500);
    }

    playTypingClick() {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.value = 1800 + Math.random() * 800;

        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
    }

    startOccasionalSounds() {
        // Coffee machine gurgle every 30-60s
        const scheduleCoffee = () => {
            if (!this.initialized) return;
            setTimeout(() => {
                this.playCoffeeMachine();
                scheduleCoffee();
            }, 30000 + Math.random() * 30000);
        };
        setTimeout(() => scheduleCoffee(), 10000);

        // Printer every 45-90s
        const schedulePrinter = () => {
            if (!this.initialized) return;
            setTimeout(() => {
                this.playPrinterSound();
                schedulePrinter();
            }, 45000 + Math.random() * 45000);
        };
        setTimeout(() => schedulePrinter(), 20000);
    }

    playCoffeeMachine() {
        if (!this.initialized) return;
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 600;
        filter.Q.value = 2;

        const gain = this.ctx.createGain();
        gain.gain.value = 0.04;

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        source.start();
    }

    playPrinterSound() {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.value = 60;

        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime + 2);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 3);
    }

    // Dialogue blip per character
    playDialogueBlip(pitch) {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = pitch || (300 + Math.random() * 100);

        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
    }

    // Timer tick (used in final minute)
    playTick() {
        if (!this.initialized) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 880;

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
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
        if (this.ctx) {
            this.ctx.close();
        }
        this.initialized = false;
    }
}
