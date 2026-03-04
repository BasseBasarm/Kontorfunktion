import { PALETTE as P } from '../graphics/palette.js';
import { cartToIso } from '../utils.js';

// Atmospheric micro-events that happen in the office
// Purely cosmetic — no gameplay blocking in a time-limited game

const EVENT_INTERVAL = [25000, 55000]; // 25-55 seconds between events

const SHOUT_MESSAGES = [
    'Er der nogen der har set min oplader?!',
    'Hvem har taget min kop?!',
    'Printeren virker ikke igen!',
    'Kan nogen hjælpe med F2?!',
    'Mødet er flyttet til lokale 3!',
    'Der er kage i køkkenet!',
    'Har nogen set chefen?',
];

export class MicroEvents {
    constructor() {
        this.timer = this._nextInterval();
        this.activeEvent = null;
        this.eventTimer = 0;
    }

    _nextInterval() {
        return EVENT_INTERVAL[0] + Math.random() * (EVENT_INTERVAL[1] - EVENT_INTERVAL[0]);
    }

    update(dt, npcs, tilemap) {
        // Count down active event display
        if (this.activeEvent) {
            this.eventTimer -= dt;
            if (this.eventTimer <= 0) {
                this.activeEvent = null;
            }
        }

        // Count down to next event
        this.timer -= dt;
        if (this.timer <= 0) {
            this.trigger(npcs);
            this.timer = this._nextInterval();
        }
    }

    trigger(npcs) {
        const roll = Math.random();

        if (roll < 0.35) {
            this._triggerPrinterJam();
        } else if (roll < 0.60) {
            this._triggerCoffeeEmpty();
        } else {
            this._triggerShout(npcs);
        }
    }

    _triggerPrinterJam() {
        this.activeEvent = {
            type: 'printer_jam',
            col: 4, row: 6, // printer location
            message: 'PAPIRSTOP!',
        };
        this.eventTimer = 4000;
    }

    _triggerCoffeeEmpty() {
        this.activeEvent = {
            type: 'coffee_empty',
            col: 4, row: 13, // coffee machine location
            message: 'TOM!',
        };
        this.eventTimer = 4000;
    }

    _triggerShout(npcs) {
        // Pick a random interacted NPC to shout, or any NPC
        const candidates = npcs.filter(n => n.hasInteracted && n.type !== 'chief');
        const npc = candidates.length > 0
            ? candidates[Math.floor(Math.random() * candidates.length)]
            : npcs[Math.floor(Math.random() * npcs.length)];

        this.activeEvent = {
            type: 'shout',
            col: npc.col,
            row: npc.row,
            npcId: npc.id,
            message: SHOUT_MESSAGES[Math.floor(Math.random() * SHOUT_MESSAGES.length)],
        };
        this.eventTimer = 3500;
    }

    render(ctx, camera) {
        if (!this.activeEvent) return;

        const ev = this.activeEvent;
        const iso = cartToIso(ev.col, ev.row);
        const screenX = iso.x - camera.x + camera.offsetX;
        const screenY = iso.y - camera.y + camera.offsetY;

        // Fade out near end
        const fadeRatio = Math.min(1, this.eventTimer / 500);
        ctx.globalAlpha = fadeRatio;

        if (ev.type === 'printer_jam') {
            this._renderAlert(ctx, screenX, screenY - 40, ev.message, '#B04040');
        } else if (ev.type === 'coffee_empty') {
            this._renderAlert(ctx, screenX, screenY - 40, ev.message, '#C87040');
        } else if (ev.type === 'shout') {
            this._renderSpeechBubble(ctx, screenX, screenY - 55, ev.message);
        }

        ctx.globalAlpha = 1;
    }

    _renderAlert(ctx, x, y, message, color) {
        // Flashing alert above object
        const flash = Math.sin(Date.now() / 200) > 0;

        // Background pill
        ctx.font = 'bold 7px "Courier New", monospace';
        const w = ctx.measureText(message).width + 8;
        const h = 12;

        ctx.fillStyle = flash ? color : 'rgba(44,40,36,0.85)';
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 3);
        ctx.fill();

        // Border
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text
        ctx.fillStyle = flash ? '#F5F0EA' : color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, x, y);
    }

    _renderSpeechBubble(ctx, x, y, message) {
        ctx.font = '6px "Courier New", monospace';
        const w = Math.min(ctx.measureText(message).width + 10, 100);
        const h = 14;

        // Bubble background
        ctx.fillStyle = P.DIALOGUE_BG;
        ctx.beginPath();
        ctx.roundRect(x - w / 2, y - h / 2, w, h, 4);
        ctx.fill();

        // Border
        ctx.strokeStyle = P.DIALOGUE_BORDER;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Tail
        ctx.fillStyle = P.DIALOGUE_BG;
        ctx.beginPath();
        ctx.moveTo(x - 3, y + h / 2);
        ctx.lineTo(x, y + h / 2 + 5);
        ctx.lineTo(x + 3, y + h / 2);
        ctx.fill();

        // Text (truncate if needed)
        ctx.fillStyle = P.DIALOGUE_TEXT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, x, y, w - 6);
    }
}
