import { TILE, WALKABLE, MAP_COLS, MAP_ROWS } from '../constants.js';
import { OFFICE_LAYOUT } from './office-layout.js';

export class Tilemap {
    constructor() {
        this.data = OFFICE_LAYOUT;
        this.cols = MAP_COLS;
        this.rows = MAP_ROWS;
    }

    getTile(col, row) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
            return TILE.VOID;
        }
        return this.data[row][col];
    }

    isWalkable(col, row) {
        const tile = this.getTile(col, row);
        return WALKABLE.has(tile);
    }

    isWall(tile) {
        return tile === TILE.WALL_SOUTH || tile === TILE.WALL_EAST ||
               tile === TILE.WALL_CORNER || tile === TILE.WALL_NORTH ||
               tile === TILE.WALL_WEST;
    }

    isGlass(tile) {
        return tile === TILE.GLASS_WALL_S || tile === TILE.GLASS_WALL_E;
    }

    isFurniture(tile) {
        return tile >= TILE.DESK && !WALKABLE.has(tile) && !this.isWall(tile) && !this.isGlass(tile);
    }
}
