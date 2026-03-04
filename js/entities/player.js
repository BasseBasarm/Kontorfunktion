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

    update(dt, input, tilemap) {
        const { dx, dy } = input.getMovement();
        const speed = MOVE_SPEED * dt / 1000;

        if (dx !== 0 || dy !== 0) {
            this.moving = true;

            // Update facing direction
            if (Math.abs(dx) >= Math.abs(dy)) {
                this.facing = dx > 0 ? 'right' : 'left';
            } else {
                this.facing = dy > 0 ? 'down' : 'up';
            }

            // Calculate new target position
            let newCol = this.col + dx * speed;
            let newRow = this.row + dy * speed;

            // Check collision for X movement
            const testColX = Math.round(this.col + dx * speed);
            const testRowX = Math.round(this.row);
            if (tilemap.isWalkable(testColX, testRowX)) {
                this.col = newCol;
            }

            // Check collision for Y movement
            const testColY = Math.round(this.col);
            const testRowY = Math.round(this.row + dy * speed);
            if (tilemap.isWalkable(testColY, testRowY)) {
                this.row = newRow;
            }

            // Clamp to map bounds
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
        const screenX = iso.x - camera.x + camera.offsetX;
        const screenY = iso.y - camera.y + camera.offsetY;

        // Idle bob offset
        const bobOffset = !this.moving && this.animFrame === 1 ? -1 : 0;

        // Walk bounce
        const walkBounce = this.moving ? (this.walkCycle % 2 === 0 ? -1 : 0) : 0;

        const y = screenY + bobOffset + walkBounce;

        // Player highlight — subtle circle under feet
        ctx.fillStyle = 'rgba(104, 136, 168, 0.35)';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 2, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        drawCharacter(ctx, screenX, y, this.config);

        // Small arrow above head
        const arrowBob = Math.sin(Date.now() / 300) * 2;
        ctx.fillStyle = 'rgba(104, 136, 168, 0.7)';
        ctx.beginPath();
        ctx.moveTo(screenX, y - 50 + arrowBob);
        ctx.lineTo(screenX - 4, y - 56 + arrowBob);
        ctx.lineTo(screenX + 4, y - 56 + arrowBob);
        ctx.closePath();
        ctx.fill();
    }

    // Grid position (rounded for collision)
    get gridCol() {
        return Math.round(this.col);
    }

    get gridRow() {
        return Math.round(this.row);
    }
}
