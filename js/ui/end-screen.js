import { PALETTE as P } from '../graphics/palette.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

export class EndScreen {
    constructor() {
        this.fadeIn = 0;
        this.ready = false;
        this._onClick = this._onClick.bind(this);
    }

    activate(canvas) {
        this.canvas = canvas;
        this.fadeIn = 0;
        this.ready = false;
        canvas.addEventListener('click', this._onClick);
    }

    deactivate() {
        if (this.canvas) {
            this.canvas.removeEventListener('click', this._onClick);
        }
    }

    _onClick() {
        if (this.fadeIn > 0.8) this.ready = true;
    }

    update(dt) {
        this.fadeIn = Math.min(1, this.fadeIn + dt / 1500);
    }

    renderSuccess(ctx) {
        ctx.globalAlpha = this.fadeIn;
        ctx.fillStyle = '#1C1810';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const cx = CANVAS_WIDTH / 2;

        if (this.fadeIn > 0.5) {
            ctx.globalAlpha = (this.fadeIn - 0.5) * 2;
            ctx.font = '14px "Courier New", monospace';
            ctx.fillStyle = P.UI_TEXT_DIM;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Notatet er udskudt to uger.', cx, CANVAS_HEIGHT / 2 - 30);
            ctx.fillText('Du hentede børnene til tiden.', cx, CANVAS_HEIGHT / 2);
            ctx.font = '11px "Courier New", monospace';
            ctx.fillStyle = 'rgba(160, 152, 136, 0.4)';
            ctx.fillText('Det var det.', cx, CANVAS_HEIGHT / 2 + 40);
        }
        if (this.fadeIn > 0.9) {
            ctx.globalAlpha = (this.fadeIn - 0.9) * 10;
            ctx.font = '12px "Courier New", monospace';
            ctx.fillStyle = P.UI_TEXT_DIM;
            ctx.fillText('[ Klik for at prøve igen ]', cx, CANVAS_HEIGHT / 2 + 100);
        }
        ctx.globalAlpha = 1;
    }

    renderFailure(ctx) {
        ctx.globalAlpha = this.fadeIn;
        ctx.fillStyle = '#1C1810';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const cx = CANVAS_WIDTH / 2;

        if (this.fadeIn > 0.3) {
            ctx.globalAlpha = Math.min(1, (this.fadeIn - 0.3) * 1.4);
            ctx.font = '14px "Courier New", monospace';
            ctx.fillStyle = P.UI_TEXT;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Du fik ikke feedback.', cx, CANVAS_HEIGHT / 2 - 40);
            ctx.fillStyle = P.UI_TEXT_DIM;
            ctx.fillText('Du hentede ikke børnene inden lukketid.', cx, CANVAS_HEIGHT / 2);
            ctx.font = '11px "Courier New", monospace';
            ctx.fillStyle = 'rgba(176, 64, 64, 0.6)';
            ctx.fillText('Institutionen ringede.', cx, CANVAS_HEIGHT / 2 + 30);
        }
        if (this.fadeIn > 0.8) {
            ctx.globalAlpha = (this.fadeIn - 0.8) * 5;
            ctx.font = '12px "Courier New", monospace';
            ctx.fillStyle = P.UI_TEXT_DIM;
            ctx.fillText('[ Klik for at prøve igen ]', cx, CANVAS_HEIGHT / 2 + 100);
        }
        ctx.globalAlpha = 1;
    }

    isReady() { return this.ready; }
}
