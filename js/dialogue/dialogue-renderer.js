import { PALETTE as P } from '../graphics/palette.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DIALOGUE_PADDING } from '../constants.js';

export class DialogueRenderer {
    constructor() {
        this.boxHeight = 120;
        this.boxY = CANVAS_HEIGHT - this.boxHeight - 16;
        this.boxX = 40;
        this.boxWidth = CANVAS_WIDTH - 80;
    }

    render(ctx, dialogueSystem) {
        const line = dialogueSystem.getCurrentLine();
        if (!line) return;

        const pad = DIALOGUE_PADDING;
        const bx = this.boxX;
        const by = this.boxY;
        const bw = this.boxWidth;
        const bh = this.boxHeight;

        // Dim background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Dialogue box background
        ctx.fillStyle = P.DIALOGUE_BG;
        ctx.fillRect(bx, by, bw, bh);

        // Border
        ctx.strokeStyle = P.DIALOGUE_BORDER;
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh);

        // Top accent line
        ctx.fillStyle = P.DIALOGUE_BORDER;
        ctx.fillRect(bx, by, bw, 3);

        // Speaker name
        ctx.font = 'bold 14px "Courier New", monospace';
        ctx.fillStyle = P.DIALOGUE_SPEAKER;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(line.speaker, bx + pad, by + pad);

        // Dialogue text with word wrapping
        ctx.font = '13px "Courier New", monospace';
        ctx.fillStyle = P.DIALOGUE_TEXT;

        const maxWidth = bw - pad * 2;
        const lineHeight = 18;
        const textY = by + pad + 22;

        this.wrapText(ctx, line.text, bx + pad, textY, maxWidth, lineHeight);

        // Typing indicator (blinking cursor)
        if (!line.isComplete) {
            const cursorBlink = Math.floor(Date.now() / 400) % 2;
            if (cursorBlink === 0) {
                const metrics = ctx.measureText(line.text);
                // Approximate cursor position (just after last char on last line)
                const lines = this.getWrappedLines(ctx, line.text, maxWidth);
                const lastLine = lines[lines.length - 1] || '';
                const lastLineWidth = ctx.measureText(lastLine).width;
                const cursorY = textY + (lines.length - 1) * lineHeight;
                ctx.fillStyle = P.DIALOGUE_TEXT;
                ctx.fillRect(bx + pad + lastLineWidth + 2, cursorY, 8, 14);
            }
        }

        // "Tryk for at fortsætte" hint when line is complete and waiting
        if (line.isComplete) {
            ctx.font = '10px "Courier New", monospace';
            ctx.fillStyle = P.UI_TEXT_DIM;
            ctx.textAlign = 'right';
            const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
            ctx.globalAlpha = pulse;
            ctx.fillText('▼', bx + bw - pad, by + bh - pad);
            ctx.globalAlpha = 1;
        }
    }

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lineY = y;

        for (const word of words) {
            const testLine = line + (line ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line) {
                ctx.fillText(line, x, lineY);
                line = word;
                lineY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, lineY);
    }

    getWrappedLines(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let line = '';

        for (const word of words) {
            const testLine = line + (line ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line) {
                lines.push(line);
                line = word;
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        return lines;
    }
}
