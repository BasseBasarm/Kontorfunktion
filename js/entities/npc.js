import { cartToIso } from '../utils.js';
import { drawCharacter } from '../graphics/sprites.js';
import { NPC_CONFIGS } from '../graphics/sprites.js';
import { NPCBehavior, NPC_STATE } from './npc-behavior.js';

export class NPC {
    constructor(id, col, row, type) {
        this.id = id;
        this.col = col;
        this.row = row;
        this.type = type;
        this.hasInteracted = false;
        this.config = NPC_CONFIGS[type] || NPC_CONFIGS.smalltalk;
        this.animFrame = 0;
        this.animTimer = Math.random() * 1000;
        this.walkCycle = 0;
        this.walkAnimTimer = 0;

        // Behavior system (only active after interaction)
        this.behavior = new NPCBehavior(col, row);
    }

    update(dt, tilemap) {
        this.animTimer += dt;
        if (this.animTimer > 600) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }

        // Walk animation timing
        if (this.behavior.state === NPC_STATE.WALKING) {
            this.walkAnimTimer += dt;
            if (this.walkAnimTimer > 150) {
                this.walkAnimTimer = 0;
                this.walkCycle = (this.walkCycle + 1) % 4;
            }
        }

        // Only roam after being interacted with
        if (this.hasInteracted && tilemap) {
            this.behavior.update(dt, this, tilemap);
        }
    }

    render(ctx, camera) {
        const iso = cartToIso(this.col, this.row);
        const screenX = iso.x - camera.x + camera.offsetX;
        const screenY = iso.y - camera.y + camera.offsetY;

        // Idle bob (for non-walking states)
        const isWalking = this.behavior.state === NPC_STATE.WALKING;
        const bobOffset = isWalking
            ? (this.walkCycle % 2 === 0 ? -1 : 0)
            : (this.animFrame === 1 ? -1 : 0);

        // Dim slightly if already interacted
        if (this.hasInteracted) {
            ctx.globalAlpha = 0.7;
        }

        // Enhanced shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 2, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        const pose = this.behavior.getPose();
        drawCharacter(ctx, screenX, screenY + bobOffset, this.config, pose);

        ctx.globalAlpha = 1;

        // Draw interaction indicator if not yet talked to
        if (!this.hasInteracted) {
            const pulseOffset = Math.sin(Date.now() / 400) * 2;
            ctx.fillStyle = '#E8E0D8';
            ctx.beginPath();
            ctx.arc(screenX, screenY - 48 + pulseOffset, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#5C554C';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // State activity indicator (small icon above head for post-interaction NPCs)
        if (this.hasInteracted && this.behavior.state !== NPC_STATE.IDLE && this.behavior.state !== NPC_STATE.WALKING) {
            const iy = screenY - 52;
            ctx.font = '8px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(92,85,76,0.6)';
            const label = {
                TYPING: '...',
                AT_COFFEE: '~',
                AT_PRINTER: '*',
                LOOKING_AT_PHONE: '...',
                STRETCHING: '~',
            }[this.behavior.state] || '';
            if (label) ctx.fillText(label, screenX, iy);
        }
    }
}
