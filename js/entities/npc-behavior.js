import { findPath } from '../pathfinding.js';
import { POINTS_OF_INTEREST } from '../map/office-layout.js';
import { randInt, randPick } from '../utils.js';

// NPC behavior states
export const NPC_STATE = {
    IDLE: 'IDLE',
    TYPING: 'TYPING',
    WALKING: 'WALKING',
    AT_COFFEE: 'AT_COFFEE',
    AT_PRINTER: 'AT_PRINTER',
    LOOKING_AT_PHONE: 'LOOKING_AT_PHONE',
    STRETCHING: 'STRETCHING',
    CARRYING_PAPERS: 'CARRYING_PAPERS',
    SIGHING: 'SIGHING',
};

// Duration ranges in ms for each state
const DURATIONS = {
    IDLE: [4000, 10000],
    TYPING: [6000, 15000],
    AT_COFFEE: [3000, 7000],
    AT_PRINTER: [2000, 5000],
    LOOKING_AT_PHONE: [3000, 6000],
    STRETCHING: [1500, 3000],
    CARRYING_PAPERS: [4000, 8000],
    SIGHING: [2000, 4000],
};

// Behavior weights for picking next action (higher = more likely)
const BEHAVIOR_WEIGHTS = [
    { state: NPC_STATE.TYPING, weight: 40 },
    { state: NPC_STATE.IDLE, weight: 20 },
    { state: NPC_STATE.AT_COFFEE, weight: 12 },
    { state: NPC_STATE.AT_PRINTER, weight: 8 },
    { state: NPC_STATE.LOOKING_AT_PHONE, weight: 10 },
    { state: NPC_STATE.STRETCHING, weight: 8 },
    { state: NPC_STATE.CARRYING_PAPERS, weight: 6 },
    { state: NPC_STATE.SIGHING, weight: 5 },
];

const totalWeight = BEHAVIOR_WEIGHTS.reduce((s, b) => s + b.weight, 0);

function pickWeightedBehavior() {
    let r = Math.random() * totalWeight;
    for (const b of BEHAVIOR_WEIGHTS) {
        r -= b.weight;
        if (r <= 0) return b.state;
    }
    return NPC_STATE.IDLE;
}

function getDuration(state) {
    const range = DURATIONS[state];
    if (!range) return 5000;
    return randInt(range[0], range[1]);
}

export class NPCBehavior {
    constructor(homeCol, homeRow) {
        this.homeCol = homeCol;
        this.homeRow = homeRow;
        // Start with a work behavior so NPCs look busy from the start
        this.state = Math.random() < 0.7 ? NPC_STATE.TYPING : NPC_STATE.IDLE;
        this.timer = getDuration(this.state);
        this.path = null;
        this.pathIndex = 0;
        this.walkSpeed = 2.2; // tiles per second (slower than player's 3.5)
        this.destinationState = null; // State to enter when walking finishes
    }

    update(dt, npc, tilemap) {
        switch (this.state) {
            case NPC_STATE.IDLE:
            case NPC_STATE.TYPING:
            case NPC_STATE.LOOKING_AT_PHONE:
            case NPC_STATE.STRETCHING:
            case NPC_STATE.AT_COFFEE:
            case NPC_STATE.AT_PRINTER:
            case NPC_STATE.CARRYING_PAPERS:
            case NPC_STATE.SIGHING:
                this.timer -= dt;
                if (this.timer <= 0) {
                    this.pickNextBehavior(npc, tilemap);
                }
                break;

            case NPC_STATE.WALKING:
                this.updateWalking(dt, npc);
                break;
        }
    }

    updateWalking(dt, npc) {
        if (!this.path || this.pathIndex >= this.path.length) {
            this.onArrived(npc);
            return;
        }

        const target = this.path[this.pathIndex];
        const speed = this.walkSpeed * dt / 1000;

        const dx = target.col - npc.col;
        const dy = target.row - npc.row;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.15) {
            npc.col = target.col;
            npc.row = target.row;
            this.pathIndex++;
        } else {
            npc.col += (dx / dist) * Math.min(speed, dist);
            npc.row += (dy / dist) * Math.min(speed, dist);
        }
    }

    onArrived(npc) {
        if (this.destinationState) {
            this.state = this.destinationState;
            this.timer = getDuration(this.destinationState);
            this.destinationState = null;
        } else {
            this.state = NPC_STATE.IDLE;
            this.timer = getDuration(NPC_STATE.IDLE);
        }
        this.path = null;
    }

    pickNextBehavior(npc, tilemap) {
        const nextState = pickWeightedBehavior();

        // For states that require going somewhere
        if (nextState === NPC_STATE.AT_COFFEE) {
            this.walkTo(npc, tilemap, POINTS_OF_INTEREST.coffee_machine, NPC_STATE.AT_COFFEE);
        } else if (nextState === NPC_STATE.AT_PRINTER) {
            this.walkTo(npc, tilemap, POINTS_OF_INTEREST.printer, NPC_STATE.AT_PRINTER);
        } else if (nextState === NPC_STATE.CARRYING_PAPERS) {
            this.walkTo(npc, tilemap, POINTS_OF_INTEREST.printer, NPC_STATE.CARRYING_PAPERS);
        } else if (nextState === NPC_STATE.TYPING || nextState === NPC_STATE.IDLE) {
            // Go back to home desk area
            this.walkToHome(npc, tilemap, nextState);
        } else {
            // Stationary behaviors (phone, stretching) — do in place
            this.state = nextState;
            this.timer = getDuration(nextState);
        }
    }

    walkTo(npc, tilemap, target, arrivalState) {
        // If target isn't walkable, find nearest walkable neighbor
        let dest = target;
        if (!tilemap.isWalkable(target.col, target.row)) {
            const dirs = [{dc:0,dr:-1},{dc:0,dr:1},{dc:-1,dr:0},{dc:1,dr:0}];
            for (const d of dirs) {
                const nc = target.col + d.dc;
                const nr = target.row + d.dr;
                if (tilemap.isWalkable(nc, nr)) {
                    dest = { col: nc, row: nr };
                    break;
                }
            }
        }

        const path = findPath(tilemap, npc.col, npc.row, dest.col, dest.row);
        if (path && path.length > 0) {
            this.state = NPC_STATE.WALKING;
            this.path = path;
            this.pathIndex = 0;
            this.destinationState = arrivalState;
        } else {
            // Can't reach — just idle
            this.state = NPC_STATE.IDLE;
            this.timer = getDuration(NPC_STATE.IDLE);
        }
    }

    walkToHome(npc, tilemap, arrivalState) {
        const homeCol = this.homeCol;
        const homeRow = this.homeRow;
        const nearHome = Math.abs(npc.col - homeCol) < 1.5 && Math.abs(npc.row - homeRow) < 1.5;

        if (nearHome) {
            // Already near home, just switch state
            this.state = arrivalState;
            this.timer = getDuration(arrivalState);
        } else {
            this.walkTo(npc, tilemap, { col: homeCol, row: homeRow }, arrivalState);
        }
    }

    getPose(atDesk = false, isSeated = false) {
        if (isSeated) {
            if (this.state === NPC_STATE.TYPING) return 'sitting_typing';
            if (this.state === NPC_STATE.IDLE || this.state === NPC_STATE.LOOKING_AT_PHONE) return 'sitting';
        }
        switch (this.state) {
            case NPC_STATE.TYPING: return 'typing';
            case NPC_STATE.WALKING: return 'walking';
            case NPC_STATE.LOOKING_AT_PHONE: return 'phone';
            case NPC_STATE.STRETCHING: return 'stretching';
            case NPC_STATE.CARRYING_PAPERS: return 'carrying';
            case NPC_STATE.SIGHING: return 'standing';
            default: return 'standing';
        }
    }
}
