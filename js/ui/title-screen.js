import { PALETTE as P } from '../graphics/palette.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

// Djøf brand blue palette
const DJOEF_BLUE = '#003A6E';
const DJOEF_BLUE_LIGHT = '#1B5A96';
const DJOEF_BLUE_DARK = '#002244';
const DJOEF_BLUE_ACCENT = '#2070B0';

export class TitleScreen {
    constructor() {
        this.selectedHairStyle = 'short';
        this.hoveredButton = null;
        this.ready = false;
        this.fadeIn = 0;

        this._onClick = this._onClick.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
    }

    activate(canvas) {
        this.canvas = canvas;
        this.ready = false;
        this.fadeIn = 0;
        canvas.addEventListener('click', this._onClick);
        canvas.addEventListener('mousemove', this._onMouseMove);
        canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
        window.addEventListener('keydown', this._onKeyDown);
    }

    deactivate() {
        window.removeEventListener('keydown', this._onKeyDown);
        if (this.canvas) {
            this.canvas.removeEventListener('click', this._onClick);
            this.canvas.removeEventListener('mousemove', this._onMouseMove);
            this.canvas.removeEventListener('touchstart', this._onTouchStart);
        }
    }

    _getButtonRects() {
        const cx = CANVAS_WIDTH / 2;
        const btnY = 370;
        const btnW = 90;
        const btnH = 36;
        const gap = 12;
        const totalW = btnW * 3 + gap * 2;
        const startX = cx - totalW / 2;
        return {
            bald: { x: startX, y: btnY, w: btnW, h: btnH },
            short: { x: startX + btnW + gap, y: btnY, w: btnW, h: btnH },
            long: { x: startX + (btnW + gap) * 2, y: btnY, w: btnW, h: btnH },
            start: { x: cx - 80, y: 435, w: 160, h: 44 },
        };
    }

    _onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        const btns = this._getButtonRects();

        if (this._inRect(mx, my, btns.bald)) {
            this.selectedHairStyle = 'bald';
        } else if (this._inRect(mx, my, btns.short)) {
            this.selectedHairStyle = 'short';
        } else if (this._inRect(mx, my, btns.long)) {
            this.selectedHairStyle = 'long';
        } else if (this._inRect(mx, my, btns.start)) {
            this.ready = true;
        }
    }

    _onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;
        const mx = (touch.clientX - rect.left) * scaleX;
        const my = (touch.clientY - rect.top) * scaleY;
        const btns = this._getButtonRects();

        if (this._inRect(mx, my, btns.bald)) {
            this.selectedHairStyle = 'bald';
        } else if (this._inRect(mx, my, btns.short)) {
            this.selectedHairStyle = 'short';
        } else if (this._inRect(mx, my, btns.long)) {
            this.selectedHairStyle = 'long';
        } else if (this._inRect(mx, my, btns.start)) {
            this.ready = true;
        }
    }

    _onKeyDown(e) {
        if (this.fadeIn < 0.5) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.ready = true;
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            const order = ['bald', 'short', 'long'];
            const idx = order.indexOf(this.selectedHairStyle);
            this.selectedHairStyle = order[Math.max(0, idx - 1)];
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            const order = ['bald', 'short', 'long'];
            const idx = order.indexOf(this.selectedHairStyle);
            this.selectedHairStyle = order[Math.min(order.length - 1, idx + 1)];
        }
    }

    _onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        const btns = this._getButtonRects();

        this.hoveredButton = null;
        for (const [key, r] of Object.entries(btns)) {
            if (this._inRect(mx, my, r)) {
                this.hoveredButton = key;
                break;
            }
        }
        this.canvas.style.cursor = this.hoveredButton ? 'pointer' : 'default';
    }

    _inRect(mx, my, r) {
        return mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
    }

    update(dt) {
        this.fadeIn = Math.min(1, this.fadeIn + dt / 800);
    }

    render(ctx) {
        ctx.globalAlpha = this.fadeIn;

        // Djøf blue background — lighter, more professional/bureaucratic
        ctx.fillStyle = DJOEF_BLUE;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Subtle lighter stripe pattern (bureaucratic paper feel)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let y = 0; y < CANVAS_HEIGHT; y += 4) {
            if (y % 8 === 0) {
                ctx.fillRect(0, y, CANVAS_WIDTH, 2);
            }
        }

        // Subtle diamond grid overlay
        ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
        for (let i = 0; i < CANVAS_WIDTH; i += 16) {
            for (let j = 0; j < CANVAS_HEIGHT; j += 16) {
                if ((i + j) % 32 === 0) {
                    ctx.fillRect(i, j, 8, 8);
                }
            }
        }

        const cx = CANVAS_WIDTH / 2;

        // Light horizontal rule at top
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, 3);

        // Draw Christiansborg-inspired crown/building icon
        this.drawCrown(ctx, cx, 140);

        // Title — white on blue
        ctx.font = 'bold 28px "Courier New", monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('KONTORFUNKTIONÆR', cx, 220);
        ctx.fillText('SIMULATOR', cx, 252);

        // Subtitle — soft light blue
        ctx.font = '13px "Courier New", monospace';
        ctx.fillStyle = 'rgba(200, 220, 240, 0.7)';
        ctx.fillText('Find chefen. Få notat-feedback. Inden børnehaven lukker.', cx, 290);

        // Divider — light blue
        ctx.fillStyle = 'rgba(100, 160, 220, 0.3)';
        ctx.fillRect(cx - 140, 320, 280, 1);

        // Hairstyle selection label
        ctx.font = '12px "Courier New", monospace';
        ctx.fillStyle = 'rgba(200, 220, 240, 0.6)';
        ctx.fillText('Vælg frisure', cx, 348);

        // Hairstyle buttons
        const btns = this._getButtonRects();
        this.drawButton(ctx, btns.bald, 'Skaldet', this.selectedHairStyle === 'bald', this.hoveredButton === 'bald');
        this.drawButton(ctx, btns.short, 'Kort hår', this.selectedHairStyle === 'short', this.hoveredButton === 'short');
        this.drawButton(ctx, btns.long, 'Langt hår', this.selectedHairStyle === 'long', this.hoveredButton === 'long');

        // Start button
        this.drawButton(ctx, btns.start, 'START', false, this.hoveredButton === 'start', true);

        // Bottom text
        ctx.font = '10px "Courier New", monospace';
        ctx.fillStyle = 'rgba(180, 200, 220, 0.35)';
        ctx.fillText('WASD / piletaster / touch for at bevæge dig', cx, 520);
        ctx.fillText('Centraladministrationen', cx, 540);

        ctx.globalAlpha = 1;
    }

    drawButton(ctx, rect, label, selected, hovered, isStart) {
        const { x, y, w, h } = rect;

        // Shadow
        if (isStart || selected) {
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(x + 1, y + 2, w, h);
        }

        // Background
        if (isStart) {
            ctx.fillStyle = hovered ? '#E8C040' : '#D0A830';
        } else if (selected) {
            ctx.fillStyle = hovered ? DJOEF_BLUE_ACCENT : DJOEF_BLUE_LIGHT;
        } else {
            ctx.fillStyle = hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)';
        }
        ctx.fillRect(x, y, w, h);

        // Border
        if (isStart) {
            ctx.strokeStyle = '#F0D050';
            ctx.lineWidth = 2;
        } else if (selected) {
            ctx.strokeStyle = DJOEF_BLUE_ACCENT;
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 1;
        }
        ctx.strokeRect(x, y, w, h);

        // Top highlight
        if (isStart || selected) {
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(x + 2, y + 1, w - 4, 1);
        }

        // Label
        ctx.font = isStart ? 'bold 16px "Courier New", monospace' : '13px "Courier New", monospace';
        ctx.fillStyle = isStart ? DJOEF_BLUE_DARK : (selected ? '#FFFFFF' : 'rgba(200, 220, 240, 0.7)');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + w / 2, y + h / 2);
    }

    // Pixel-art Christiansborg-inspired crown
    drawCrown(ctx, cx, cy) {
        ctx.save();

        const gold = '#D4B860';
        const goldDark = '#A08030';
        const goldLight = '#F0E090';
        const velvet = '#6040A0';
        const jewel = '#D04040';
        const jewelBlue = '#4090E0';

        const bx = Math.round(cx - 36);
        const by = Math.round(cy);

        // Velvet cap
        ctx.fillStyle = velvet;
        ctx.fillRect(bx + 6, by - 30, 60, 30);
        ctx.fillRect(bx + 12, by - 36, 48, 6);
        ctx.fillRect(bx + 18, by - 42, 36, 6);

        // Five prongs
        ctx.fillStyle = gold;
        // Left outer
        ctx.fillRect(bx, by - 12, 6, 12);
        ctx.fillRect(bx, by - 24, 6, 12);
        ctx.fillRect(bx + 2, by - 30, 6, 6);
        // Left inner
        ctx.fillRect(bx + 16, by - 18, 6, 18);
        ctx.fillRect(bx + 16, by - 36, 6, 18);
        ctx.fillRect(bx + 18, by - 42, 6, 6);
        // Center (tallest)
        ctx.fillRect(bx + 30, by - 24, 12, 24);
        ctx.fillRect(bx + 32, by - 48, 8, 24);
        ctx.fillRect(bx + 34, by - 54, 4, 6);
        // Right inner
        ctx.fillRect(bx + 50, by - 18, 6, 18);
        ctx.fillRect(bx + 50, by - 36, 6, 18);
        ctx.fillRect(bx + 48, by - 42, 6, 6);
        // Right outer
        ctx.fillRect(bx + 66, by - 12, 6, 12);
        ctx.fillRect(bx + 66, by - 24, 6, 12);
        ctx.fillRect(bx + 64, by - 30, 6, 6);

        // Highlights
        ctx.fillStyle = goldLight;
        ctx.fillRect(bx + 2, by - 28, 2, 4);
        ctx.fillRect(bx + 18, by - 40, 2, 4);
        ctx.fillRect(bx + 34, by - 52, 4, 4);
        ctx.fillRect(bx + 52, by - 40, 2, 4);
        ctx.fillRect(bx + 68, by - 28, 2, 4);

        // Tips
        ctx.fillStyle = '#F0E0A0';
        ctx.fillRect(bx + 2, by - 30, 4, 2);
        ctx.fillRect(bx + 18, by - 42, 4, 2);
        ctx.fillRect(bx + 34, by - 54, 4, 2);
        ctx.fillRect(bx + 50, by - 42, 4, 2);
        ctx.fillRect(bx + 66, by - 30, 4, 2);

        // Base band
        ctx.fillStyle = gold;
        ctx.fillRect(bx - 2, by, 76, 10);
        ctx.fillStyle = goldLight;
        ctx.fillRect(bx, by, 72, 4);
        ctx.fillStyle = goldDark;
        ctx.fillRect(bx - 2, by + 8, 76, 2);

        // Jewels
        ctx.fillStyle = jewel;
        ctx.fillRect(bx + 6, by + 2, 6, 4);
        ctx.fillStyle = jewelBlue;
        ctx.fillRect(bx + 20, by + 2, 6, 4);
        ctx.fillStyle = jewel;
        ctx.fillRect(bx + 34, by + 2, 6, 4);
        ctx.fillStyle = jewelBlue;
        ctx.fillRect(bx + 46, by + 2, 6, 4);
        ctx.fillStyle = jewel;
        ctx.fillRect(bx + 60, by + 2, 6, 4);

        // Cross on top
        ctx.fillStyle = goldLight;
        ctx.fillRect(bx + 34, by - 66, 4, 12);
        ctx.fillRect(bx + 28, by - 62, 16, 4);
        ctx.fillStyle = goldDark;
        ctx.fillRect(bx + 32, by - 66, 2, 2);

        ctx.restore();
    }

    isReady() { return this.ready; }
    getHairStyle() { return this.selectedHairStyle; }
}
