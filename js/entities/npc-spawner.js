import { NPC } from './npc.js';
import { NPC_POSITIONS, CHIEF_SPAWNS } from '../map/office-layout.js';
import { randPick, shuffle } from '../utils.js';
import { NPC_CONFIGS } from '../graphics/sprites.js';

export class NPCSpawner {
    constructor() {
        this.npcs = [];
        this.chief = null;
        this.chiefHasRelocated = false;
    }

    spawn(variantRound) {
        this.npcs = [];
        this.chiefHasRelocated = false;
        this.chiefSpawned = false;

        // Spawn regular NPCs
        for (const pos of NPC_POSITIONS) {
            const npc = new NPC(pos.id, pos.col, pos.row, pos.type, !!pos.atDesk);
            this.npcs.push(npc);
        }

        // Pick 2 random desk NPCs to get up after 60 seconds
        const deskNpcs = this.npcs.filter(n => n.atDesk);
        const shuffled = shuffle([...deskNpcs]);
        for (let i = 0; i < Math.min(2, shuffled.length); i++) {
            shuffled[i].willGetUp = true;
            shuffled[i].getUpDelay = 60000 + Math.random() * 5000; // 60-65s
        }

        // Chief is NOT spawned at start — she appears during the final minute
        this.chief = null;

        return this.npcs;
    }

    // Spawn chief during the final minute of gameplay
    spawnChief() {
        if (this.chiefSpawned) return;
        this.chiefSpawned = true;

        const chiefSpawn = randPick(CHIEF_SPAWNS);
        this.chief = new NPC('chief', chiefSpawn.col, chiefSpawn.row, 'chief');
        this.npcs.push(this.chief);
    }

    // Relocate chief to a new position (called once mid-game)
    relocateChief() {
        if (this.chiefHasRelocated || !this.chief) return;
        this.chiefHasRelocated = true;

        const currentCol = this.chief.col;
        const currentRow = this.chief.row;

        // Pick a different spawn point
        const alternatives = CHIEF_SPAWNS.filter(
            s => s.col !== currentCol || s.row !== currentRow
        );
        const newSpawn = randPick(alternatives);
        this.chief.col = newSpawn.col;
        this.chief.row = newSpawn.row;
    }

    getAllNPCs() {
        return this.npcs;
    }
}
