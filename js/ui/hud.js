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
        const y = 32;

        // Background pill
        ctx.fillStyle = 'rgba(44, 40, 36, 0.75)';
        const textWidth = 72;
        const pillX = x - textWidth - 8;
        const pillY = y - 14;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, textWidth + 16, 30, 6);
        ctx.fill();

        // Timer text
        let color = P.TIMER_NORMAL;
        if (timer.isCritical()) {
            // Flashing red
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

        // Small clock icon
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        const iconX = pillX + 12;
        const iconY = y;
        ctx.beginPath();
        ctx.arc(iconX, iconY, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(iconX, iconY - 3);
        ctx.lineTo(iconX, iconY);
        ctx.lineTo(iconX + 3, iconY + 1);
        ctx.stroke();

        // Subtle time deduction flash
        if (timer.isWarning() || timer.isCritical()) {
            // Progress bar at top of screen
            const progress = timer.getProgress();
            ctx.fillStyle = timer.isCritical() ? 'rgba(176, 64, 64, 0.4)' : 'rgba(200, 112, 64, 0.2)';
            ctx.fillRect(0, 0, CANVAS_WIDTH * (1 - progress), 2);
        }
    }
}
