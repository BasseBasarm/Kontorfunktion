import { cartToIso } from '../utils.js';
import { drawCharacter } from '../graphics/sprites.js';
import { NPC_CONFIGS } from '../graphics/sprites.js';
import { NPCBehavior, NPC_STATE } from './npc-behavior.js';

export class NPC {
    constructor(id, col, row, type, atDesk = false) {
        this.id = id;
        this.col = col;
        this.row = row;
        this.type = type;
        this.atDesk = atDesk;
        this.hasInteracted = false;
        this.inDialogue = false; // Freeze movement during active dialogue
        this.config = NPC_CONFIGS[type] || NPC_CONFIGS.smalltalk;
        this.animFrame = 0;
        this.animTimer = Math.random() * 1000;
        this.walkCycle = 0;
        this.walkAnimTimer = 0;
        // Typing head-bob animation
        this.headBobTimer = Math.random() * 2000;
        this.headBobFrame = 0;

        // Behavior system (only active after interaction)
        this.behavior = new NPCBehavior(col, row);
        // Desk NPCs start typing (seated)
        if (atDesk) {
            this.behavior.state = NPC_STATE.TYPING;
            this.behavior.timer = 5000 + Math.random() * 10000;
        }

        // Whether this NPC is currently seated at their desk
        this.isSeated = !!atDesk;
        // Timer before desk NPCs can get up (set externally by spawner)
        this.getUpDelay = 0; // ms remaining before allowed to roam
        this.willGetUp = false; // whether this NPC is designated to get up
    }

    update(dt, tilemap) {
        this.animTimer += dt;
        if (this.animTimer > 600) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }

        // Typing head-bob animation (subtle screen-looking movement)
        if (this.behavior.state === NPC_STATE.TYPING) {
            this.headBobTimer += dt;
            if (this.headBobTimer > 800) {
                this.headBobTimer = 0;
                this.headBobFrame = (this.headBobFrame + 1) % 4; // 0,1,2,3 cycle
            }
        }

        // Walk animation timing
        if (this.behavior.state === NPC_STATE.WALKING) {
            this.walkAnimTimer += dt;
            if (this.walkAnimTimer > 150) {
                this.walkAnimTimer = 0;
                this.walkCycle = (this.walkCycle + 1) % 4;
            }
        }

        // Get-up delay countdown for desk NPCs designated to roam
        if (this.willGetUp && this.getUpDelay > 0) {
            this.getUpDelay -= dt;
            if (this.getUpDelay <= 0) {
                this.getUpDelay = 0;
                this.isSeated = false;
                // Trigger roaming behavior immediately
                this.behavior.pickNextBehavior(this, tilemap);
            }
        }

        // Track seated state: if NPC walked back home and is typing/idle, they're seated again
        if (this.atDesk && this.behavior.state !== NPC_STATE.WALKING && !this.isSeated) {
            const nearHome = Math.abs(this.col - this.behavior.homeCol) < 1.5
                          && Math.abs(this.row - this.behavior.homeRow) < 1.5;
            if (nearHome && (this.behavior.state === NPC_STATE.TYPING || this.behavior.state === NPC_STATE.IDLE)) {
                this.isSeated = true;
            }
        }
        if (this.behavior.state === NPC_STATE.WALKING) {
            this.isSeated = false;
        }

        // Update behavior: stationary work before interaction, full roaming after
        if (!this.inDialogue && tilemap) {
            if (this.hasInteracted || (this.willGetUp && this.getUpDelay <= 0)) {
                this.behavior.update(dt, this, tilemap);
            } else {
                // Before interaction: cycle stationary desk behaviors only
                this.behavior.timer -= dt;
                if (this.behavior.timer <= 0) {
                    if (this.atDesk) {
                        // Desk NPCs heavily favor typing, occasional idle/phone
                        const deskStates = [NPC_STATE.TYPING, NPC_STATE.IDLE, NPC_STATE.LOOKING_AT_PHONE];
                        const weights = [70, 15, 15];
                        let r = Math.random() * 100;
                        let picked = NPC_STATE.TYPING;
                        for (let i = 0; i < deskStates.length; i++) {
                            r -= weights[i];
                            if (r <= 0) { picked = deskStates[i]; break; }
                        }
                        this.behavior.state = picked;
                        this.behavior.timer = 4000 + Math.random() * 12000;
                    } else {
                        const deskStates = [NPC_STATE.TYPING, NPC_STATE.IDLE, NPC_STATE.LOOKING_AT_PHONE];
                        const weights = [40, 35, 25];
                        let r = Math.random() * 100;
                        let picked = NPC_STATE.TYPING;
                        for (let i = 0; i < deskStates.length; i++) {
                            r -= weights[i];
                            if (r <= 0) { picked = deskStates[i]; break; }
                        }
                        this.behavior.state = picked;
                        this.behavior.timer = 3000 + Math.random() * 8000;
                    }
                }
            }
        }
    }

    render(ctx, camera) {
        const iso = cartToIso(this.col, this.row);
        const screenX = Math.round(iso.x - camera.x + camera.offsetX);
        const screenY = Math.round(iso.y - camera.y + camera.offsetY);

        // Idle bob (for non-walking states)
        const isWalking = this.behavior.state === NPC_STATE.WALKING;
        const isTyping = this.behavior.state === NPC_STATE.TYPING;
        let bobOffset;
        if (isWalking) {
            bobOffset = this.walkCycle % 2 === 0 ? -1 : 0;
        } else if (isTyping) {
            // Subtle typing head-bob: slight up/down as if looking between screen and keyboard
            const bobPattern = [0, -1, 0, -1];
            bobOffset = bobPattern[this.headBobFrame];
        } else {
            bobOffset = this.animFrame === 1 ? -1 : 0;
        }

        // Dim slightly if already interacted
        if (this.hasInteracted) {
            ctx.globalAlpha = 0.7;
        }

        // Shadow (pixel diamond)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(screenX - 12, screenY + 1, 24, 2);
        ctx.fillRect(screenX - 9, screenY - 1, 18, 2);
        ctx.fillRect(screenX - 9, screenY + 3, 18, 2);
        ctx.fillRect(screenX - 6, screenY - 3, 12, 2);
        ctx.fillRect(screenX - 6, screenY + 5, 12, 2);

        const pose = this.behavior.getPose(this.atDesk, this.isSeated);
        drawCharacter(ctx, screenX, screenY + bobOffset, this.config, pose);

        ctx.globalAlpha = 1;

        // Draw interaction indicator if not yet talked to
        if (!this.hasInteracted) {
            const pulseOffset = Math.floor(Math.sin(Date.now() / 400) * 3);

            if (this.type === 'chief') {
                // Chief gets a proper golden 5-pointed star (pixel-art)
                const sy = screenY - 78 + pulseOffset;
                const sx = screenX;
                // Star outline (dark gold)
                ctx.fillStyle = '#8A7038';
                // Top point
                ctx.fillRect(sx - 1, sy - 9, 3, 1);
                ctx.fillRect(sx - 1, sy - 8, 3, 2);
                // Upper body expanding
                ctx.fillRect(sx - 3, sy - 6, 7, 1);
                ctx.fillRect(sx - 5, sy - 5, 11, 1);
                // Left arm
                ctx.fillRect(sx - 9, sy - 4, 5, 1);
                ctx.fillRect(sx - 8, sy - 3, 4, 1);
                // Right arm
                ctx.fillRect(sx + 5, sy - 4, 5, 1);
                ctx.fillRect(sx + 5, sy - 3, 4, 1);
                // Middle
                ctx.fillRect(sx - 4, sy - 4, 9, 1);
                ctx.fillRect(sx - 3, sy - 3, 7, 1);
                ctx.fillRect(sx - 3, sy - 2, 7, 1);
                // Lower body narrowing
                ctx.fillRect(sx - 4, sy - 1, 9, 1);
                ctx.fillRect(sx - 5, sy, 11, 1);
                // Left leg
                ctx.fillRect(sx - 6, sy + 1, 3, 1);
                ctx.fillRect(sx - 7, sy + 2, 3, 1);
                ctx.fillRect(sx - 7, sy + 3, 2, 1);
                // Right leg
                ctx.fillRect(sx + 4, sy + 1, 3, 1);
                ctx.fillRect(sx + 5, sy + 2, 3, 1);
                ctx.fillRect(sx + 6, sy + 3, 2, 1);
                // Star fill (bright gold)
                ctx.fillStyle = '#F0D060';
                ctx.fillRect(sx, sy - 7, 1, 2);
                ctx.fillRect(sx - 2, sy - 5, 5, 1);
                ctx.fillRect(sx - 4, sy - 4, 9, 1);
                ctx.fillRect(sx - 7, sy - 3, 3, 1);
                ctx.fillRect(sx + 5, sy - 3, 3, 1);
                ctx.fillRect(sx - 2, sy - 3, 5, 1);
                ctx.fillRect(sx - 2, sy - 2, 5, 1);
                ctx.fillRect(sx - 3, sy - 1, 7, 1);
                ctx.fillRect(sx - 4, sy, 9, 1);
                ctx.fillRect(sx - 5, sy + 1, 3, 1);
                ctx.fillRect(sx + 3, sy + 1, 3, 1);
                ctx.fillRect(sx - 6, sy + 2, 2, 1);
                ctx.fillRect(sx + 5, sy + 2, 2, 1);
                // Sparkle highlight
                ctx.fillStyle = '#FFF8D0';
                ctx.fillRect(sx - 1, sy - 5, 2, 1);
                ctx.fillRect(sx - 3, sy - 3, 2, 1);
            } else if (this.type === 'minister') {
                // Minister gets a golden crown (pixel-art)
                const cy2 = screenY - 72 + pulseOffset;
                const cx2 = screenX;
                // Crown base (dark gold outline)
                ctx.fillStyle = '#8A7038';
                ctx.fillRect(cx2 - 8, cy2, 17, 1);
                ctx.fillRect(cx2 - 8, cy2 - 1, 17, 1);
                // Crown body
                ctx.fillStyle = '#F0D060';
                ctx.fillRect(cx2 - 7, cy2 - 2, 15, 2);
                ctx.fillRect(cx2 - 7, cy2 - 4, 15, 2);
                // Three points
                ctx.fillRect(cx2 - 7, cy2 - 7, 3, 3);
                ctx.fillRect(cx2 - 1, cy2 - 8, 3, 4);
                ctx.fillRect(cx2 + 5, cy2 - 7, 3, 3);
                // Point tips (bright)
                ctx.fillStyle = '#FFF8D0';
                ctx.fillRect(cx2 - 6, cy2 - 7, 1, 1);
                ctx.fillRect(cx2, cy2 - 8, 1, 1);
                ctx.fillRect(cx2 + 6, cy2 - 7, 1, 1);
                // Jewels on the band
                ctx.fillStyle = '#E03030';
                ctx.fillRect(cx2 - 4, cy2 - 3, 2, 2);
                ctx.fillRect(cx2 + 3, cy2 - 3, 2, 2);
                ctx.fillStyle = '#3060E0';
                ctx.fillRect(cx2 - 1, cy2 - 3, 2, 2);
                // Crown outline bottom
                ctx.fillStyle = '#8A7038';
                ctx.fillRect(cx2 - 8, cy2 - 2, 1, 2);
                ctx.fillRect(cx2 + 8, cy2 - 2, 1, 2);
            } else {
                // Small speech bubble indicator (pixel-art)
                const by = screenY - 75 + pulseOffset;
                const bx = screenX;
                // Bubble body
                ctx.fillStyle = '#F5F0EA';
                ctx.fillRect(bx - 8, by - 5, 16, 10);
                ctx.fillRect(bx - 9, by - 3, 18, 6);
                // Bubble tail (pointing down)
                ctx.fillRect(bx - 2, by + 5, 4, 2);
                ctx.fillRect(bx - 1, by + 7, 2, 2);
                // Three dots inside
                ctx.fillStyle = '#5C554C';
                ctx.fillRect(bx - 4, by - 1, 2, 2);
                ctx.fillRect(bx - 1, by - 1, 2, 2);
                ctx.fillRect(bx + 2, by - 1, 2, 2);
                // Outline
                ctx.fillStyle = '#8A8070';
                ctx.fillRect(bx - 8, by - 6, 16, 1);  // top
                ctx.fillRect(bx - 8, by + 5, 16, 1);   // bottom
                ctx.fillRect(bx - 10, by - 3, 1, 6);   // left
                ctx.fillRect(bx + 9, by - 3, 1, 6);    // right
                ctx.fillRect(bx - 9, by - 5, 1, 2);    // top-left corner
                ctx.fillRect(bx + 8, by - 5, 1, 2);    // top-right corner
                ctx.fillRect(bx - 9, by + 3, 1, 2);    // bottom-left corner
                ctx.fillRect(bx + 8, by + 3, 1, 2);    // bottom-right corner
            }
        }

        // State activity indicator (show for desk workers even before interaction)
        const showActivity = this.behavior.state !== NPC_STATE.IDLE && this.behavior.state !== NPC_STATE.WALKING;
        if (showActivity && (this.hasInteracted || this.atDesk)) {
            const iy = screenY - 78;
            ctx.font = '7px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'rgba(92,85,76,0.6)';
            const label = {
                TYPING: '...',
                AT_COFFEE: '~',
                AT_PRINTER: '*',
                LOOKING_AT_PHONE: '...',
                STRETCHING: '~',
                CARRYING_PAPERS: '=',
                SIGHING: '(suk)',
            }[this.behavior.state] || '';
            if (label) ctx.fillText(label, screenX, iy);
        }
    }
}
