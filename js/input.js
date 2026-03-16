import { CANVAS_WIDTH, CANVAS_HEIGHT, INTERNAL_WIDTH, INTERNAL_HEIGHT } from './constants.js';
import { isoToCart } from './utils.js';

export class Input {
    constructor() {
        this.keys = {};
        this.justPressed = {};

        // Touch-to-move state
        this.touchTarget = null; // { col, row } grid target
        this.touchActive = false;
        this.tapped = false;
        this.canvas = null;
        this.camera = null; // set by game to enable screen-to-world conversion

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onClick = this._onClick.bind(this);

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    attachCanvas(canvas) {
        this.canvas = canvas;
        canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
        canvas.addEventListener('touchend', this._onTouchEnd, { passive: false });
        canvas.addEventListener('touchcancel', this._onTouchEnd, { passive: false });
        // Also support mouse click for desktop testing
        canvas.addEventListener('click', this._onClick);
    }

    setCamera(camera) {
        this.camera = camera;
    }

    _screenToGrid(canvasX, canvasY) {
        if (!this.camera) return null;
        // Convert canvas pixel coords to internal resolution
        const internalX = canvasX * (INTERNAL_WIDTH / CANVAS_WIDTH);
        const internalY = canvasY * (INTERNAL_HEIGHT / CANVAS_HEIGHT);
        // Convert to world isometric coords (add camera offset back)
        const worldX = internalX - this.camera.offsetX + this.camera.x;
        const worldY = internalY - this.camera.offsetY + this.camera.y;
        // Convert iso to grid
        return isoToCart(worldX, worldY);
    }

    _canvasCoords(touch) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (touch.clientX - rect.left) / rect.width * CANVAS_WIDTH,
            y: (touch.clientY - rect.top) / rect.height * CANVAS_HEIGHT,
        };
    }

    _onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const pos = this._canvasCoords(touch);
        const gridPos = this._screenToGrid(pos.x, pos.y);

        if (gridPos) {
            this.touchTarget = { col: gridPos.col, row: gridPos.row };
            this.touchActive = true;
        }
        this.tapped = true;
    }

    _onTouchMove(e) {
        e.preventDefault();
        // Update target as finger moves
        const touch = e.touches[0];
        const pos = this._canvasCoords(touch);
        const gridPos = this._screenToGrid(pos.x, pos.y);

        if (gridPos) {
            this.touchTarget = { col: gridPos.col, row: gridPos.row };
        }
    }

    _onTouchEnd(e) {
        e.preventDefault();
        // Keep the target — player walks to it; clear active drag
        this.touchActive = false;
    }

    _onClick(e) {
        // Mouse click support (not on touch devices)
        if ('ontouchstart' in window) return;
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left) / rect.width * CANVAS_WIDTH;
        const canvasY = (e.clientY - rect.top) / rect.height * CANVAS_HEIGHT;
        const gridPos = this._screenToGrid(canvasX, canvasY);

        if (gridPos) {
            this.touchTarget = { col: gridPos.col, row: gridPos.row };
        }
        this.tapped = true;
    }

    _onKeyDown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' ', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
        if (!this.keys[e.key]) {
            this.justPressed[e.key] = true;
        }
        this.keys[e.key] = true;
        // Keyboard input cancels touch target
        this.touchTarget = null;
    }

    _onKeyUp(e) {
        this.keys[e.key] = false;
    }

    isDown(key) {
        return !!this.keys[key];
    }

    wasPressed(key) {
        return !!this.justPressed[key];
    }

    wasTapped() {
        return this.tapped;
    }

    isTouchActive() {
        return this.touchActive;
    }

    getMovement(playerCol, playerRow) {
        let dx = 0;
        let dy = 0;

        // Keyboard
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) dy = -1;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) dy = 1;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) dx = -1;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) dx = 1;

        // Touch-to-move: generate movement direction toward target
        if (dx === 0 && dy === 0 && this.touchTarget) {
            const diffCol = this.touchTarget.col - playerCol;
            const diffRow = this.touchTarget.row - playerRow;
            const dist = Math.sqrt(diffCol * diffCol + diffRow * diffRow);

            if (dist < 0.5) {
                // Arrived at target
                this.touchTarget = null;
            } else {
                // Convert grid direction to screen direction
                // In isometric: screen-right = col+, row- ; screen-down = col+, row+
                // We need to convert grid delta to screen-space dx/dy for the player movement system
                const screenDx = diffCol - diffRow; // iso X direction
                const screenDy = diffCol + diffRow; // iso Y direction
                const screenDist = Math.sqrt(screenDx * screenDx + screenDy * screenDy);

                if (screenDist > 0.1) {
                    dx = screenDx / screenDist;
                    dy = screenDy / screenDist;
                }
            }
        }

        return { dx, dy };
    }

    clearJustPressed() {
        this.justPressed = {};
        this.tapped = false;
    }

    clearTouchTarget() {
        this.touchTarget = null;
    }

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        if (this.canvas) {
            this.canvas.removeEventListener('touchstart', this._onTouchStart);
            this.canvas.removeEventListener('touchmove', this._onTouchMove);
            this.canvas.removeEventListener('touchend', this._onTouchEnd);
            this.canvas.removeEventListener('touchcancel', this._onTouchEnd);
            this.canvas.removeEventListener('click', this._onClick);
        }
    }
}
