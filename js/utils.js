import { TILE_WIDTH, TILE_HEIGHT } from './constants.js';

// Convert grid (col, row) to isometric screen coordinates
export function cartToIso(col, row) {
    return {
        x: (col - row) * (TILE_WIDTH / 2),
        y: (col + row) * (TILE_HEIGHT / 2),
    };
}

// Convert screen coordinates to grid (col, row)
export function isoToCart(screenX, screenY) {
    return {
        col: (screenX / (TILE_WIDTH / 2) + screenY / (TILE_HEIGHT / 2)) / 2,
        row: (screenY / (TILE_HEIGHT / 2) - screenX / (TILE_WIDTH / 2)) / 2,
    };
}

// Manhattan distance on the grid
export function gridDistance(col1, row1, col2, row2) {
    return Math.abs(col1 - col2) + Math.abs(row1 - row2);
}

// Random integer between min and max (inclusive)
export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pick random element from array
export function randPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Shuffle array in place (Fisher-Yates)
export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Lerp
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Clamp
export function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}
