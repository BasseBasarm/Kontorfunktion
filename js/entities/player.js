import { MOVE_SPEED, MOVE_INTERPOLATION } from '../constants.js';
import { cartToIso, lerp, clamp } from '../utils.js';
import { drawCharacter } from '../graphics/sprites.js';
import { PALETTE as P } from '../graphics/palette.js';

export class Player {
    constructor(col, row, hairStyle) {
        this.col = col;
        this.row = row;
        this.targetCol = col;
        this.targetRow = row;
        this.facing = 'down'; // down, up, left, right
        this.moving = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.walkCycle = 0;
        this.blockedTimer = 0; // Event-driven movement block

        // Random hair color
        const hairColors = [P.HAIR_BLONDE, P.HAIR_LIGHT_BROWN, P.HAIR_BROWN, P.HAIR_DARK, P.HAIR_RED, P.HAIR_BLACK];
        const randomHairColor = hairColors[Math.floor(Math.random() * hairColors.length)];

        // Player appearance
        this.config = {
            skinTone: P.SKIN_LIGHT,
            hairColor: hairStyle === 'bald' ? P.SKIN_LIGHT : randomHairColor,
            hairStyle: hairStyle || 'short',
            shirtColor: P.SHIRT_WHITE,
            pantsColor: P.PANTS_NAVY,
        };
    }

    blockFor(ms) {
        this.blockedTimer = Math.max(this.blockedTimer, ms);
    }

    update(dt, input, tilemap) {
        // Event-driven block — player can't move
        if (this.blockedTimer > 0) {
            this.blockedTimer -= dt;
            this.moving = false;
            this.walkCycle = 0;
            this.animTimer += dt;
            if (this.animTimer > 500) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % 2;
            }
            return;
        }

        const { dx: rawDx, dy: rawDy } = input.getMovement();
        const speed = MOVE_SPEED * dt / 1000;

        if (rawDx !== 0 || rawDy !== 0) {
            this.moving = true;

            // Facing direction based on screen-space input
            if (Math.abs(rawDx) >= Math.abs(rawDy)) {
                this.facing = rawDx > 0 ? 'right' : 'left';
            } else {
                this.facing = rawDy > 0 ? 'down' : 'up';
            }

            let sdx = rawDx;
            let sdy = rawDy;

            // Normalize diagonal in screen space
            if (sdx !== 0 && sdy !== 0) {
                sdx *= Math.SQRT1_2;
                sdy *= Math.SQRT1_2;
            }

            const hCol = sdx * 0.5 * speed;
            const hRow = -sdx * 0.5 * speed;
            const vCol = sdy * speed;
            const vRow = sdy * speed;

            const nextCol1 = this.col + hCol;
            const nextRow1 = this.row + hRow;
            if (tilemap.isWalkable(Math.round(nextCol1), Math.round(nextRow1))) {
                this.col = nextCol1;
                this.row = nextRow1;
            }

            const nextCol2 = this.col + vCol;
            const nextRow2 = this.row + vRow;
            if (tilemap.isWalkable(Math.round(nextCol2), Math.round(nextRow2))) {
                this.col = nextCol2;
                this.row = nextRow2;
            }

            this.col = clamp(this.col, 1, tilemap.cols - 2);
            this.row = clamp(this.row, 1, tilemap.rows - 2);

            // Walk animation
            this.animTimer += dt;
            if (this.animTimer > 150) {
                this.animTimer = 0;
                this.walkCycle = (this.walkCycle + 1) % 4;
            }
        } else {
            this.moving = false;
            this.walkCycle = 0;

            // Idle bob animation
            this.animTimer += dt;
            if (this.animTimer > 500) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % 2;
            }
        }
    }

    render(ctx, camera) {
        const iso = cartToIso(this.col, this.row);
        const screenX = Math.round(iso.x - camera.x + camera.offsetX);
        const screenY = Math.round(iso.y - camera.y + camera.offsetY);

        // Idle bob offset
        const bobOffset = !this.moving && this.animFrame === 1 ? -1 : 0;

        // Walk bounce
        const walkBounce = this.moving ? (this.walkCycle % 2 === 0 ? -1 : 0) : 0;

        const y = screenY + bobOffset + walkBounce;

        // Player highlight — pixel diamond under feet
        ctx.fillStyle = 'rgba(104, 136, 168, 0.45)';
        ctx.fillRect(screenX - 12, screenY + 1, 24, 2);
        ctx.fillRect(screenX - 9, screenY - 1, 18, 2);
        ctx.fillRect(screenX - 9, screenY + 3, 18, 2);
        ctx.fillRect(screenX - 6, screenY - 3, 12, 2);
        ctx.fillRect(screenX - 6, screenY + 5, 12, 2);

        drawCharacter(ctx, screenX, y, this.config);

        // Small arrow above head (pixel triangle)
        const arrowBob = Math.floor(Math.sin(Date.now() / 300) * 3);
        const ay = y - 75 + arrowBob;
        ctx.fillStyle = 'rgba(104, 136, 168, 0.7)';
        ctx.fillRect(screenX, ay, 2, 3);
        ctx.fillRect(screenX - 2, ay - 3, 6, 3);
        ctx.fillRect(screenX - 4, ay - 6, 10, 3);
    }

    // Grid position (rounded for collision)
    get gridCol() {
        return Math.round(this.col);
    }

    get gridRow() {
        return Math.round(this.row);
    }
}
