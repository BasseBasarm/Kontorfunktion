import { PALETTE as P } from '../graphics/palette.js';
import { CANVAS_WIDTH } from '../constants.js';

export class HUD {
    constructor() {
        this.flashTimer = 0;
    }

    render(ctx, timer) {
        const formatted = timer.getFormatted();

        // Timer position — top right
        const x = CANVAS_WIDTH - 24;
        const y = 28;

        // Background pill
        ctx.fillStyle = 'rgba(44, 40, 36, 0.75)';
        const textWidth = 72;
        const pillX = x - textWidth - 8;
        const pillY = y - 14;
        ctx.fillRect(pillX, pillY, textWidth + 16, 28);

        // Timer text
        let color = P.TIMER_NORMAL;
        if (timer.isCritical()) {
            this.flashTimer += 16;
            color = Math.floor(this.flashTimer / 300) % 2 === 0 ? P.TIMER_CRITICAL : P.TIMER_NORMAL;
        } else if (timer.isWarning()) {
            color = P.TIMER_WARNING;
        }

        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(formatted, x, y);

        // Clock icon (pixel squares)
        ctx.fillStyle = color;
        const iconX = pillX + 12;
        const iconY = y;
        ctx.fillRect(iconX - 6, iconY - 6, 12, 12);
        ctx.fillStyle = 'rgba(44, 40, 36, 0.75)';
        ctx.fillRect(iconX - 4, iconY - 4, 8, 8);
        ctx.fillStyle = color;
        ctx.fillRect(iconX, iconY - 4, 2, 4);
        ctx.fillRect(iconX, iconY, 4, 2);

        // Progress bar at top
        if (timer.isWarning() || timer.isCritical()) {
            const progress = timer.getProgress();
            ctx.fillStyle = timer.isCritical() ? 'rgba(176, 64, 64, 0.4)' : 'rgba(200, 112, 64, 0.2)';
            ctx.fillRect(0, 0, Math.round(CANVAS_WIDTH * (1 - progress)), 3);
        }
    }

    renderTouchControls(ctx, input) {
        // No visible controls needed — tap-to-move is intuitive
    }
}
