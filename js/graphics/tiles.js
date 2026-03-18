import { TILE, TILE_WIDTH, TILE_HEIGHT, WALL_HEIGHT } from '../constants.js';
import { PALETTE as P } from './palette.js';

const HW = TILE_WIDTH / 2;  // 32
const HH = TILE_HEIGHT / 2; // 16

// ── Floor detail patterns ──────────────────────────────────

// Subtle carpet dot pattern for office areas — warmer
function drawCarpetTexture(ctx, x, y) {
    ctx.fillStyle = 'rgba(80,60,30,0.05)';
    for (let i = -14; i <= 14; i += 7) {
        for (let j = -5; j <= 5; j += 5) {
            ctx.fillRect(x + i, y + j, 1, 1);
        }
    }
}

// Kitchen/restroom tile grout — clean white lines
function drawTileGrout(ctx, x, y) {
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x - HW * 0.6, y);
    ctx.lineTo(x + HW * 0.6, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - HH * 0.5);
    ctx.lineTo(x, y + HH * 0.5);
    ctx.stroke();
}

// Minister carpet border — rich warm edge inlay
function drawCarpetBorder(ctx, x, y) {
    ctx.strokeStyle = 'rgba(120,80,30,0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y - HH + 4);
    ctx.lineTo(x + HW - 6, y);
    ctx.lineTo(x, y + HH - 4);
    ctx.lineTo(x - HW + 6, y);
    ctx.closePath();
    ctx.stroke();
    // Inner border
    ctx.strokeStyle = 'rgba(160,120,50,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - HH + 7);
    ctx.lineTo(x + HW - 9, y);
    ctx.lineTo(x, y + HH - 7);
    ctx.lineTo(x - HW + 9, y);
    ctx.closePath();
    ctx.stroke();
}

// Meeting room carpet — subtle diagonal pattern (like reference)
function drawMeetingCarpet(ctx, x, y) {
    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 0.6;
    for (let i = -12; i <= 12; i += 6) {
        ctx.beginPath();
        ctx.moveTo(x + i - 4, y - 4);
        ctx.lineTo(x + i + 4, y + 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + i + 4, y - 4);
        ctx.lineTo(x + i - 4, y + 4);
        ctx.stroke();
    }
}

// Wood floor plank texture (for corridors / special areas)
function drawWoodTexture(ctx, x, y) {
    ctx.strokeStyle = 'rgba(80,50,20,0.08)';
    ctx.lineWidth = 0.5;
    // Horizontal plank lines (in iso space)
    for (let j = -6; j <= 6; j += 4) {
        ctx.beginPath();
        ctx.moveTo(x - HW * 0.6, y + j);
        ctx.lineTo(x + HW * 0.6, y + j);
        ctx.stroke();
    }
}

// Draw an isometric diamond (floor tile) with optional inner shading
function drawDiamond(ctx, x, y, color, outlineColor) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - HH);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x, y + HH);
    ctx.lineTo(x - HW, y);
    ctx.closePath();
    ctx.fill();
    if (outlineColor) {
        ctx.strokeStyle = outlineColor;
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }
    // Subtle inner edge highlight (top-left edge lighter)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x - HW + 1, y);
    ctx.lineTo(x, y - HH + 1);
    ctx.stroke();
}

// Draw an isometric box (for furniture and walls)
function drawBox(ctx, x, y, w, d, h, topColor, leftColor, rightColor, outline) {
    const hw = w / 2;
    const hd = d / 2;

    // Right face
    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(x, y - h + d);
    ctx.lineTo(x + hw, y - h + hd);
    ctx.lineTo(x + hw, y + hd);
    ctx.lineTo(x, y + d);
    ctx.closePath();
    ctx.fill();

    // Left face
    ctx.fillStyle = leftColor;
    ctx.beginPath();
    ctx.moveTo(x, y - h + d);
    ctx.lineTo(x - hw, y - h + hd);
    ctx.lineTo(x - hw, y + hd);
    ctx.lineTo(x, y + d);
    ctx.closePath();
    ctx.fill();

    // Top face
    ctx.fillStyle = topColor;
    ctx.beginPath();
    ctx.moveTo(x, y - h);
    ctx.lineTo(x + hw, y - h + hd);
    ctx.lineTo(x, y - h + d);
    ctx.lineTo(x - hw, y - h + hd);
    ctx.closePath();
    ctx.fill();

    if (outline) {
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.5;
        // Top
        ctx.beginPath();
        ctx.moveTo(x, y - h);
        ctx.lineTo(x + hw, y - h + hd);
        ctx.lineTo(x, y - h + d);
        ctx.lineTo(x - hw, y - h + hd);
        ctx.closePath();
        ctx.stroke();
        // Left edge
        ctx.beginPath();
        ctx.moveTo(x - hw, y - h + hd);
        ctx.lineTo(x - hw, y + hd);
        ctx.lineTo(x, y + d);
        ctx.stroke();
        // Right edge
        ctx.beginPath();
        ctx.moveTo(x + hw, y - h + hd);
        ctx.lineTo(x + hw, y + hd);
        ctx.lineTo(x, y + d);
        ctx.stroke();
        // Bottom front edge
        ctx.beginPath();
        ctx.moveTo(x - hw, y + hd);
        ctx.lineTo(x, y + d);
        ctx.lineTo(x + hw, y + hd);
        ctx.stroke();
    }
}

// Draw a south-facing wall segment (Habbo cut-away style)
function drawWallSouth(ctx, x, y) {
    const h = WALL_HEIGHT;
    const bandH = 6;

    // Wall front face (main body)
    ctx.fillStyle = P.WALL_FRONT;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x, y + HH);
    ctx.lineTo(x, y + HH - h);
    ctx.lineTo(x - HW, y - h);
    ctx.closePath();
    ctx.fill();

    // Decorative band near top (Habbo-style accent stripe)
    ctx.fillStyle = P.WALL_ACCENT;
    ctx.beginPath();
    ctx.moveTo(x - HW, y - h + bandH + 4);
    ctx.lineTo(x, y + HH - h + bandH + 4);
    ctx.lineTo(x, y + HH - h + 4);
    ctx.lineTo(x - HW, y - h + 4);
    ctx.closePath();
    ctx.fill();

    // Wall top
    ctx.fillStyle = P.WALL_TOP;
    ctx.beginPath();
    ctx.moveTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x, y + HH - h);
    ctx.closePath();
    ctx.fill();

    // Right side face
    ctx.fillStyle = P.WALL_SIDE;
    ctx.beginPath();
    ctx.moveTo(x, y + HH);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x, y + HH - h);
    ctx.closePath();
    ctx.fill();

    // Baseboard / fodliste (dark stripe at wall base)
    ctx.fillStyle = 'rgba(60,50,40,0.5)';
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x, y + HH);
    ctx.lineTo(x, y + HH - 4);
    ctx.lineTo(x - HW, y - 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y + HH);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x + HW, y - 4);
    ctx.lineTo(x, y + HH - 4);
    ctx.closePath();
    ctx.fill();

    // Outline
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x, y + HH);
    ctx.closePath();
    ctx.stroke();
}

// Draw an east-facing wall segment
function drawWallEast(ctx, x, y) {
    const h = WALL_HEIGHT;
    const bandH = 6;

    // Front face (right-facing)
    ctx.fillStyle = P.WALL_FRONT;
    ctx.beginPath();
    ctx.moveTo(x, y + HH);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x, y + HH - h);
    ctx.closePath();
    ctx.fill();

    // Decorative band
    ctx.fillStyle = P.WALL_ACCENT;
    ctx.beginPath();
    ctx.moveTo(x, y + HH - h + bandH + 4);
    ctx.lineTo(x + HW, y - h + bandH + 4);
    ctx.lineTo(x + HW, y - h + 4);
    ctx.lineTo(x, y + HH - h + 4);
    ctx.closePath();
    ctx.fill();

    // Side face (left side - darker)
    ctx.fillStyle = P.WALL_SIDE;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x, y + HH);
    ctx.lineTo(x, y + HH - h);
    ctx.lineTo(x - HW, y - h);
    ctx.closePath();
    ctx.fill();

    // Top
    ctx.fillStyle = P.WALL_TOP;
    ctx.beginPath();
    ctx.moveTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x, y + HH - h);
    ctx.closePath();
    ctx.fill();

    // Baseboard / fodliste
    ctx.fillStyle = 'rgba(60,50,40,0.5)';
    ctx.beginPath();
    ctx.moveTo(x, y + HH);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x + HW, y - 4);
    ctx.lineTo(x, y + HH - 4);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x, y + HH);
    ctx.lineTo(x, y + HH - 4);
    ctx.lineTo(x - HW, y - 4);
    ctx.closePath();
    ctx.fill();

    // Outline
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x, y + HH);
    ctx.closePath();
    ctx.stroke();
}

// Draw wall corner
function drawWallCorner(ctx, x, y) {
    drawWallSouth(ctx, x, y);
    drawWallEast(ctx, x, y);
}

// Draw glass wall south
function drawGlassWallSouth(ctx, x, y) {
    const h = WALL_HEIGHT;

    // Glass fill (semi-transparent)
    ctx.fillStyle = P.GLASS_WALL;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x, y + HH);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x, y - HH - h + HH);
    ctx.lineTo(x - HW, y - h);
    ctx.closePath();
    ctx.fill();

    // Frame
    ctx.strokeStyle = P.GLASS_FRAME;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x, y + HH);
    ctx.closePath();
    ctx.stroke();

    // Middle horizontal bar
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - HW, y - h * 0.5);
    ctx.lineTo(x, y + HH - h * 0.5);
    ctx.lineTo(x + HW, y - h * 0.5);
    ctx.stroke();

    // Reflection highlights
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - HW * 0.3, y - h * 0.7);
    ctx.lineTo(x + HW * 0.2, y - h * 0.3);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - HW * 0.15, y - h * 0.7);
    ctx.lineTo(x + HW * 0.35, y - h * 0.3);
    ctx.stroke();
}

// Draw glass wall east
function drawGlassWallEast(ctx, x, y) {
    const h = WALL_HEIGHT;
    ctx.fillStyle = P.GLASS_WALL;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x, y + HH);
    ctx.lineTo(x, y + HH - h);
    ctx.lineTo(x - HW, y - h);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = P.GLASS_FRAME;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Middle bar
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - HW, y - h * 0.5);
    ctx.lineTo(x, y + HH - h * 0.5);
    ctx.stroke();

    // Reflection highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - HW * 0.2, y - h * 0.6);
    ctx.lineTo(x, y - h * 0.25);
    ctx.stroke();
}

// ── FURNITURE ──────────────────────────────────────────────

// Draw height-adjustable desk workstation with PROPER LEGS
// Helper: draw an isometric vertical pillar (leg) from top to bottom
function drawIsoPillar(ctx, x, y, w, d, h, color, darkColor, outline) {
    const hw = w / 2;
    const hd = d / 2;
    // Left face
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.moveTo(x - hw, y - h + hd);
    ctx.lineTo(x - hw, y + hd);
    ctx.lineTo(x, y + d);
    ctx.lineTo(x, y - h + d);
    ctx.closePath();
    ctx.fill();
    // Right face
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + hw, y - h + hd);
    ctx.lineTo(x + hw, y + hd);
    ctx.lineTo(x, y + d);
    ctx.lineTo(x, y - h + d);
    ctx.closePath();
    ctx.fill();
    if (outline) {
        ctx.strokeStyle = outline;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x - hw, y + hd);
        ctx.lineTo(x - hw, y - h + hd);
        ctx.lineTo(x, y - h);
        ctx.lineTo(x + hw, y - h + hd);
        ctx.lineTo(x + hw, y + hd);
        ctx.lineTo(x, y + d);
        ctx.closePath();
        ctx.stroke();
    }
}

// Helper: draw an isometric flat diamond shape on a surface (for keyboard, laptop, etc.)
function drawIsoDiamond(ctx, x, y, w, d, color, outline) {
    const hw = w / 2;
    const hd = d / 2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - hd);
    ctx.lineTo(x + hw, y);
    ctx.lineTo(x, y + hd);
    ctx.lineTo(x - hw, y);
    ctx.closePath();
    ctx.fill();
    if (outline) {
        ctx.strokeStyle = outline;
        ctx.lineWidth = 0.6;
        ctx.stroke();
    }
}

// Helper: draw isometric monitor (thin upright box facing south-west)
function drawIsoMonitor(ctx, x, y, screenW, screenH) {
    const hw = screenW / 2;
    // Monitor stand - small isometric pillar
    drawIsoPillar(ctx, x, y + 2, 4, 3, 6, '#505050', '#383838', P.WALL_OUTLINE);
    // Stand base - small flat diamond
    drawIsoDiamond(ctx, x, y + 5, 10, 5, '#484848', P.WALL_OUTLINE);

    // Monitor frame (thin isometric box standing upright)
    const monY = y - screenH + 2;
    // Back face (dark)
    ctx.fillStyle = '#1C1C1C';
    ctx.beginPath();
    ctx.moveTo(x - hw, monY + screenH * 0.15);
    ctx.lineTo(x - hw, monY + screenH * 0.15 + screenH);
    ctx.lineTo(x + hw, monY + screenH * 0.15 + screenH - 2);
    ctx.lineTo(x + hw, monY + screenH * 0.15 - 2);
    ctx.closePath();
    ctx.fill();

    // Screen face (slightly angled to show it's a monitor)
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.moveTo(x - hw + 1, monY + 2);
    ctx.lineTo(x + hw - 1, monY);
    ctx.lineTo(x + hw - 1, monY + screenH - 2);
    ctx.lineTo(x - hw + 1, monY + screenH);
    ctx.closePath();
    ctx.fill();

    // Screen content
    ctx.fillStyle = P.MONITOR_SCREEN;
    ctx.beginPath();
    ctx.moveTo(x - hw + 3, monY + 4);
    ctx.lineTo(x + hw - 3, monY + 2);
    ctx.lineTo(x + hw - 3, monY + screenH - 4);
    ctx.lineTo(x - hw + 3, monY + screenH - 2);
    ctx.closePath();
    ctx.fill();

    // Screen highlight (top reflection)
    ctx.fillStyle = P.MONITOR_GLOW;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(x - hw + 3, monY + 4);
    ctx.lineTo(x + hw - 3, monY + 2);
    ctx.lineTo(x + hw - 3, monY + 5);
    ctx.lineTo(x - hw + 3, monY + 7);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Screen text lines
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(x - hw + 5, monY + 9, screenW - 12, 1);
    ctx.fillRect(x - hw + 5, monY + 11, screenW - 16, 1);
    ctx.fillRect(x - hw + 5, monY + 13, screenW - 10, 1);

    // Monitor outline
    ctx.strokeStyle = '#101010';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - hw + 1, monY + 2);
    ctx.lineTo(x + hw - 1, monY);
    ctx.lineTo(x + hw - 1, monY + screenH - 2);
    ctx.lineTo(x - hw + 1, monY + screenH);
    ctx.closePath();
    ctx.stroke();
}

function drawDesk(ctx, x, y) {
    drawDeskBase(ctx, x, y);

    // Monitor on desk
    drawIsoMonitor(ctx, x - 2, y - 1, 24, 16);

    // Keyboard — isometric diamond on desk surface
    drawIsoDiamond(ctx, x + 2, y + 5, 16, 6, '#D4D4D0', '#A0A0A0');
    // Key row detail
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(x - 4, y + 4, 12, 1);
    ctx.fillRect(x - 3, y + 6, 10, 1);

    // Mouse — small iso diamond
    drawIsoDiamond(ctx, x + 13, y + 5, 5, 3, '#C8C8C4', '#909090');
}

// Draw ergonomic office chair — fully isometric
function drawChair(ctx, x, y) {
    // 5-star base as isometric cross on the ground plane
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    // Draw 5 legs as isometric lines radiating from center
    const baseY = y + 12;
    const legLen = 7;
    const angles = [
        [-legLen, -legLen * 0.4],
        [legLen, -legLen * 0.4],
        [-legLen * 0.8, legLen * 0.5],
        [legLen * 0.8, legLen * 0.5],
        [0, -legLen * 0.6],
    ];
    for (const [dx, dy] of angles) {
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x + dx, baseY + dy);
        ctx.stroke();
        // Caster wheel at tip
        ctx.fillStyle = '#303030';
        ctx.fillRect(Math.round(x + dx) - 1, Math.round(baseY + dy) - 1, 2, 2);
    }
    // Center hub
    ctx.fillStyle = '#484848';
    ctx.fillRect(Math.round(x) - 2, Math.round(baseY) - 2, 4, 4);

    // Pneumatic pillar — isometric vertical
    drawIsoPillar(ctx, x, y + 6, 3, 2, 8, '#585858', '#404040', null);

    // Seat cushion — isometric box
    drawBox(ctx, x, y + 4, 16, 10, 3, P.CHAIR_SEAT, P.CHAIR_BACK, P.CHAIR_BACK, P.WALL_OUTLINE);

    // Backrest — isometric upright panel
    ctx.fillStyle = P.CHAIR_BACK;
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 2);
    ctx.lineTo(x - 8, y - 8);
    ctx.lineTo(x, y - 11);
    ctx.lineTo(x + 8, y - 8);
    ctx.lineTo(x + 7, y + 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Armrests — isometric small boxes
    // Left armrest support
    drawIsoPillar(ctx, x - 8, y + 1, 2, 2, 5, '#505050', '#383838', null);
    // Right armrest support
    drawIsoPillar(ctx, x + 8, y + 1, 2, 2, 5, '#505050', '#383838', null);
    // Armrest pads (small iso diamonds)
    drawIsoDiamond(ctx, x - 8, y - 2, 4, 3, '#585858', null);
    drawIsoDiamond(ctx, x + 8, y - 2, 4, 3, '#585858', null);
}

// Draw coffee machine — isometric body
function drawCoffeeMachine(ctx, x, y) {
    drawBox(ctx, x, y + 4, 20, 14, 26, P.COFFEE_MACHINE, '#1C1C1C', '#404040', P.WALL_OUTLINE);
    // Red power light
    ctx.fillStyle = '#E04040';
    ctx.fillRect(Math.round(x - 3) - 1, Math.round(y - 16) - 1, 2, 2);
    // Green ready light
    ctx.fillStyle = '#40C060';
    ctx.fillRect(Math.round(x + 3) - 1, Math.round(y - 16) - 1, 2, 2);
    // Drip tray — iso diamond
    drawIsoDiamond(ctx, x, y + 1, 12, 6, '#202020', '#101010');
    // Small cup — tiny isometric box
    drawBox(ctx, x, y - 1, 5, 3, 4, '#F0E8D8', '#D8D0C0', '#E8E0D0', 'rgba(60,50,40,0.4)');
    // Steam wisps
    ctx.strokeStyle = 'rgba(220,220,220,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 1, y - 4);
    ctx.lineTo(x - 1, y - 13);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 2, y - 3);
    ctx.lineTo(x + 2, y - 12);
    ctx.stroke();
}

// Draw printer — isometric box with paper trays
function drawPrinter(ctx, x, y) {
    drawBox(ctx, x, y + 4, 26, 18, 14, P.PRINTER_BODY, P.PRINTER_DARK, P.PRINTER_BODY, P.WALL_OUTLINE);
    // Paper input tray — iso diamond on top
    drawIsoDiamond(ctx, x, y - 6, 14, 6, P.PAPER_WHITE, 'rgba(0,0,0,0.1)');
    // Paper output — small iso diamond poking out front
    drawIsoDiamond(ctx, x, y + 4, 12, 5, P.PAPER_WHITE, 'rgba(160,152,136,0.3)');
    // Control panel — small box on right side
    drawBox(ctx, x + 8, y - 4, 5, 3, 3, '#404040', '#303030', '#484848', null);
    // Green LED
    ctx.fillStyle = '#40C060';
    ctx.fillRect(Math.round(x + 8) - 1, Math.round(y - 5) - 1, 2, 2);
}

// Draw plant
function drawPlant(ctx, x, y) {
    // Pot
    drawBox(ctx, x, y + 8, 14, 10, 12, P.PLANT_POT, '#704820', '#603818', P.WALL_OUTLINE);
    // Soil — flat iso oval via stacked rects
    ctx.fillStyle = '#483018';
    ctx.fillRect(x - 6, y - 3, 12, 2);
    ctx.fillRect(x - 4, y - 4, 8, 1);
    ctx.fillRect(x - 4, y - 1, 8, 1);
    // Leaves (overlapping pixel clusters for lush look)
    ctx.fillStyle = P.PLANT_DARK;
    ctx.fillRect(x - 10, y - 10, 10, 8);
    ctx.fillRect(x - 8, y - 11, 6, 1);
    ctx.fillStyle = P.PLANT_LEAVES;
    ctx.fillRect(x - 7, y - 17, 14, 14);
    ctx.fillRect(x - 5, y - 18, 10, 1);
    ctx.fillRect(x - 5, y - 3, 10, 1);
    ctx.fillStyle = P.PLANT_DARK;
    ctx.fillRect(x, y - 11, 8, 8);
    ctx.fillRect(x + 1, y - 12, 6, 1);
    ctx.fillStyle = P.PLANT_LEAVES;
    ctx.fillRect(x - 3, y - 17, 10, 10);
    ctx.fillRect(x - 1, y - 18, 6, 1);
    // Highlight leaves
    ctx.fillStyle = '#58A848';
    ctx.fillRect(x - 5, y - 16, 6, 6);
    ctx.fillRect(x - 4, y - 17, 4, 1);
    // Outline
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 7, y - 10);
    ctx.lineTo(x - 5, y - 18);
    ctx.lineTo(x + 5, y - 18);
    ctx.lineTo(x + 7, y - 10);
    ctx.lineTo(x + 5, y - 3);
    ctx.lineTo(x - 5, y - 3);
    ctx.closePath();
    ctx.stroke();
}

// Draw meeting table
function drawMeetingTable(ctx, x, y) {
    // 4 isometric table legs — extended to reach floor
    const woodColor = '#6B4B28';
    const woodDark = '#4B2B10';
    drawIsoPillar(ctx, x - 14, y + 2, 3, 2, 16, woodColor, woodDark, P.WALL_OUTLINE);
    drawIsoPillar(ctx, x + 14, y + 2, 3, 2, 16, woodColor, woodDark, P.WALL_OUTLINE);
    drawIsoPillar(ctx, x - 10, y + 11, 3, 2, 16, woodColor, woodDark, P.WALL_OUTLINE);
    drawIsoPillar(ctx, x + 10, y + 11, 3, 2, 16, woodColor, woodDark, P.WALL_OUTLINE);
    // Grounding shadows
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(x - 15, y + 18, 4, 1);
    ctx.fillRect(x + 13, y + 18, 4, 1);
    ctx.fillRect(x - 11, y + 27, 4, 1);
    ctx.fillRect(x + 9, y + 27, 4, 1);

    drawBox(ctx, x, y + 2, HW * 1.6, HH * 1.4, 3, '#9B8365', '#6B5335', '#8B7355', P.WALL_OUTLINE);

    // Papers on table (iso diamond)
    drawIsoDiamond(ctx, x - 4, y - 2, 10, 5, P.PAPER_WHITE, 'rgba(140,130,110,0.3)');
    // Pen
    ctx.strokeStyle = '#2040A0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 1);
    ctx.lineTo(x + 10, y - 3);
    ctx.stroke();
    // Water glass — tiny isometric cylinder
    drawBox(ctx, x + 8, y + 1, 5, 3, 4, 'rgba(160,200,240,0.4)', 'rgba(120,170,220,0.3)', 'rgba(140,190,230,0.35)', 'rgba(100,150,200,0.4)');
}

// Draw large round meeting table (spans ~2 tiles visually)
function drawRoundMeetingTable(ctx, x, y) {
    const woodColor = '#9B8365';
    const woodDark = '#6B5335';
    const woodSide = '#8B7355';
    const legColor = '#1E1E1E';
    const legHighlight = '#333333';
    const legW = 3;

    // Ellipse dimensions (isometric: wider than tall)
    const rx = 26; // horizontal radius
    const ry = 14; // vertical radius
    const tableY = y + 6; // center of ellipse top face
    const edgeH = 4; // thickness of table edge

    // Back legs — drawn BEFORE surface (behind table)
    ctx.fillStyle = legColor;
    ctx.fillRect(x - 16, y - 2, legW, 18);
    ctx.fillRect(x + 14, y - 2, legW, 18);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - 16, y - 2, legW, 18);
    ctx.strokeRect(x + 14, y - 2, legW, 18);

    // Table edge (front half of cylinder) — drawn as lower ellipse
    ctx.fillStyle = woodDark;
    ctx.beginPath();
    ctx.ellipse(x, tableY + edgeH, rx, ry, 0, 0, Math.PI);
    ctx.lineTo(x - rx, tableY);
    ctx.ellipse(x, tableY, rx, ry, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();

    // Right-side edge highlight
    ctx.fillStyle = woodSide;
    ctx.beginPath();
    ctx.ellipse(x, tableY + edgeH, rx, ry, 0, -0.3, Math.PI * 0.3);
    ctx.lineTo(x + rx * Math.cos(Math.PI * 0.3), tableY + ry * Math.sin(Math.PI * 0.3));
    ctx.ellipse(x, tableY, rx, ry, 0, Math.PI * 0.3, -0.3, true);
    ctx.closePath();
    ctx.fill();

    // Table top face — ellipse
    ctx.fillStyle = woodColor;
    ctx.beginPath();
    ctx.ellipse(x, tableY, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1;
    // Top ellipse outline
    ctx.beginPath();
    ctx.ellipse(x, tableY, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Bottom edge outline (front half only)
    ctx.beginPath();
    ctx.ellipse(x, tableY + edgeH, rx, ry, 0, 0, Math.PI);
    ctx.stroke();
    // Vertical edge lines on sides
    ctx.beginPath();
    ctx.moveTo(x - rx, tableY);
    ctx.lineTo(x - rx, tableY + edgeH);
    ctx.moveTo(x + rx, tableY);
    ctx.lineTo(x + rx, tableY + edgeH);
    ctx.stroke();

    // Front legs — drawn AFTER surface
    // Ellipse bottom is at tableY + ry = y+20, edge bottom at y+24
    // Legs start just below the front edge of the ellipse and go down
    const legStartY = tableY + ry - 2; // y+18, slightly overlapping with bottom of ellipse
    const frontLegH = 16;

    // Front-left leg
    ctx.fillStyle = legColor;
    ctx.fillRect(x - 10, legStartY, legW, frontLegH);
    ctx.fillStyle = legHighlight;
    ctx.fillRect(x - 10 + legW, legStartY, 1, frontLegH);

    // Front-right leg
    ctx.fillStyle = legColor;
    ctx.fillRect(x + 7, legStartY, legW, frontLegH);
    ctx.fillStyle = legHighlight;
    ctx.fillRect(x + 7 + legW, legStartY, 1, frontLegH);

    // Back-left leg (peeks out on left side)
    ctx.fillStyle = legColor;
    ctx.fillRect(x - rx + 2, tableY - 2, legW, 14);
    ctx.fillStyle = legHighlight;
    ctx.fillRect(x - rx + 2 + legW, tableY - 2, 1, 14);

    // Back-right leg (peeks out on right side)
    ctx.fillStyle = legColor;
    ctx.fillRect(x + rx - 5, tableY - 2, legW, 14);
    ctx.fillStyle = legHighlight;
    ctx.fillRect(x + rx - 5 + legW, tableY - 2, 1, 14);

    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(x - 12, legStartY + frontLegH, 24, 2);

    // Papers on table
    drawIsoDiamond(ctx, x - 6, y + 2, 10, 5, P.PAPER_WHITE, 'rgba(140,130,110,0.3)');
    drawIsoDiamond(ctx, x + 5, y + 5, 8, 4, '#F0E8D8', 'rgba(140,130,110,0.2)');

    // Pen
    ctx.strokeStyle = '#2040A0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 2);
    ctx.lineTo(x + 14, y);
    ctx.stroke();
}

// Draw toilet stall
function drawToiletStall(ctx, x, y) {
    const h = WALL_HEIGHT;
    // Back wall
    ctx.fillStyle = '#D0CCC4';
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x, y + HH - h);
    ctx.closePath();
    ctx.fill();
    // Side wall
    ctx.fillStyle = '#B8B4AC';
    ctx.beginPath();
    ctx.moveTo(x, y + HH);
    ctx.lineTo(x, y + HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x + HW, y);
    ctx.closePath();
    ctx.fill();
    // Wall outline
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x + HW, y);
    ctx.stroke();

    // Toilet bowl
    const bowlX = x - 2;
    const bowlY = y - 4;
    ctx.fillStyle = '#F0EDE6';
    ctx.fillRect(bowlX - 10, bowlY - 4, 20, 8);
    ctx.fillRect(bowlX - 8, bowlY - 6, 16, 2);
    ctx.fillRect(bowlX - 8, bowlY + 4, 16, 2);
    ctx.strokeStyle = '#A0988C';
    ctx.lineWidth = 1;
    ctx.strokeRect(bowlX - 10, bowlY - 6, 20, 12);
    // Inner bowl (water)
    ctx.fillStyle = '#C8E0F0';
    ctx.fillRect(bowlX - 7, bowlY - 3, 14, 6);
    ctx.fillRect(bowlX - 5, bowlY - 4, 10, 1);
    ctx.fillRect(bowlX - 5, bowlY + 3, 10, 1);
    // Toilet tank
    ctx.fillStyle = '#E8E4DC';
    ctx.fillRect(bowlX - 7, bowlY - 12, 14, 7);
    ctx.strokeStyle = '#A0988C';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(bowlX - 7, bowlY - 12, 14, 7);
    // Flush handle
    ctx.fillStyle = '#B0B0B0';
    ctx.fillRect(bowlX + 4, bowlY - 15, 2, 4);
    // Toilet paper roll
    ctx.fillStyle = '#F8F4EC';
    ctx.fillRect(x + 14 - 4, y - 18 - 4, 8, 8);
    ctx.fillRect(x + 14 - 3, y - 18 - 5, 6, 1);
    ctx.fillRect(x + 14 - 3, y - 18 + 4, 6, 1);
    ctx.strokeStyle = '#B0A898';
    ctx.lineWidth = 0.6;
    ctx.strokeRect(x + 14 - 4, y - 18 - 5, 8, 10);
    // Roll holder
    ctx.strokeStyle = '#909090';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + 16, y - 24);
    ctx.lineTo(x + 16, y - 14);
    ctx.stroke();
}

// Draw front desk (reception) — solid counter with isometric base
function drawFrontDesk(ctx, x, y) {
    // The front desk is a solid counter (no visible legs — it's a full panel)
    drawBox(ctx, x, y + 2, HW * 1.4, HH * 1.2, 18, P.DESK_TOP, '#7B6B58', P.DESK_SIDE, P.WALL_OUTLINE);
    // Name plate on front face
    ctx.fillStyle = '#D8CCB0';
    const pw = 16, ph = 6;
    ctx.fillRect(x - pw / 2, y - 12, pw, ph);
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - pw / 2, y - 12, pw, ph);
    ctx.fillStyle = P.WALL_OUTLINE;
    ctx.font = '3px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('INFO', x, y - 8);
}

// Draw bookshelf — rich warm wood
function drawBookshelf(ctx, x, y) {
    drawBox(ctx, x, y, HW * 0.8, HH * 0.6, 38, P.BOOKSHELF, '#5B3C14', '#7B5828', P.WALL_OUTLINE);
    // Shelf dividers
    ctx.strokeStyle = 'rgba(60,40,20,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 20);
    ctx.lineTo(x + 10, y - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 10);
    ctx.lineTo(x + 10, y - 10);
    ctx.stroke();
    // Books (colored spines with varied heights — more vibrant)
    const bookColors = P.BOOK_COLORS;
    const heights = [10, 11, 9, 11, 8, 10];
    for (let i = 0; i < 6; i++) {
        ctx.fillStyle = bookColors[i % bookColors.length];
        const bh = heights[i];
        ctx.fillRect(x - 10 + i * 3.5, y - 20 - bh, 3, bh);
        ctx.fillRect(x - 10 + i * 3.5, y - 10 - bh, 3, bh);
        // Subtle spine highlight
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(x - 10 + i * 3.5, y - 20 - bh, 1, bh);
        ctx.fillRect(x - 10 + i * 3.5, y - 10 - bh, 1, bh);
    }
}

// Draw counter — warm wood top
function drawCounter(ctx, x, y) {
    drawBox(ctx, x, y + 4, HW * 1.2, HH * 1.0, 18, P.COUNTER_TOP, '#A08868', P.DESK_SIDE, P.WALL_OUTLINE);
    // Subtle counter top sheen
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(x - 10, y - 10, 20, 2);
}

// Draw fridge — isometric box
function drawFridge(ctx, x, y) {
    drawBox(ctx, x, y + 2, 20, 14, 34, P.FRIDGE, '#C0C0BC', '#D0D0CC', P.WALL_OUTLINE);
    // Handle — small vertical bar on right face
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 6, y - 20);
    ctx.lineTo(x + 6, y - 12);
    ctx.stroke();
    // Fridge magnets / notes on front
    ctx.fillStyle = '#C04040';
    ctx.fillRect(x - 3, y - 22, 3, 3);
    ctx.fillStyle = '#FFE060';
    ctx.fillRect(x + 1, y - 18, 4, 3);
    ctx.fillStyle = '#4080C0';
    ctx.fillRect(x - 6, y - 16, 3, 3);
    // Divider line between freezer and fridge
    ctx.strokeStyle = '#A0A0A0';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 12);
    ctx.lineTo(x + 8, y - 12);
    ctx.stroke();
}

// Draw whiteboard with Danish bureaucratic text
function drawWhiteboard(ctx, x, y) {
    const h = WALL_HEIGHT;
    const bw = 24;
    const bh = Math.min(18, h - 4);
    const bx = x - bw / 2;
    const by = y - h + 2;
    // Board shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(bx + 2, by + 2, bw, bh);
    // Board
    ctx.fillStyle = P.WHITEBOARD;
    ctx.fillRect(bx, by, bw, bh);
    ctx.strokeStyle = P.WHITEBOARD_FRAME;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, by, bw, bh);
    // Simple colored lines to suggest text
    ctx.fillStyle = '#2848A0';
    ctx.fillRect(bx + 3, by + 4, 12, 1);
    ctx.fillRect(bx + 3, by + 7, 16, 1);
    ctx.fillStyle = '#C03030';
    ctx.fillRect(bx + 3, by + 10, 10, 1);
    ctx.fillStyle = '#2848A0';
    ctx.fillRect(bx + 3, by + 13, 14, 1);
    // Marker tray
    ctx.fillStyle = '#A0A0A0';
    ctx.fillRect(bx + 4, by + bh, 16, 1.5);
}

// Helper: draw shared desk base (legs + surface) used by all desk variants
function drawDeskBase(ctx, x, y) {
    // drawBox at (x, y+4), halfW=HW*1.4≈44.8, halfH=HH*1.3≈20.8, h=3
    // Front-bottom point: y+25. Side bottoms: y+14.

    // Desk surface FIRST
    drawBox(ctx, x, y + 4, HW * 1.4, HH * 1.3, 3, P.DESK_TOP, P.DESK_FRONT, P.DESK_SIDE, P.WALL_OUTLINE);

    // 4 legs drawn AFTER surface — visible below the front face
    // The front face bottom is at y+25, so legs start from y+25 downward
    const legColor = '#1A1A1A';
    const legHighlight = '#2E2E2E';

    // Front-left leg — under the left portion of front face
    ctx.fillStyle = legColor;
    ctx.fillRect(x - 10, y + 22, 3, 12);
    ctx.fillStyle = legHighlight;
    ctx.fillRect(x - 7, y + 22, 1, 12);

    // Front-right leg — under the right portion of front face
    ctx.fillStyle = legColor;
    ctx.fillRect(x + 7, y + 22, 3, 12);
    ctx.fillStyle = legHighlight;
    ctx.fillRect(x + 10, y + 22, 1, 12);

    // Back-left leg — peeks out on left side of desk
    ctx.fillStyle = legColor;
    ctx.fillRect(x - 22, y + 10, 3, 12);
    ctx.fillStyle = legHighlight;
    ctx.fillRect(x - 19, y + 10, 1, 12);

    // Back-right leg — peeks out on right side of desk
    ctx.fillStyle = legColor;
    ctx.fillRect(x + 19, y + 10, 3, 12);
    ctx.fillStyle = legHighlight;
    ctx.fillRect(x + 22, y + 10, 1, 12);

    // Ground shadow strip under desk
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(x - 14, y + 33, 28, 2);
}

// Draw messy desk — papers scattered, coffee cup, tilted monitor
function drawDeskMessy(ctx, x, y) {
    drawDeskBase(ctx, x, y);

    // Scattered papers (iso diamonds)
    drawIsoDiamond(ctx, x + 10, y + 2, 10, 5, P.PAPER_WHITE, 'rgba(140,130,110,0.3)');
    drawIsoDiamond(ctx, x + 6, y + 5, 8, 4, P.PAPER_WHITE, 'rgba(140,130,110,0.2)');

    // Monitor (slightly offset)
    drawIsoMonitor(ctx, x - 4, y - 1, 22, 14);

    // Coffee mug — small isometric cylinder
    drawBox(ctx, x + 14, y + 3, 6, 4, 5, '#F0E8D8', '#D8D0C0', '#E8E0D0', P.WALL_OUTLINE);
    // Coffee inside
    ctx.fillStyle = '#604020';
    ctx.fillRect(x + 14 - 2, y - 1 - 1, 5, 2);
    ctx.fillRect(x + 14 - 1, y - 1 - 2, 3, 1);

    // Post-it note (iso diamond)
    drawIsoDiamond(ctx, x - 12, y + 3, 8, 4, '#FFE060', 'rgba(0,0,0,0.1)');
}

// Draw tidy desk
function drawDeskTidy(ctx, x, y) {
    drawDeskBase(ctx, x, y);

    // Monitor — centered
    drawIsoMonitor(ctx, x - 2, y - 1, 24, 16);

    // Keyboard
    drawIsoDiamond(ctx, x + 2, y + 5, 16, 6, '#D4D4D0', '#A0A0A0');

    // Small succulent plant — isometric pot
    drawBox(ctx, x + 15, y + 2, 6, 4, 4, '#885830', '#704820', '#7A5028', P.WALL_OUTLINE);
    ctx.fillStyle = '#48903C';
    ctx.fillRect(x + 15 - 3, y - 3 - 3, 6, 6);
    ctx.fillRect(x + 15 - 2, y - 3 - 4, 4, 1);
    ctx.fillStyle = '#58A848';
    ctx.fillRect(x + 14 - 2, y - 5 - 2, 4, 4);

    // Pencil holder — small isometric box
    drawBox(ctx, x - 14, y + 2, 5, 4, 5, P.CHAIR_SEAT, P.CHAIR_BACK, P.CHAIR_BACK, P.WALL_OUTLINE);

    // Mouse
    drawIsoDiamond(ctx, x + 13, y + 5, 5, 3, '#C8C8C4', '#909090');
}

// Draw empty desk — WFH colleague
function drawDeskEmpty(ctx, x, y) {
    drawDeskBase(ctx, x, y);

    // Closed laptop — flat iso diamond
    drawIsoDiamond(ctx, x, y + 2, 18, 8, '#B0B0AC', '#808080');
    // Apple/logo dot
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(Math.round(x) - 1, Math.round(y + 2) - 1, 2, 2);
}

// Draw cluttered desk — overloaded government worker
function drawDeskCluttered(ctx, x, y) {
    drawDeskBase(ctx, x, y);

    // Monitor (slightly offset)
    drawIsoMonitor(ctx, x - 6, y - 1, 22, 14);

    // Stack of reports (3 layers offset)
    drawIsoDiamond(ctx, x + 8, y + 2, 12, 6, P.PAPER_WHITE, 'rgba(140,130,110,0.3)');
    drawIsoDiamond(ctx, x + 9, y + 1, 11, 5, '#F0ECE0', 'rgba(140,130,110,0.2)');
    drawIsoDiamond(ctx, x + 7, y, 12, 6, '#E8E4D8', 'rgba(140,130,110,0.25)');

    // Government folder (dark blue with gold label)
    drawIsoDiamond(ctx, x - 14, y + 3, 14, 7, '#2C4068', 'rgba(0,0,0,0.2)');
    ctx.fillStyle = '#C8A850';
    ctx.fillRect(x - 16, y + 2, 5, 2);

    // Water bottle (small cyan box)
    drawBox(ctx, x + 16, y + 2, 4, 3, 7, 'rgba(120,190,230,0.7)', 'rgba(80,150,200,0.6)', 'rgba(100,170,215,0.65)', 'rgba(60,120,170,0.5)');

    // Stress ball (small bright square)
    ctx.fillStyle = '#E06040';
    ctx.fillRect(Math.round(x + 14) - 2, Math.round(y + 7) - 2, 4, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(Math.round(x + 13.5) - 1, Math.round(y + 6.5) - 1, 2, 2);
}

// Draw tech desk — dual monitors, headphones, laptop
function drawDeskTech(ctx, x, y) {
    drawDeskBase(ctx, x, y);

    // Dual monitors (smaller, side by side)
    drawIsoMonitor(ctx, x - 8, y - 1, 18, 12);
    drawIsoMonitor(ctx, x + 6, y - 1, 18, 12);

    // Laptop (open, angled) below monitors
    drawIsoDiamond(ctx, x - 2, y + 5, 14, 6, '#B0B0AC', '#808080');
    // Sticker on laptop
    ctx.fillStyle = '#E06840';
    ctx.fillRect(Math.round(x - 2) - 1, Math.round(y + 5) - 1, 2, 2);

    // Headphones draped on right monitor — pixel art band
    ctx.fillStyle = '#303030';
    ctx.fillRect(x + 1, y - 20, 10, 2);
    ctx.fillRect(x, y - 18, 2, 4);
    ctx.fillRect(x + 10, y - 18, 2, 4);
    // Ear cups
    ctx.fillStyle = '#252525';
    ctx.fillRect(x + 1 - 3, y - 10 - 2, 6, 4);
    ctx.fillRect(x + 11 - 3, y - 10 - 2, 6, 4);
}

// Draw dying plant — wilted yellow/brown leaves
function drawDyingPlant(ctx, x, y) {
    // Pot (same shape as healthy plant)
    drawBox(ctx, x, y + 8, 14, 10, 12, P.PLANT_POT, '#704820', '#603818', P.WALL_OUTLINE);
    // Dry soil — flat iso oval via stacked rects
    ctx.fillStyle = '#685838';
    ctx.fillRect(x - 6, y - 3, 12, 2);
    ctx.fillRect(x - 4, y - 4, 8, 1);
    ctx.fillRect(x - 4, y - 1, 8, 1);
    // Wilted leaves (yellow-brown, droopy) — pixel blocks
    ctx.fillStyle = '#A09040';
    ctx.fillRect(x - 8, y - 9, 8, 6);
    ctx.fillRect(x - 7, y - 10, 6, 1);
    ctx.fillStyle = '#887830';
    ctx.fillRect(x, y - 7, 6, 4);
    ctx.fillRect(x + 1, y - 8, 4, 1);
    ctx.fillStyle = '#908838';
    ctx.fillRect(x - 5, y - 13, 8, 8);
    ctx.fillRect(x - 4, y - 14, 6, 1);
    // Drooping leaf
    ctx.strokeStyle = '#907838';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 1, y - 5);
    ctx.lineTo(x + 9, y + 3);
    ctx.stroke();
    // Outline
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x - 5, y - 14, 8, 10);
}

// Draw recycling bin
function drawRecyclingBin(ctx, x, y) {
    drawBox(ctx, x, y + 6, 14, 10, 16, '#58883C', '#38682C', '#488838', P.WALL_OUTLINE);
    // Recycle symbol
    // Recycle symbol — pixel art square loop
    ctx.strokeStyle = '#B0E098';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 4);
    ctx.lineTo(x + 4, y - 8);
    ctx.lineTo(x - 4, y - 8);
    ctx.lineTo(x - 4, y);
    ctx.stroke();
    // Arrow tip
    ctx.fillStyle = '#B0E098';
    ctx.beginPath();
    ctx.moveTo(x + 4, y - 4);
    ctx.lineTo(x + 2, y - 6);
    ctx.lineTo(x + 2, y - 2);
    ctx.closePath();
    ctx.fill();
}

// Draw coat rack — isometric base + vertical pole
function drawCoatRack(ctx, x, y) {
    // Base — isometric diamond
    drawIsoDiamond(ctx, x, y + 10, 14, 8, '#484848', P.WALL_OUTLINE);

    // Pole — isometric pillar
    drawIsoPillar(ctx, x, y - 18, 3, 2, 30, '#606060', '#484848', P.WALL_OUTLINE);

    // Hooks — lines extending from top
    ctx.strokeStyle = '#686868';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x, y - 26);
    ctx.lineTo(x - 7, y - 22);
    ctx.moveTo(x, y - 26);
    ctx.lineTo(x + 7, y - 22);
    ctx.stroke();

    // Jacket hanging
    ctx.fillStyle = '#2C4868';
    ctx.beginPath();
    ctx.moveTo(x - 7, y - 22);
    ctx.lineTo(x - 10, y - 12);
    ctx.lineTo(x - 3, y - 12);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 0.8;
    ctx.stroke();
}

// Draw sink (restroom) — isometric body
function drawSink(ctx, x, y) {
    drawBox(ctx, x, y + 6, 18, 12, 16, '#E4E4E0', '#C4C4C0', '#D4D4D0', P.WALL_OUTLINE);
    // Basin — iso diamond depression
    drawIsoDiamond(ctx, x, y - 4, 12, 7, '#F4F4F0', '#A8A8A4');
    // Water
    drawIsoDiamond(ctx, x, y - 4, 8, 5, 'rgba(120, 170, 220, 0.35)', null);
    // Faucet — small isometric pillar
    drawIsoPillar(ctx, x, y - 8, 3, 2, 6, '#909090', '#707070', '#606060');
    // Faucet top — pixel art block
    ctx.fillStyle = '#888888';
    ctx.fillRect(Math.round(x) - 3, Math.round(y - 12) - 2, 6, 2);
    // Mirror above
    ctx.fillStyle = 'rgba(180, 210, 240, 0.5)';
    ctx.fillRect(x - 6, y - 24, 12, 10);
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(x - 6, y - 24, 12, 10);
    // Mirror reflection
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x - 4, y - 22);
    ctx.lineTo(x - 1, y - 16);
    ctx.stroke();
}

// Draw minister desk (more formal, larger)
function drawMinisterDesk(ctx, x, y) {
    // Thick wooden legs — isometric, extended to floor
    const woodColor = '#5A3A1C';
    const woodDark = '#3A2008';
    drawIsoPillar(ctx, x - 14, y + 2, 4, 3, 18, woodColor, woodDark, P.WALL_OUTLINE);
    drawIsoPillar(ctx, x + 14, y + 2, 4, 3, 18, woodColor, woodDark, P.WALL_OUTLINE);
    drawIsoPillar(ctx, x - 12, y + 11, 4, 3, 18, woodColor, woodDark, P.WALL_OUTLINE);
    drawIsoPillar(ctx, x + 12, y + 11, 4, 3, 18, woodColor, woodDark, P.WALL_OUTLINE);
    // Grounding shadows
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(x - 16, y + 20, 5, 1);
    ctx.fillRect(x + 13, y + 20, 5, 1);
    ctx.fillRect(x - 14, y + 29, 5, 1);
    ctx.fillRect(x + 11, y + 29, 5, 1);

    // Desk surface — dark wood
    drawBox(ctx, x, y + 4, HW * 1.6, HH * 1.4, 4, '#6B4B28', '#4B2B10', '#5B3B18', P.WALL_OUTLINE);

    // Green desk lamp — isometric base + arm
    drawBox(ctx, x - 14, y + 2, 6, 4, 2, '#202020', '#181818', '#282828', P.WALL_OUTLINE);
    ctx.strokeStyle = '#383838';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 14, y + 1);
    ctx.lineTo(x - 11, y - 7);
    ctx.stroke();
    ctx.fillStyle = '#1C5028';
    ctx.fillRect(x - 10 - 5, y - 8 - 2, 10, 4);
    ctx.fillRect(x - 10 - 4, y - 8 - 3, 8, 1);
    ctx.strokeStyle = '#103818';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(x - 10 - 5, y - 8 - 3, 10, 5);
    // Lamp glow
    ctx.fillStyle = 'rgba(240,232,160,0.1)';
    ctx.fillRect(x - 10 - 7, y - 3, 14, 6);
    ctx.fillRect(x - 10 - 5, y - 4, 10, 1);
    ctx.fillRect(x - 10 - 5, y + 3, 10, 1);

    // Papers stacked neatly (iso)
    drawIsoDiamond(ctx, x, y + 1, 14, 6, P.PAPER_WHITE, 'rgba(140,130,110,0.3)');
    drawIsoDiamond(ctx, x - 1, y + 0.5, 13, 5, '#F0ECE0', 'rgba(140,130,110,0.2)');

    // Pen holder — small isometric box
    drawBox(ctx, x + 12, y + 1, 5, 4, 5, '#1C1C1C', '#101010', '#282828', P.WALL_OUTLINE);
    // Pens sticking up
    ctx.strokeStyle = '#2040A0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 11, y - 3);
    ctx.lineTo(x + 10, y - 7);
    ctx.stroke();
    ctx.strokeStyle = '#C03030';
    ctx.beginPath();
    ctx.moveTo(x + 13, y - 3);
    ctx.lineTo(x + 14, y - 8);
    ctx.stroke();

    // Small Danish flag
    ctx.fillStyle = '#808070';
    ctx.fillRect(x + 18, y + 1, 1.5, 12);
    ctx.fillStyle = P.FLAG_RED;
    ctx.fillRect(x + 19, y - 8, 7, 6);
    ctx.fillStyle = P.FLAG_WHITE;
    ctx.fillRect(x + 21, y - 8, 1.5, 6);
    ctx.fillRect(x + 19, y - 5.5, 7, 1.2);
}

// Toilet sign — wall south with WC sign
function drawToiletSign(ctx, x, y) {
    drawWallSouth(ctx, x, y);
    // Large WC sign plate
    const signX = x - 1;
    const signY = y - WALL_HEIGHT * 0.7;
    const sw = 30;
    const sh = 22;
    // Sign shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(signX - sw / 2 + 2, signY - sh / 2 + 2, sw, sh);
    // Blue sign background
    ctx.fillStyle = '#2050A0';
    ctx.fillRect(signX - sw / 2, signY - sh / 2, sw, sh);
    // White border
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(signX - sw / 2 + 1, signY - sh / 2 + 1, sw - 2, 1);
    ctx.fillRect(signX - sw / 2 + 1, signY + sh / 2 - 2, sw - 2, 1);
    ctx.fillRect(signX - sw / 2 + 1, signY - sh / 2 + 1, 1, sh - 2);
    ctx.fillRect(signX + sw / 2 - 2, signY - sh / 2 + 1, 1, sh - 2);
    // WC text (large, white, bold)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WC', signX, signY + 1);
}

// Main tile draw dispatcher
export function drawTile(ctx, tileType, x, y, col, row) {
    const isAlt = (col + row) % 2 === 0;
    // Warm outline color for floor tiles
    const floorOutline = 'rgba(140,120,80,0.25)';

    switch (tileType) {
        case TILE.FLOOR:
        case TILE.DOOR:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_LIGHT : P.FLOOR_DARK, floorOutline);
            drawCarpetTexture(ctx, x, y);
            if (tileType === TILE.DOOR) {
                drawDiamond(ctx, x, y, P.FLOOR_CORRIDOR, floorOutline);
                drawWoodTexture(ctx, x, y);
            }
            break;
        case TILE.WALL_SOUTH:
        case TILE.WALL_EAST:
        case TILE.WALL_CORNER:
        case TILE.GLASS_WALL_S:
        case TILE.GLASS_WALL_E:
        case TILE.DESK:
        case TILE.DESK_MESSY:
        case TILE.DESK_TIDY:
        case TILE.DESK_EMPTY:
        case TILE.DESK_CLUTTERED:
        case TILE.DESK_TECH:
        case TILE.CHAIR:
        case TILE.RECYCLING_BIN:
        case TILE.COAT_RACK:
        case TILE.DYING_PLANT:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_LIGHT : P.FLOOR_DARK, floorOutline);
            drawCarpetTexture(ctx, x, y);
            break;
        case TILE.COFFEE_MACHINE:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_KITCHEN : '#D8CCB0', 'rgba(180,160,120,0.3)');
            drawTileGrout(ctx, x, y);
            break;
        case TILE.PRINTER:
        case TILE.PLANT:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_LIGHT : P.FLOOR_DARK, floorOutline);
            drawCarpetTexture(ctx, x, y);
            break;
        case TILE.MEETING_TABLE:
        case TILE.ROUND_TABLE:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_MEETING : '#BEB498', 'rgba(140,130,100,0.3)');
            drawMeetingCarpet(ctx, x, y);
            break;
        case TILE.TOILET_STALL:
            drawDiamond(ctx, x, y, isAlt ? '#E0DCD4' : P.FLOOR_RESTROOM, 'rgba(160,160,155,0.3)');
            drawTileGrout(ctx, x, y);
            break;
        case TILE.FRONT_DESK:
            drawDiamond(ctx, x, y, P.FLOOR_MINISTER, 'rgba(148,120,70,0.3)');
            drawCarpetBorder(ctx, x, y);
            break;
        case TILE.BOOKSHELF:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_LIGHT : P.FLOOR_DARK, floorOutline);
            drawCarpetTexture(ctx, x, y);
            break;
        case TILE.COUNTER:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_KITCHEN : '#D8CCB0', 'rgba(180,160,120,0.3)');
            drawTileGrout(ctx, x, y);
            break;
        case TILE.FRIDGE:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_KITCHEN : '#D8CCB0', 'rgba(180,160,120,0.3)');
            drawTileGrout(ctx, x, y);
            break;
        case TILE.WHITEBOARD:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_MEETING : '#BEB498', 'rgba(140,130,100,0.3)');
            drawMeetingCarpet(ctx, x, y);
            break;
        case TILE.SINK:
            drawDiamond(ctx, x, y, isAlt ? '#E0DCD4' : P.FLOOR_RESTROOM, 'rgba(160,160,155,0.3)');
            drawTileGrout(ctx, x, y);
            break;
        case TILE.MINISTER_DESK:
            drawDiamond(ctx, x, y, P.FLOOR_MINISTER, 'rgba(148,120,70,0.3)');
            drawCarpetBorder(ctx, x, y);
            break;
        case TILE.TOILET_SIGN:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_LIGHT : P.FLOOR_DARK, floorOutline);
            drawCarpetTexture(ctx, x, y);
            break;
        case TILE.VOID:
        default:
            break;
    }
}

// Draw elevated objects (walls, furniture) — called in z-sorted order
export function drawElevated(ctx, tileType, x, y) {
    // Draw shadow under furniture
    if (tileType !== TILE.WALL_SOUTH && tileType !== TILE.WALL_EAST &&
        tileType !== TILE.WALL_CORNER && tileType !== TILE.GLASS_WALL_S &&
        tileType !== TILE.GLASS_WALL_E && tileType !== TILE.TOILET_SIGN &&
        tileType !== TILE.WHITEBOARD) {
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(x - 14, y + 8 - 4, 28, 8);
        ctx.fillRect(x - 12, y + 8 - 6, 24, 2);
        ctx.fillRect(x - 12, y + 8 + 4, 24, 2);
    }

    switch (tileType) {
        case TILE.WALL_SOUTH:
            drawWallSouth(ctx, x, y);
            break;
        case TILE.WALL_EAST:
            drawWallEast(ctx, x, y);
            break;
        case TILE.WALL_CORNER:
            drawWallCorner(ctx, x, y);
            break;
        case TILE.GLASS_WALL_S:
            drawGlassWallSouth(ctx, x, y);
            break;
        case TILE.GLASS_WALL_E:
            drawGlassWallEast(ctx, x, y);
            break;
        case TILE.DESK:
            drawDesk(ctx, x, y);
            break;
        case TILE.CHAIR:
            drawChair(ctx, x, y);
            break;
        case TILE.COFFEE_MACHINE:
            drawCoffeeMachine(ctx, x, y);
            break;
        case TILE.PRINTER:
            drawPrinter(ctx, x, y);
            break;
        case TILE.PLANT:
            drawPlant(ctx, x, y);
            break;
        case TILE.MEETING_TABLE:
            drawMeetingTable(ctx, x, y);
            break;
        case TILE.TOILET_STALL:
            drawToiletStall(ctx, x, y);
            break;
        case TILE.FRONT_DESK:
            drawFrontDesk(ctx, x, y);
            break;
        case TILE.BOOKSHELF:
            drawBookshelf(ctx, x, y);
            break;
        case TILE.COUNTER:
            drawCounter(ctx, x, y);
            break;
        case TILE.FRIDGE:
            drawFridge(ctx, x, y);
            break;
        case TILE.WHITEBOARD:
            drawWhiteboard(ctx, x, y);
            break;
        case TILE.DESK_MESSY:
            drawDeskMessy(ctx, x, y);
            break;
        case TILE.DESK_TIDY:
            drawDeskTidy(ctx, x, y);
            break;
        case TILE.DESK_EMPTY:
            drawDeskEmpty(ctx, x, y);
            break;
        case TILE.RECYCLING_BIN:
            drawRecyclingBin(ctx, x, y);
            break;
        case TILE.COAT_RACK:
            drawCoatRack(ctx, x, y);
            break;
        case TILE.SINK:
            drawSink(ctx, x, y);
            break;
        case TILE.MINISTER_DESK:
            drawMinisterDesk(ctx, x, y);
            break;
        case TILE.TOILET_SIGN:
            drawToiletSign(ctx, x, y);
            break;
        case TILE.DESK_CLUTTERED:
            drawDeskCluttered(ctx, x, y);
            break;
        case TILE.DESK_TECH:
            drawDeskTech(ctx, x, y);
            break;
        case TILE.DYING_PLANT:
            drawDyingPlant(ctx, x, y);
            break;
        case TILE.ROUND_TABLE:
            drawRoundMeetingTable(ctx, x, y);
            break;
    }
}

// Check if a tile type has elevated geometry that needs z-sorting
export function hasElevated(tileType) {
    return tileType !== TILE.VOID && tileType !== TILE.FLOOR && tileType !== TILE.DOOR;
}

// Ambient occlusion — soft shadows on floor tiles near walls
const WALL_TILES = new Set([TILE.WALL_SOUTH, TILE.WALL_EAST, TILE.WALL_CORNER]);

export function drawAmbientShadow(ctx, x, y, col, row, tilemap) {
    const north = tilemap.getTile(col, row - 1);
    const west = tilemap.getTile(col - 1, row);

    ctx.fillStyle = 'rgba(0,0,0,0.06)';

    if (WALL_TILES.has(north)) {
        ctx.beginPath();
        ctx.moveTo(x, y - HH);
        ctx.lineTo(x + HW, y);
        ctx.lineTo(x + HW * 0.7, y);
        ctx.lineTo(x, y - HH + 5);
        ctx.lineTo(x - HW * 0.7, y);
        ctx.lineTo(x - HW, y);
        ctx.closePath();
        ctx.fill();
    }

    if (WALL_TILES.has(west) || west === TILE.GLASS_WALL_E) {
        ctx.beginPath();
        ctx.moveTo(x - HW, y);
        ctx.lineTo(x, y - HH);
        ctx.lineTo(x - HW + 8, y);
        ctx.lineTo(x, y + HH);
        ctx.closePath();
        ctx.fill();
    }
}
