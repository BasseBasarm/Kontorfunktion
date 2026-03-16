import { TILE_WIDTH, TILE_HEIGHT, TILE } from '../constants.js';
import { cartToIso } from '../utils.js';
import { drawTile, drawElevated, hasElevated, drawAmbientShadow } from '../graphics/tiles.js';

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
                const screenX = Math.round(iso.x - camera.x + camera.offsetX);
                const screenY = Math.round(iso.y - camera.y + camera.offsetY);

                // Frustum culling
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

    // Warm lighting overlay — flat pixel-art rectangles (no gradients)
    renderLighting(ctx, camera) {
        const lightPositions = [
            { col: 4, row: 3 },    // minister office
            { col: 10, row: 3 },   // secretary area
            { col: 17, row: 3 },   // senior office
            { col: 10, row: 5 },   // corridor
            { col: 11, row: 8 },   // center open office
            { col: 17, row: 8 },   // right open office
            { col: 4, row: 9 },    // meeting room
            { col: 10, row: 12 },  // lower corridor
            { col: 4, row: 15 },   // kitchen
            { col: 16, row: 15 },  // restroom
        ];

        for (const light of lightPositions) {
            const iso = cartToIso(light.col, light.row);
            const sx = Math.round(iso.x - camera.x + camera.offsetX);
            const sy = Math.round(iso.y - camera.y + camera.offsetY);

            // Flat layered rectangles instead of radial gradient
            ctx.fillStyle = 'rgba(255, 235, 180, 0.03)';
            ctx.fillRect(sx - 66, sy - 66, 132, 132);
            ctx.fillStyle = 'rgba(255, 235, 180, 0.05)';
            ctx.fillRect(sx - 42, sy - 42, 84, 84);
            ctx.fillStyle = 'rgba(255, 235, 180, 0.06)';
            ctx.fillRect(sx - 21, sy - 21, 42, 42);
        }
    }

    // Render wall-mounted signs (minister office, etc.)
    renderSigns(ctx, camera) {
        // MINISTEREN sign on south wall (row 4) above minister office door area (col 4)
        const ministerIso = cartToIso(4, 4);
        const mx = Math.round(ministerIso.x - camera.x + camera.offsetX);
        const my = Math.round(ministerIso.y - camera.y + camera.offsetY);
        // Position on the wall face (wall height offset)
        this._drawWallSign(ctx, mx, my - 16, 'MINISTEREN', '#1A3060', '#C8A85C');
    }

    _drawWallSign(ctx, x, y, text, bgColor, textColor) {
        ctx.font = 'bold 10px "Courier New", monospace';
        const tw = ctx.measureText(text).width;
        const sw = tw + 12;
        const sh = 14;
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x - sw / 2 + 1, y - sh / 2 + 1, sw, sh);
        // Sign background
        ctx.fillStyle = bgColor;
        ctx.fillRect(x - sw / 2, y - sh / 2, sw, sh);
        // Gold border
        ctx.fillStyle = '#C8A85C';
        ctx.fillRect(x - sw / 2, y - sh / 2, sw, 1);
        ctx.fillRect(x - sw / 2, y + sh / 2 - 1, sw, 1);
        ctx.fillRect(x - sw / 2, y - sh / 2, 1, sh);
        ctx.fillRect(x + sw / 2 - 1, y - sh / 2, 1, sh);
        // Text
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x, y + 1);
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
        const screenX = Math.round(iso.x - camera.x + camera.offsetX);
        const screenY = Math.round(iso.y - camera.y + camera.offsetY);

        // Frustum culling
        if (screenX < -TILE_WIDTH * 2 || screenX > camera.width + TILE_WIDTH * 2 ||
            screenY < -150 || screenY > camera.height + TILE_HEIGHT * 2) {
            return;
        }

        drawElevated(ctx, tile, screenX, screenY);
    }
}
