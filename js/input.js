export class Input {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
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

    // Get movement direction as { dx, dy } in grid coordinates
    // In isometric view: up-arrow moves up-left on screen (col--, row--)
    getMovement() {
        let dx = 0;
        let dy = 0;

        // Up: decrease row (move away from camera)
        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) dy = -1;
        // Down: increase row (move toward camera)
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) dy = 1;
        // Left: decrease col
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) dx = -1;
        // Right: increase col
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) dx = 1;

        return { dx, dy };
    }

    clearJustPressed() {
        this.justPressed = {};
    }

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}
