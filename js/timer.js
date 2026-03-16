import { TIMER_START, TIMER_WARNING, TIMER_CRITICAL } from './constants.js';

export class Timer {
    constructor() {
        this.remaining = TIMER_START * 1000; // milliseconds
        this.running = false;
    }

    start() {
        this.remaining = TIMER_START * 1000;
        this.running = true;
    }

    update(dt) {
        if (!this.running) return;
        this.remaining -= dt;
        if (this.remaining <= 0) {
            this.remaining = 0;
            this.running = false;
        }
    }

    deduct(seconds) {
        this.remaining -= seconds * 1000;
        if (this.remaining < 0) this.remaining = 0;
    }

    add(seconds) {
        this.remaining += seconds * 1000;
    }

    isExpired() {
        return this.remaining <= 0;
    }

    getSeconds() {
        return Math.ceil(this.remaining / 1000);
    }

    getFormatted() {
        const totalSec = Math.ceil(this.remaining / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    }

    isWarning() {
        return this.getSeconds() <= TIMER_WARNING && this.getSeconds() > TIMER_CRITICAL;
    }

    isCritical() {
        return this.getSeconds() <= TIMER_CRITICAL;
    }

    // 0 to 1, where 1 = full time, 0 = expired
    getProgress() {
        return this.remaining / (TIMER_START * 1000);
    }

    reset() {
        this.remaining = TIMER_START * 1000;
        this.running = false;
    }
}
