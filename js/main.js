import { Game } from './game.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const game = new Game(canvas);
    game.start();

    // Expose for debugging
    window._game = game;
});
