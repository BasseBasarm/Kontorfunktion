import { PALETTE as P } from '../graphics/palette.js';
import { cartToIso, gridDistance } from '../utils.js';
import { NPC_STATE } from '../entities/npc-behavior.js';

// Office micro-events — 7 event types that create small delays
// Deadpan bureaucratic tone, all dialogue in Danish

const EVENT_INTERVAL = [22000, 48000]; // 22-48 seconds between events


export class MicroEvents {
    constructor() {
        this.timer = this._nextInterval();
        this.activeEvent = null;
        this.eventTimer = 0;
        this.audio = null;
        this.player = null;

        // Camera pan state (Event 3)
        this.cameraPanTarget = null;
        this.cameraPanPhase = null; // 'delay', 'hold'
        this.cameraPanTimer = 0;
    }

    setAudio(audioManager) { this.audio = audioManager; }
    setPlayer(player) { this.player = player; }

    getCameraPanTarget() {
        return this.cameraPanPhase === 'hold' ? this.cameraPanTarget : null;
    }

    _nextInterval() {
        return EVENT_INTERVAL[0] + Math.random() * (EVENT_INTERVAL[1] - EVENT_INTERVAL[0]);
    }

    update(dt, npcs, tilemap) {
        if (this.activeEvent) {
            this._updateActiveEvent(dt, npcs, tilemap);
        }

        if (this.cameraPanPhase) {
            this._updateCameraPan(dt);
        }

        // Only trigger new events when idle
        if (!this.activeEvent) {
            this.timer -= dt;
            if (this.timer <= 0) {
                this._trigger(npcs, tilemap);
                this.timer = this._nextInterval();
            }
        }
    }

    _trigger(npcs, tilemap) {
        const interacted = npcs.filter(n => n.hasInteracted && n.type !== 'chief');
        if (interacted.length === 0) return;

        const roll = Math.random();
        if (roll < 0.22) {
            this._triggerSpontaneousMeeting(interacted, tilemap);
        } else if (roll < 0.40) {
            this._triggerChiefWasHere(interacted);
        } else if (roll < 0.58) {
            this._triggerPowerpointPanic(interacted, tilemap);
        } else if (roll < 0.72) {
            this._triggerPrinterJam(interacted, tilemap);
        } else if (roll < 0.86) {
            this._triggerCoffeeNoMilk(interacted, tilemap);
        } else {
            this._triggerLoudSigh(interacted);
        }
    }

    // ── Event 1: Spontaneous Meeting ──
    // 2-3 NPCs walk to meeting room, potentially blocking corridor
    _triggerSpontaneousMeeting(candidates, tilemap) {
        if (candidates.length < 2) return;

        const shuffled = [...candidates].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(3, shuffled.length));

        const meetingDoor = { col: 7, row: 10 };
        for (const npc of selected) {
            npc.behavior.walkTo(npc, tilemap, meetingDoor, NPC_STATE.IDLE);
        }

        this.activeEvent = {
            type: 'spontaneous_meeting',
            npcs: selected,
            message: 'Afstemningsmøde NU!',
        };
        this.eventTimer = 5000;
    }

    // ── Event 3: "Kontorchefen var lige her" ──
    // Whisper + camera pans to empty office, then returns
    _triggerChiefWasHere(candidates) {
        if (!this.player) return;

        const npc = candidates[Math.floor(Math.random() * candidates.length)];

        const emptySpots = [
            { col: 17, row: 3 },  // Senior office
            { col: 10, row: 6 },  // North corridor
            { col: 5, row: 12 },  // Lower area
        ];
        const panTarget = emptySpots[Math.floor(Math.random() * emptySpots.length)];

        this.activeEvent = {
            type: 'chief_was_here',
            npc: npc,
            message: '(hvisker) Kontorchefen var lige her...',
        };
        this.eventTimer = 4500;

        // Camera: 1.5s delay, then 1.5s hold on empty spot
        this.cameraPanTarget = panTarget;
        this.cameraPanPhase = 'delay';
        this.cameraPanTimer = 1500;
    }

    // ── Event 4: PowerPoint Panic ──
    // NPC runs around in panic for 4 seconds, may block player
    _triggerPowerpointPanic(candidates, tilemap) {
        const npc = candidates[Math.floor(Math.random() * candidates.length)];

        // Generate random walkable waypoints near the NPC
        const waypoints = [];
        const baseCol = Math.round(npc.col);
        const baseRow = Math.round(npc.row);
        for (let i = 0; i < 8; i++) {
            const tc = baseCol + Math.floor(Math.random() * 7) - 3;
            const tr = baseRow + Math.floor(Math.random() * 7) - 3;
            if (tilemap.isWalkable(tc, tr)) {
                waypoints.push({ col: tc, row: tr });
            }
        }
        if (waypoints.length < 2) return;

        const origSpeed = npc.behavior.walkSpeed;
        npc.behavior.walkSpeed = 5.0;
        npc.behavior.walkTo(npc, tilemap, waypoints[0], NPC_STATE.IDLE);

        this.activeEvent = {
            type: 'powerpoint_panic',
            npc: npc,
            waypoints: waypoints,
            waypointIndex: 0,
            origSpeed: origSpeed,
            message: 'MIN POWERPOINT ER CRASHET!',
        };
        this.eventTimer = 4000;
    }

    // ── Event 5: Printer Jam ──
    // NPC walks to printer frustrated, alert shown
    _triggerPrinterJam(candidates, tilemap) {
        const npc = candidates[Math.floor(Math.random() * candidates.length)];
        const printer = { col: 4, row: 5 };
        npc.behavior.walkTo(npc, tilemap, printer, NPC_STATE.AT_PRINTER);

        this.activeEvent = {
            type: 'printer_jam',
            npc: npc,
            message: 'Printeren sidder FAST igen!',
        };
        this.eventTimer = 4000;
    }

    // ── Event 6: Coffee Out of Milk ──
    // NPC at coffee machine, disappointed announcement
    _triggerCoffeeNoMilk(candidates, tilemap) {
        const npc = candidates[Math.floor(Math.random() * candidates.length)];
        const coffee = { col: 4, row: 14 };
        npc.behavior.walkTo(npc, tilemap, coffee, NPC_STATE.AT_COFFEE);

        this.activeEvent = {
            type: 'coffee_no_milk',
            npc: npc,
            message: 'Der er INGEN mælk til kaffen!',
        };
        this.eventTimer = 3500;
    }

    // ── Event 7: Loud Sigh ──
    // Nearby NPC sighs loudly, briefly blocks player
    _triggerLoudSigh(candidates) {
        if (!this.player) return;

        // Pick NPC closest to the player
        let closest = null;
        let closestDist = Infinity;
        for (const npc of candidates) {
            const d = gridDistance(this.player.col, this.player.row, npc.col, npc.row);
            if (d < closestDist) {
                closestDist = d;
                closest = npc;
            }
        }
        if (!closest || closestDist > 6) return;

        this.activeEvent = {
            type: 'loud_sigh',
            npc: closest,
            message: '(sukker tungt)',
        };
        this.eventTimer = 2500;
        this.player.blockFor(800);
    }

    _updateActiveEvent(dt, npcs, tilemap) {
        this.eventTimer -= dt;
        const ev = this.activeEvent;

        switch (ev.type) {
            case 'powerpoint_panic':
                // Send NPC to next waypoint on arrival
                if (ev.npc.behavior.state !== NPC_STATE.WALKING && this.eventTimer > 500) {
                    ev.waypointIndex = (ev.waypointIndex + 1) % ev.waypoints.length;
                    ev.npc.behavior.walkTo(ev.npc, tilemap, ev.waypoints[ev.waypointIndex], NPC_STATE.IDLE);
                }
                // Block player if panic NPC runs into them
                if (this.player) {
                    const d = gridDistance(this.player.col, this.player.row, ev.npc.col, ev.npc.row);
                    if (d < 1.5) this.player.blockFor(400);
                }
                break;
        }

        if (this.eventTimer <= 0) {
            if (ev.type === 'powerpoint_panic') {
                ev.npc.behavior.walkSpeed = ev.origSpeed;
            }
            this.activeEvent = null;
        }
    }

    _updateCameraPan(dt) {
        this.cameraPanTimer -= dt;
        if (this.cameraPanTimer <= 0) {
            if (this.cameraPanPhase === 'delay') {
                this.cameraPanPhase = 'hold';
                this.cameraPanTimer = 1500;
            } else {
                this.cameraPanPhase = null;
                this.cameraPanTarget = null;
            }
        }
    }

    render(ctx, camera) {
        if (!this.activeEvent) return;

        const ev = this.activeEvent;
        const fadeRatio = Math.min(1, this.eventTimer / 500);
        ctx.globalAlpha = fadeRatio;

        switch (ev.type) {
            case 'spontaneous_meeting': {
                const leader = ev.npcs[0];
                const iso = cartToIso(leader.col, leader.row);
                const sx = iso.x - camera.x + camera.offsetX;
                const sy = iso.y - camera.y + camera.offsetY;
                this._renderAlert(ctx, sx, sy - 55, ev.message, '#6B5B3E');
                break;
            }
            case 'chief_was_here': {
                const iso = cartToIso(ev.npc.col, ev.npc.row);
                const sx = iso.x - camera.x + camera.offsetX;
                const sy = iso.y - camera.y + camera.offsetY;
                this._renderSpeechBubble(ctx, sx, sy - 55, ev.message);
                break;
            }
            case 'powerpoint_panic': {
                const iso = cartToIso(ev.npc.col, ev.npc.row);
                const sx = iso.x - camera.x + camera.offsetX;
                const sy = iso.y - camera.y + camera.offsetY;
                this._renderAlert(ctx, sx, sy - 55, ev.message, '#B04040');
                break;
            }
            case 'printer_jam': {
                const iso = cartToIso(ev.npc.col, ev.npc.row);
                const sx = iso.x - camera.x + camera.offsetX;
                const sy = iso.y - camera.y + camera.offsetY;
                this._renderAlert(ctx, sx, sy - 55, ev.message, '#8B5E34');
                break;
            }
            case 'coffee_no_milk': {
                const iso = cartToIso(ev.npc.col, ev.npc.row);
                const sx = iso.x - camera.x + camera.offsetX;
                const sy = iso.y - camera.y + camera.offsetY;
                this._renderAlert(ctx, sx, sy - 55, ev.message, '#6B4E3A');
                break;
            }
            case 'loud_sigh': {
                const iso = cartToIso(ev.npc.col, ev.npc.row);
                const sx = iso.x - camera.x + camera.offsetX;
                const sy = iso.y - camera.y + camera.offsetY;
                this._renderSpeechBubble(ctx, sx, sy - 55, ev.message);
                break;
            }
        }

        ctx.globalAlpha = 1;
    }

    _renderAlert(ctx, x, y, message, color) {
        const flash = Math.sin(Date.now() / 200) > 0;

        ctx.font = 'bold 7px "Courier New", monospace';
        const w = ctx.measureText(message).width + 8;
        const h = 13;

        ctx.fillStyle = flash ? color : 'rgba(44,40,36,0.85)';
        ctx.fillRect(Math.round(x - w / 2), Math.round(y - h / 2), w, h);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(Math.round(x - w / 2), Math.round(y - h / 2), w, h);

        ctx.fillStyle = flash ? '#F5F0EA' : color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, Math.round(x), Math.round(y));
    }

    _renderSpeechBubble(ctx, x, y, message) {
        ctx.font = '7px "Courier New", monospace';
        const w = Math.min(ctx.measureText(message).width + 10, 140);
        const h = 14;

        const bx = Math.round(x - w / 2);
        const by = Math.round(y - h / 2);

        ctx.fillStyle = P.DIALOGUE_BG;
        ctx.fillRect(bx, by, w, h);

        ctx.strokeStyle = P.DIALOGUE_BORDER;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, w, h);

        // Tail (pixel triangle)
        ctx.fillStyle = P.DIALOGUE_BG;
        ctx.fillRect(Math.round(x) - 1, by + h, 2, 2);
        ctx.fillRect(Math.round(x), by + h + 2, 1, 2);

        ctx.fillStyle = P.DIALOGUE_TEXT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, Math.round(x), Math.round(y), w - 6);
    }
}
