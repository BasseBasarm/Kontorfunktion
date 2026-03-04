import { TILE_WIDTH, TILE_HEIGHT, TILE } from '../constants.js';
import { cartToIso } from '../utils.js';
import { drawTile, drawElevated, hasElevated, drawAmbientShadow } from '../graphics/tiles.js';
import { cartToIso as cartToIsoUtil } from '../utils.js';

export class MapRenderer {
    constructor(tilemap) {
        this.tilemap = tilemap;
    }

    // Render all floor tiles (ground pass)
    renderGround(ctx, camera) {
        const tm = this.tilemap;
        for (let row = 0; row < tm.rows; row++) {
            for (let col = 0; col < tm.cols; col++) {
                const tile = tm.getTile(col, row);
                if (tile === TILE.VOID) continue;

                const iso = cartToIso(col, row);
                const screenX = iso.x - camera.x + camera.offsetX;
                const screenY = iso.y - camera.y + camera.offsetY;

                // Frustum culling — skip tiles far off screen
                if (screenX < -TILE_WIDTH * 2 || screenX > camera.width + TILE_WIDTH * 2 ||
                    screenY < -100 || screenY > camera.height + TILE_HEIGHT * 2) {
                    continue;
                }

                drawTile(ctx, tile, screenX, screenY, col, row);

                // Ambient occlusion near walls
                if (tile === TILE.FLOOR || tile === TILE.DOOR) {
                    drawAmbientShadow(ctx, screenX, screenY, col, row, tm);
                }
            }
        }
    }

    // Warm lighting overlay — subtle radial glows at ceiling light positions
    renderLighting(ctx, camera) {
        const lightPositions = [
            { col: 10, row: 5 },   // north corridor
            { col: 10, row: 8 },   // center open office
            { col: 10, row: 11 },  // south office area
            { col: 4, row: 13 },   // kitchen
        ];

        for (const light of lightPositions) {
            const iso = cartToIso(light.col, light.row);
            const sx = iso.x - camera.x + camera.offsetX;
            const sy = iso.y - camera.y + camera.offsetY;

            const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 80);
            grad.addColorStop(0, 'rgba(255, 248, 230, 0.04)');
            grad.addColorStop(1, 'rgba(255, 248, 230, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(sx - 80, sy - 80, 160, 160);
        }
    }

    // Collect elevated objects for z-sorting with entities
    getElevatedObjects() {
        const objects = [];
        const tm = this.tilemap;
        for (let row = 0; row < tm.rows; row++) {
            for (let col = 0; col < tm.cols; col++) {
                const tile = tm.getTile(col, row);
                if (hasElevated(tile)) {
                    objects.push({ col, row, tile, type: 'tile' });
                }
            }
        }
        return objects;
    }

    // Render a single elevated tile at screen position
    renderElevated(ctx, col, row, tile, camera) {
        const iso = cartToIso(col, row);
        const screenX = iso.x - camera.x + camera.offsetX;
        const screenY = iso.y - camera.y + camera.offsetY;

        // Frustum culling
        if (screenX < -TILE_WIDTH * 2 || screenX > camera.width + TILE_WIDTH * 2 ||
            screenY < -150 || screenY > camera.height + TILE_HEIGHT * 2) {
            return;
        }

        drawElevated(ctx, tile, screenX, screenY);
    }
}
