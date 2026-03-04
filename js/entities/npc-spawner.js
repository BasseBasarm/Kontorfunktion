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

        // Spawn regular NPCs
        for (const pos of NPC_POSITIONS) {
            const npc = new NPC(pos.id, pos.col, pos.row, pos.type);
            this.npcs.push(npc);
        }

        // Spawn chief at random location
        const chiefSpawn = randPick(CHIEF_SPAWNS);
        this.chief = new NPC('chief', chiefSpawn.col, chiefSpawn.row, 'chief');
        this.npcs.push(this.chief);

        return this.npcs;
    }

    // Relocate chief to a new position (called once mid-game)
    relocateChief() {
        if (this.chiefHasRelocated) return;
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
