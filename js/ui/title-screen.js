import { PALETTE as P } from '../graphics/palette.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

export class TitleScreen {
    constructor() {
        this.selectedHairStyle = 'short'; // Default
        this.hoveredButton = null;
        this.ready = false;
        this.fadeIn = 0;

        this._onClick = this._onClick.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    activate(canvas) {
        this.canvas = canvas;
        this.ready = false;
        this.fadeIn = 0;
        canvas.addEventListener('click', this._onClick);
        canvas.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('keydown', this._onKeyDown);
    }

    deactivate() {
        window.removeEventListener('keydown', this._onKeyDown);
        if (this.canvas) {
            this.canvas.removeEventListener('click', this._onClick);
            this.canvas.removeEventListener('mousemove', this._onMouseMove);
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

    _onKeyDown(e) {
        if (this.fadeIn < 0.5) return; // Don't accept input during fade-in
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

        // Background
        ctx.fillStyle = '#2C2824';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Subtle pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < CANVAS_WIDTH; i += 8) {
            for (let j = 0; j < CANVAS_HEIGHT; j += 8) {
                if ((i + j) % 16 === 0) {
                    ctx.fillRect(i, j, 4, 4);
                }
            }
        }

        const cx = CANVAS_WIDTH / 2;

        // Draw Danish government crown
        this.drawCrown(ctx, cx, 140);

        // Title
        ctx.font = 'bold 28px "Courier New", monospace';
        ctx.fillStyle = P.UI_TEXT;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('KONTORFUNKTIONÆR', cx, 220);
        ctx.fillText('SIMULATOR', cx, 252);

        // Subtitle
        ctx.font = '13px "Courier New", monospace';
        ctx.fillStyle = P.UI_TEXT_DIM;
        ctx.fillText('Find chefen. Få notat-feedback. Inden børnehaven lukker.', cx, 290);

        // Divider
        ctx.strokeStyle = 'rgba(160, 152, 136, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 140, 320);
        ctx.lineTo(cx + 140, 320);
        ctx.stroke();

        // Hairstyle selection label
        ctx.font = '12px "Courier New", monospace';
        ctx.fillStyle = P.UI_TEXT_DIM;
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
        ctx.fillStyle = 'rgba(160, 152, 136, 0.4)';
        ctx.fillText('WASD eller piletaster for at bevæge dig', cx, 520);
        ctx.fillText('Centraladministrationen', cx, 540);

        ctx.globalAlpha = 1;
    }

    drawButton(ctx, rect, label, selected, hovered, isStart) {
        const { x, y, w, h } = rect;

        // Background
        if (isStart) {
            ctx.fillStyle = hovered ? '#5A7090' : '#4A6080';
        } else if (selected) {
            ctx.fillStyle = '#4A6080';
        } else {
            ctx.fillStyle = hovered ? '#4C4840' : '#3C3834';
        }
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 4);
        ctx.fill();

        // Border
        ctx.strokeStyle = selected ? '#6888A8' : 'rgba(160, 152, 136, 0.3)';
        ctx.lineWidth = selected ? 2 : 1;
        ctx.stroke();

        // Label
        ctx.font = isStart ? 'bold 16px "Courier New", monospace' : '13px "Courier New", monospace';
        ctx.fillStyle = selected || isStart ? P.UI_TEXT : P.UI_TEXT_DIM;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + w / 2, y + h / 2);
    }

    // Draw the Danish government crown (rigsvåben) — grand royal style
    drawCrown(ctx, cx, cy) {
        ctx.save();
        ctx.translate(cx, cy);

        const gold = '#C8A85C';
        const goldDark = '#8A7038';
        const goldLight = '#E8D088';
        const goldBright = '#F0E0A0';
        const velvet = '#6040A0';
        const velvetDark = '#483078';
        const jewel = '#D04040';
        const jewelBlue = '#4060C0';

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Velvet cap (visible between arches)
        ctx.fillStyle = velvet;
        ctx.beginPath();
        ctx.ellipse(0, -8, 28, 28, 0, Math.PI * 1.1, Math.PI * 1.9);
        ctx.quadraticCurveTo(0, -38, -28, -8);
        ctx.fill();

        // Crown arches — 5 grand arches with gold fill
        ctx.fillStyle = gold;
        ctx.strokeStyle = goldDark;
        ctx.lineWidth = 1.5;

        // Left outer arch
        ctx.beginPath();
        ctx.moveTo(-32, 14);
        ctx.quadraticCurveTo(-36, -10, -22, -24);
        ctx.lineTo(-18, -22);
        ctx.quadraticCurveTo(-30, -8, -26, 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Left inner arch
        ctx.beginPath();
        ctx.moveTo(-20, 12);
        ctx.quadraticCurveTo(-22, -14, -10, -32);
        ctx.lineTo(-6, -30);
        ctx.quadraticCurveTo(-16, -12, -14, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Center arch (tallest)
        ctx.beginPath();
        ctx.moveTo(-6, 10);
        ctx.quadraticCurveTo(-6, -22, 0, -40);
        ctx.quadraticCurveTo(6, -22, 6, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right inner arch
        ctx.beginPath();
        ctx.moveTo(14, 12);
        ctx.quadraticCurveTo(16, -12, 6, -30);
        ctx.lineTo(10, -32);
        ctx.quadraticCurveTo(22, -14, 20, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right outer arch
        ctx.beginPath();
        ctx.moveTo(26, 14);
        ctx.quadraticCurveTo(30, -8, 18, -22);
        ctx.lineTo(22, -24);
        ctx.quadraticCurveTo(36, -10, 32, 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Highlight on arches (gold shimmer)
        ctx.strokeStyle = goldLight;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-29, 6);
        ctx.quadraticCurveTo(-32, -6, -20, -18);
        ctx.moveTo(-17, 4);
        ctx.quadraticCurveTo(-19, -8, -8, -26);
        ctx.moveTo(-3, 2);
        ctx.quadraticCurveTo(-3, -16, 0, -34);
        ctx.moveTo(17, 4);
        ctx.quadraticCurveTo(19, -8, 8, -26);
        ctx.moveTo(29, 6);
        ctx.quadraticCurveTo(32, -6, 20, -18);
        ctx.stroke();

        // Crown base band (rim)
        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.ellipse(0, 18, 36, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = goldDark;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Band detail — inner highlight
        ctx.fillStyle = goldLight;
        ctx.beginPath();
        ctx.ellipse(0, 16, 34, 6, 0, Math.PI, 0);
        ctx.fill();

        // Band decoration — alternating jewels
        const bandJewels = [
            { x: -24, y: 15, c: jewel },
            { x: -12, y: 12, c: jewelBlue },
            { x: 0, y: 11, c: jewel },
            { x: 12, y: 12, c: jewelBlue },
            { x: 24, y: 15, c: jewel },
        ];
        for (const j of bandJewels) {
            // Jewel setting (gold border)
            ctx.fillStyle = goldDark;
            ctx.beginPath();
            ctx.ellipse(j.x, j.y, 4, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            // Jewel
            ctx.fillStyle = j.c;
            ctx.beginPath();
            ctx.ellipse(j.x, j.y, 3, 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
            // Jewel highlight
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.ellipse(j.x - 0.5, j.y - 0.8, 1.5, 1, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Crown tips — fleur-de-lis style balls
        ctx.fillStyle = goldBright;
        const tips = [
            { x: -20, y: -24 },
            { x: -8, y: -32 },
            { x: 0, y: -41 },
            { x: 8, y: -32 },
            { x: 20, y: -24 },
        ];
        for (const tip of tips) {
            // Larger ornamental ball
            ctx.fillStyle = gold;
            ctx.beginPath();
            ctx.arc(tip.x, tip.y, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = goldDark;
            ctx.lineWidth = 1;
            ctx.stroke();
            // Highlight
            ctx.fillStyle = goldBright;
            ctx.beginPath();
            ctx.arc(tip.x - 1, tip.y - 1, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Orb and cross on top (Reichsapfel)
        // Orb
        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.arc(0, -42, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = goldDark;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        // Orb band
        ctx.strokeStyle = goldDark;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, -42, 5, 2, 0, 0, Math.PI * 2);
        ctx.stroke();
        // Orb highlight
        ctx.fillStyle = goldBright;
        ctx.beginPath();
        ctx.arc(-1.5, -43.5, 2, 0, Math.PI * 2);
        ctx.fill();

        // Cross on orb
        ctx.strokeStyle = goldLight;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -47);
        ctx.lineTo(0, -56);
        ctx.moveTo(-5, -52);
        ctx.lineTo(5, -52);
        ctx.stroke();
        // Cross outline
        ctx.strokeStyle = goldDark;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -47);
        ctx.lineTo(0, -56);
        ctx.moveTo(-5, -52);
        ctx.lineTo(5, -52);
        ctx.stroke();

        ctx.restore();
    }

    isReady() {
        return this.ready;
    }

    getHairStyle() {
        return this.selectedHairStyle;
    }
}
