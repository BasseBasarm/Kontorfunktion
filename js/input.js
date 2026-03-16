import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

export class Input {
    constructor() {
        this.keys = {};
        this.justPressed = {};

        // Touch state
        this.touchDx = 0;
        this.touchDy = 0;
        this.touchActive = false;
        this.touchOriginX = 0;
        this.touchOriginY = 0;
        this.touchCurrentX = 0;
        this.touchCurrentY = 0;
        this.tapped = false;
        this.canvas = null;

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    attachCanvas(canvas) {
        this.canvas = canvas;
        canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
        canvas.addEventListener('touchmove', this._onTouchMove, { passive: false });
        canvas.addEventListener('touchend', this._onTouchEnd, { passive: false });
        canvas.addEventListener('touchcancel', this._onTouchEnd, { passive: false });
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

        // Left half = joystick, right half = tap/action
        if (pos.x < CANVAS_WIDTH * 0.5) {
            this.touchActive = true;
            this.touchOriginX = pos.x;
            this.touchOriginY = pos.y;
            this.touchCurrentX = pos.x;
            this.touchCurrentY = pos.y;
            this.touchDx = 0;
            this.touchDy = 0;
        } else {
            this.tapped = true;
        }
    }

    _onTouchMove(e) {
        e.preventDefault();
        if (!this.touchActive) return;

        const touch = e.touches[0];
        const pos = this._canvasCoords(touch);
        this.touchCurrentX = pos.x;
        this.touchCurrentY = pos.y;

        const deadZone = 15;
        const diffX = pos.x - this.touchOriginX;
        const diffY = pos.y - this.touchOriginY;

        this.touchDx = Math.abs(diffX) > deadZone ? Math.sign(diffX) : 0;
        this.touchDy = Math.abs(diffY) > deadZone ? Math.sign(diffY) : 0;
    }

    _onTouchEnd(e) {
        e.preventDefault();
        this.touchActive = false;
        this.touchDx = 0;
        this.touchDy = 0;
    }

    _onKeyDown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' ', 'Enter'].includes(e.key)) {
            e.preventDefault();
        }
        if (!this.keys[e.key]) {
            this.justPressed[e.key] = true;
        }
        this.keys[e.key] = true;
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

    getTouchJoystick() {
        return {
            originX: this.touchOriginX,
            originY: this.touchOriginY,
            currentX: this.touchCurrentX,
            currentY: this.touchCurrentY,
        };
    }

    getMovement() {
        let dx = 0;
        let dy = 0;

        // Keyboard
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) dy = -1;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) dy = 1;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) dx = -1;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) dx = 1;

        // Touch joystick overrides if active
        if (this.touchActive && (this.touchDx !== 0 || this.touchDy !== 0)) {
            dx = this.touchDx;
            dy = this.touchDy;
        }

        return { dx, dy };
    }

    clearJustPressed() {
        this.justPressed = {};
        this.tapped = false;
    }

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
        if (this.canvas) {
            this.canvas.removeEventListener('touchstart', this._onTouchStart);
            this.canvas.removeEventListener('touchmove', this._onTouchMove);
            this.canvas.removeEventListener('touchend', this._onTouchEnd);
            this.canvas.removeEventListener('touchcancel', this._onTouchEnd);
        }
    }
}
