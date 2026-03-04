import { TILE, TILE_WIDTH, TILE_HEIGHT, WALL_HEIGHT } from '../constants.js';
import { PALETTE as P } from './palette.js';

const HW = TILE_WIDTH / 2;  // 32
const HH = TILE_HEIGHT / 2; // 16

// ── Floor detail patterns ──────────────────────────────────

// Subtle carpet dot pattern for office areas
function drawCarpetTexture(ctx, x, y) {
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    for (let i = -12; i <= 12; i += 6) {
        for (let j = -4; j <= 4; j += 4) {
            ctx.fillRect(x + i, y + j, 1, 1);
        }
    }
}

// Kitchen/restroom tile grout — 2×2 sub-tile lines
function drawTileGrout(ctx, x, y) {
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5;
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(x - HW * 0.6, y);
    ctx.lineTo(x + HW * 0.6, y);
    ctx.stroke();
    // Vertical center line (isometric)
    ctx.beginPath();
    ctx.moveTo(x, y - HH * 0.5);
    ctx.lineTo(x, y + HH * 0.5);
    ctx.stroke();
}

// Minister carpet border — darker edge inlay
function drawCarpetBorder(ctx, x, y) {
    ctx.strokeStyle = 'rgba(120,96,60,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - HH + 4);
    ctx.lineTo(x + HW - 6, y);
    ctx.lineTo(x, y + HH - 4);
    ctx.lineTo(x - HW + 6, y);
    ctx.closePath();
    ctx.stroke();
}

// Meeting room subtle carpet cross-hatch
function drawMeetingCarpet(ctx, x, y) {
    ctx.strokeStyle = 'rgba(0,0,0,0.025)';
    ctx.lineWidth = 0.5;
    for (let i = -10; i <= 10; i += 8) {
        ctx.beginPath();
        ctx.moveTo(x + i - 3, y - 3);
        ctx.lineTo(x + i + 3, y + 3);
        ctx.stroke();
    }
}

// Draw an isometric diamond (floor tile)
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
        ctx.lineWidth = 1;
        ctx.stroke();
    }
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
        // Outline the whole box
        ctx.beginPath();
        // Top
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
    const bandH = 6; // Decorative stripe height

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
    ctx.fillStyle = 'rgba(92,85,76,0.4)';
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x, y + HH);
    ctx.lineTo(x, y + HH - 3);
    ctx.lineTo(x - HW, y - 3);
    ctx.closePath();
    ctx.fill();
    // Right side baseboard
    ctx.beginPath();
    ctx.moveTo(x, y + HH);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x + HW, y - 3);
    ctx.lineTo(x, y + HH - 3);
    ctx.closePath();
    ctx.fill();

    // Outline
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1.5;
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
    ctx.fillStyle = 'rgba(92,85,76,0.4)';
    // Right face baseboard
    ctx.beginPath();
    ctx.moveTo(x, y + HH);
    ctx.lineTo(x + HW, y);
    ctx.lineTo(x + HW, y - 3);
    ctx.lineTo(x, y + HH - 3);
    ctx.closePath();
    ctx.fill();
    // Left face baseboard
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x, y + HH);
    ctx.lineTo(x, y + HH - 3);
    ctx.lineTo(x - HW, y - 3);
    ctx.closePath();
    ctx.fill();

    // Outline
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1.5;
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
    // Frame
    ctx.strokeStyle = P.GLASS_FRAME;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x + HW, y);
    ctx.stroke();

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

    // Outline
    ctx.strokeStyle = P.GLASS_FRAME;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Reflection highlight (diagonal white streak)
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
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
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Reflection highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - HW * 0.2, y - h * 0.6);
    ctx.lineTo(x, y - h * 0.25);
    ctx.stroke();
}

// Draw height-adjustable desk workstation (hæve-sænkebord)
function drawDesk(ctx, x, y) {
    // Desk legs — two thin pillars
    ctx.fillStyle = '#808080';
    ctx.fillRect(x - 12, y - 2, 3, 14);
    ctx.fillRect(x + 9, y - 2, 3, 14);
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 12, y - 2, 3, 14);
    ctx.strokeRect(x + 9, y - 2, 3, 14);

    // Desk surface — wide, thin tabletop
    drawBox(ctx, x, y + 2, HW * 1.4, HH * 1.3, 4, P.DESK_TOP, P.DESK_FRONT, P.DESK_SIDE, P.WALL_OUTLINE);

    // Single large monitor — stand
    ctx.fillStyle = '#505050';
    ctx.fillRect(x - 1, y - 4, 3, 6);

    // Monitor — wider and more visible
    ctx.fillStyle = P.MONITOR_FRAME;
    // Back of monitor (3D effect)
    ctx.fillRect(x - 12, y - 18, 24, 2);
    // Screen frame
    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(x - 13, y - 18, 26, 15);
    // Screen glow
    ctx.fillStyle = P.MONITOR_SCREEN;
    ctx.fillRect(x - 11, y - 16, 22, 11);
    // Screen highlight
    ctx.fillStyle = P.MONITOR_GLOW;
    ctx.fillRect(x - 11, y - 16, 22, 3);
    // Screen outline
    ctx.strokeStyle = '#1C1C1C';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 13, y - 18, 26, 15);

    // Keyboard
    ctx.fillStyle = '#D0D0D0';
    ctx.fillRect(x - 8, y + 1, 16, 4);
    ctx.strokeStyle = '#A0A0A0';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - 8, y + 1, 16, 4);

    // Mouse (small oval to right of keyboard)
    ctx.fillStyle = '#C8C8C8';
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 3, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#A0A0A0';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Monitor cable (thin curve from stand to desk edge)
    ctx.strokeStyle = 'rgba(60,60,60,0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x + 1, y - 1);
    ctx.quadraticCurveTo(x + 8, y + 6, x + 16, y + 8);
    ctx.stroke();
}

// Draw ergonomic office chair
function drawChair(ctx, x, y) {
    // Chair base / wheels (star shape simplified)
    ctx.fillStyle = '#404040';
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 10);
    ctx.lineTo(x + 8, y + 10);
    ctx.lineTo(x + 6, y + 12);
    ctx.lineTo(x - 6, y + 12);
    ctx.closePath();
    ctx.fill();

    // Chair pillar
    ctx.fillStyle = '#505050';
    ctx.fillRect(x - 1, y + 2, 3, 8);

    // Seat cushion
    drawBox(ctx, x, y + 4, 18, 10, 4, P.CHAIR_SEAT, P.CHAIR_BACK, P.CHAIR_BACK, P.WALL_OUTLINE);

    // Backrest
    ctx.fillStyle = P.CHAIR_BACK;
    ctx.beginPath();
    ctx.moveTo(x - 7, y - 2);
    ctx.lineTo(x - 8, y - 12);
    ctx.quadraticCurveTo(x, y - 14, x + 8, y - 12);
    ctx.lineTo(x + 7, y - 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Armrests
    ctx.fillStyle = '#505050';
    ctx.fillRect(x - 10, y - 2, 3, 6);
    ctx.fillRect(x + 7, y - 2, 3, 6);
}

// Draw coffee machine
function drawCoffeeMachine(ctx, x, y) {
    drawBox(ctx, x, y + 4, 20, 14, 24, P.COFFEE_MACHINE, '#2C2C2C', '#4C4C4C', P.WALL_OUTLINE);
    // Red light
    ctx.fillStyle = '#C04040';
    ctx.fillRect(x - 2, y - 14, 4, 3);
    // Cup area
    ctx.fillStyle = P.COFFEE_ACCENT;
    ctx.fillRect(x - 4, y - 4, 8, 4);

    // Small cup in bay
    ctx.fillStyle = '#E8E0D0';
    ctx.fillRect(x - 2, y - 2, 4, 3);
    ctx.strokeStyle = 'rgba(92,85,76,0.4)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - 2, y - 2, 4, 3);

    // Drip tray
    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(x - 5, y + 2, 10, 2);

    // Steam wisps (subtle)
    ctx.strokeStyle = 'rgba(200,200,200,0.2)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x - 1, y - 4);
    ctx.quadraticCurveTo(x - 3, y - 8, x - 1, y - 11);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 1, y - 3);
    ctx.quadraticCurveTo(x + 3, y - 7, x + 1, y - 10);
    ctx.stroke();
}

// Draw printer
function drawPrinter(ctx, x, y) {
    drawBox(ctx, x, y + 4, 24, 16, 12, P.PRINTER_BODY, P.PRINTER_DARK, P.PRINTER_BODY, P.WALL_OUTLINE);
    // Paper input tray
    ctx.fillStyle = P.PAPER_WHITE;
    ctx.fillRect(x - 6, y - 6, 12, 3);

    // Paper output (protruding from front)
    ctx.fillStyle = P.PAPER_WHITE;
    ctx.fillRect(x - 4, y + 2, 8, 4);
    ctx.strokeStyle = 'rgba(160,152,136,0.3)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - 4, y + 2, 8, 4);

    // Green LED (ready indicator)
    ctx.fillStyle = '#40C060';
    ctx.beginPath();
    ctx.arc(x + 8, y - 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
}

// Draw plant
function drawPlant(ctx, x, y) {
    // Pot
    drawBox(ctx, x, y + 8, 12, 8, 10, P.PLANT_POT, '#7B5030', '#6B4020', P.WALL_OUTLINE);

    // Soil line visible at pot rim
    ctx.fillStyle = '#5A4020';
    ctx.beginPath();
    ctx.ellipse(x, y - 1, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Leaves (cluster of circles)
    ctx.fillStyle = P.PLANT_LEAVES;
    ctx.beginPath();
    ctx.arc(x, y - 8, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = P.PLANT_DARK;
    ctx.beginPath();
    ctx.arc(x - 4, y - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = P.PLANT_LEAVES;
    ctx.beginPath();
    ctx.arc(x + 3, y - 10, 6, 0, Math.PI * 2);
    ctx.fill();
    // Extra leaf highlight
    ctx.fillStyle = '#6A9050';
    ctx.beginPath();
    ctx.arc(x - 2, y - 12, 4, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y - 8, 8, 0, Math.PI * 2);
    ctx.stroke();
}

// Draw meeting table
function drawMeetingTable(ctx, x, y) {
    drawBox(ctx, x, y + 2, HW * 1.6, HH * 1.4, 12, '#9B8365', '#7B6345', '#8B7355', P.WALL_OUTLINE);
    // Papers on table
    ctx.fillStyle = P.PAPER_WHITE;
    ctx.save();
    ctx.translate(x - 4, y - 8);
    ctx.rotate(-0.2);
    ctx.fillRect(0, 0, 8, 6);
    ctx.restore();

    // Pen (thin line)
    ctx.strokeStyle = '#2040A0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 6, y - 6);
    ctx.lineTo(x + 12, y - 9);
    ctx.stroke();

    // Water glass (transparent circle)
    ctx.fillStyle = 'rgba(180,210,240,0.25)';
    ctx.beginPath();
    ctx.arc(x + 8, y - 4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(140,170,200,0.4)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
}

// Draw toilet stall
function drawToiletStall(ctx, x, y) {
    const h = 40;
    // Stall walls
    ctx.fillStyle = '#C8C4BC';
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x, y + HH - h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#B8B4AC';
    ctx.beginPath();
    ctx.moveTo(x, y + HH);
    ctx.lineTo(x, y + HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x + HW, y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - HW, y);
    ctx.lineTo(x - HW, y - h);
    ctx.lineTo(x, y - HH - h);
    ctx.lineTo(x + HW, y - h);
    ctx.lineTo(x + HW, y);
    ctx.stroke();
}

// Draw front desk (reception)
function drawFrontDesk(ctx, x, y) {
    drawBox(ctx, x, y + 2, HW * 1.4, HH * 1.2, 18, P.DESK_TOP, '#8B7B68', P.DESK_SIDE, P.WALL_OUTLINE);
    // Name plate
    ctx.fillStyle = '#D4C8B0';
    ctx.fillRect(x - 8, y - 12, 16, 6);
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 8, y - 12, 16, 6);
}

// Draw bookshelf
function drawBookshelf(ctx, x, y) {
    drawBox(ctx, x, y, HW * 0.8, HH * 0.6, 36, '#7B5B30', '#5B3B10', '#6B4B20', P.WALL_OUTLINE);
    // Books (colored spines with varied heights)
    const bookColors = P.BOOK_COLORS;
    const heights = [9, 10, 8, 10, 7];
    for (let i = 0; i < 5; i++) {
        ctx.fillStyle = bookColors[i % bookColors.length];
        const bh = heights[i];
        ctx.fillRect(x - 9 + i * 4, y - 20 - bh, 3, bh);
        ctx.fillRect(x - 9 + i * 4, y - 8 - bh, 3, bh);
    }
    // Shelf divider lines
    ctx.strokeStyle = 'rgba(92,85,76,0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 20);
    ctx.lineTo(x + 10, y - 20);
    ctx.stroke();
}

// Draw counter
function drawCounter(ctx, x, y) {
    drawBox(ctx, x, y + 4, HW * 1.2, HH * 1.0, 16, P.COUNTER_TOP, '#A09888', P.DESK_SIDE, P.WALL_OUTLINE);
}

// Draw fridge
function drawFridge(ctx, x, y) {
    drawBox(ctx, x, y + 2, 18, 12, 32, P.FRIDGE, '#C8C8C8', '#D0D0D0', P.WALL_OUTLINE);
    // Handle
    ctx.fillStyle = '#909090';
    ctx.fillRect(x + 4, y - 18, 2, 8);

    // Fridge magnets / notes (tiny colored squares)
    ctx.fillStyle = '#C04040';
    ctx.fillRect(x - 3, y - 20, 3, 3);
    ctx.fillStyle = '#FFE87C';
    ctx.fillRect(x + 1, y - 16, 3, 2);
    ctx.fillStyle = '#4080C0';
    ctx.fillRect(x - 5, y - 14, 2, 2);
}

// Draw whiteboard with Danish bureaucratic text
function drawWhiteboard(ctx, x, y) {
    const h = WALL_HEIGHT;
    // Board
    ctx.fillStyle = P.WHITEBOARD;
    ctx.fillRect(x - 16, y - h + 2, 32, 24);
    ctx.strokeStyle = P.WHITEBOARD_FRAME;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 16, y - h + 2, 32, 24);

    // Danish bureaucratic bullet points
    ctx.font = '4px monospace';
    ctx.fillStyle = '#3050A0';
    ctx.textAlign = 'left';
    ctx.fillText('STATUS PÅ', x - 13, y - h + 9);
    ctx.fillText('IMPLEMENTERING', x - 13, y - h + 14);
    ctx.fillStyle = '#C04040';
    ctx.fillText('OPFØLGNING!!', x - 13, y - h + 19);
    // Bullet dots
    ctx.fillStyle = '#3050A0';
    ctx.fillRect(x - 14, y - h + 7, 1, 1);
    ctx.fillRect(x - 14, y - h + 12, 1, 1);
    ctx.fillRect(x - 14, y - h + 17, 1, 1);
    ctx.textAlign = 'center'; // Reset
}

// Draw messy desk — papers scattered, coffee cup, tilted monitor
function drawDeskMessy(ctx, x, y) {
    // Same desk legs
    ctx.fillStyle = '#808080';
    ctx.fillRect(x - 12, y - 2, 3, 14);
    ctx.fillRect(x + 9, y - 2, 3, 14);
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 12, y - 2, 3, 14);
    ctx.strokeRect(x + 9, y - 2, 3, 14);

    // Desk surface
    drawBox(ctx, x, y + 2, HW * 1.4, HH * 1.3, 4, P.DESK_TOP, P.DESK_FRONT, P.DESK_SIDE, P.WALL_OUTLINE);

    // Scattered papers
    ctx.fillStyle = P.PAPER_WHITE;
    ctx.save();
    ctx.translate(x + 10, y - 1);
    ctx.rotate(0.3);
    ctx.fillRect(0, 0, 8, 6);
    ctx.restore();
    ctx.save();
    ctx.translate(x + 6, y + 2);
    ctx.rotate(-0.15);
    ctx.fillRect(0, 0, 7, 5);
    ctx.restore();

    // Monitor (slightly tilted)
    ctx.fillStyle = '#505050';
    ctx.fillRect(x - 3, y - 4, 3, 6);
    ctx.fillStyle = '#2C2C2C';
    ctx.save();
    ctx.translate(x - 10, y - 17);
    ctx.rotate(-0.05);
    ctx.fillRect(0, 0, 22, 14);
    ctx.fillStyle = P.MONITOR_SCREEN;
    ctx.fillRect(1, 1, 20, 10);
    ctx.restore();

    // Coffee mug
    ctx.fillStyle = '#E8E0D0';
    ctx.beginPath();
    ctx.arc(x + 14, y + 1, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Handle
    ctx.beginPath();
    ctx.arc(x + 17, y + 1, 2, -0.5, 0.5);
    ctx.stroke();

    // Post-it note
    ctx.fillStyle = '#FFE87C';
    ctx.fillRect(x - 16, y - 1, 6, 5);
}

// Draw tidy desk — clean, organized, small plant
function drawDeskTidy(ctx, x, y) {
    // Desk legs
    ctx.fillStyle = '#808080';
    ctx.fillRect(x - 12, y - 2, 3, 14);
    ctx.fillRect(x + 9, y - 2, 3, 14);
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 12, y - 2, 3, 14);
    ctx.strokeRect(x + 9, y - 2, 3, 14);

    // Desk surface
    drawBox(ctx, x, y + 2, HW * 1.4, HH * 1.3, 4, P.DESK_TOP, P.DESK_FRONT, P.DESK_SIDE, P.WALL_OUTLINE);

    // Monitor — perfectly centered
    ctx.fillStyle = '#505050';
    ctx.fillRect(x - 1, y - 4, 3, 6);
    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(x - 13, y - 18, 26, 15);
    ctx.fillStyle = P.MONITOR_SCREEN;
    ctx.fillRect(x - 11, y - 16, 22, 11);
    ctx.fillStyle = P.MONITOR_GLOW;
    ctx.fillRect(x - 11, y - 16, 22, 3);
    ctx.strokeStyle = '#1C1C1C';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 13, y - 18, 26, 15);

    // Keyboard
    ctx.fillStyle = '#D0D0D0';
    ctx.fillRect(x - 8, y + 1, 16, 4);

    // Small succulent plant
    ctx.fillStyle = '#8B6040';
    ctx.fillRect(x + 14, y - 2, 5, 4);
    ctx.fillStyle = '#5A8040';
    ctx.beginPath();
    ctx.arc(x + 16, y - 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pencil holder
    ctx.fillStyle = '#4A6080';
    ctx.fillRect(x - 18, y - 2, 4, 5);

    // Mouse
    ctx.fillStyle = '#C8C8C8';
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 3, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Small desk lamp (right side)
    ctx.fillStyle = '#2C2C2C';
    ctx.fillRect(x + 18, y + 1, 3, 2); // base
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 19, y + 1);
    ctx.lineTo(x + 17, y - 6);
    ctx.stroke();
    // Lamp head
    ctx.fillStyle = '#505050';
    ctx.beginPath();
    ctx.ellipse(x + 16, y - 7, 4, 2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Light glow
    ctx.fillStyle = 'rgba(240,232,208,0.15)';
    ctx.beginPath();
    ctx.ellipse(x + 16, y - 2, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();
}

// Draw empty desk — WFH colleague, just bare desk
function drawDeskEmpty(ctx, x, y) {
    // Desk legs
    ctx.fillStyle = '#808080';
    ctx.fillRect(x - 12, y - 2, 3, 14);
    ctx.fillRect(x + 9, y - 2, 3, 14);
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 12, y - 2, 3, 14);
    ctx.strokeRect(x + 9, y - 2, 3, 14);

    // Desk surface
    drawBox(ctx, x, y + 2, HW * 1.4, HH * 1.3, 4, P.DESK_TOP, P.DESK_FRONT, P.DESK_SIDE, P.WALL_OUTLINE);

    // Closed laptop
    ctx.fillStyle = '#B0B0B0';
    ctx.fillRect(x - 8, y - 1, 16, 2);
    ctx.strokeStyle = '#909090';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x - 8, y - 1, 16, 2);
}

// Draw recycling bin
function drawRecyclingBin(ctx, x, y) {
    drawBox(ctx, x, y + 6, 14, 10, 14, '#6A9060', '#4A7040', '#5A8050', P.WALL_OUTLINE);
    // Recycle symbol (simplified arrows)
    ctx.strokeStyle = '#C0E0B0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y - 4, 3, 0, Math.PI * 1.5);
    ctx.stroke();
}

// Draw coat rack
function drawCoatRack(ctx, x, y) {
    // Pole
    ctx.fillStyle = '#606060';
    ctx.fillRect(x - 1, y - 30, 3, 32);
    ctx.strokeStyle = P.WALL_OUTLINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 1, y - 30, 3, 32);

    // Base
    ctx.fillStyle = '#505050';
    ctx.fillRect(x - 5, y, 11, 3);

    // Hooks
    ctx.strokeStyle = '#707070';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 1, y - 26);
    ctx.lineTo(x - 6, y - 22);
    ctx.moveTo(x + 2, y - 26);
    ctx.lineTo(x + 7, y - 22);
    ctx.stroke();

    // Jacket hanging
    ctx.fillStyle = '#3A5070';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 22);
    ctx.lineTo(x - 10, y - 12);
    ctx.lineTo(x - 4, y - 12);
    ctx.closePath();
    ctx.fill();
}

// Main tile draw dispatcher
export function drawTile(ctx, tileType, x, y, col, row) {
    // Habbo-style checkerboard floor
    const isAlt = (col + row) % 2 === 0;

    switch (tileType) {
        case TILE.FLOOR:
        case TILE.DOOR:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_LIGHT : P.FLOOR_DARK, '#D0C8BC');
            drawCarpetTexture(ctx, x, y);
            if (tileType === TILE.DOOR) {
                drawDiamond(ctx, x, y, P.FLOOR_CORRIDOR, '#C0B8AC');
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
        case TILE.CHAIR:
        case TILE.RECYCLING_BIN:
        case TILE.COAT_RACK:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_LIGHT : P.FLOOR_DARK, '#D0C8BC');
            drawCarpetTexture(ctx, x, y);
            break;
        case TILE.COFFEE_MACHINE:
            drawDiamond(ctx, x, y, P.FLOOR_KITCHEN, '#C0B8AC');
            drawTileGrout(ctx, x, y);
            break;
        case TILE.PRINTER:
        case TILE.PLANT:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_LIGHT : P.FLOOR_DARK, '#D0C8BC');
            drawCarpetTexture(ctx, x, y);
            break;
        case TILE.MEETING_TABLE:
            drawDiamond(ctx, x, y, P.FLOOR_MEETING, '#C8C4BC');
            drawMeetingCarpet(ctx, x, y);
            break;
        case TILE.TOILET_STALL:
            drawDiamond(ctx, x, y, P.FLOOR_RESTROOM, '#C8C8C8');
            drawTileGrout(ctx, x, y);
            break;
        case TILE.FRONT_DESK:
            drawDiamond(ctx, x, y, P.FLOOR_MINISTER, '#B8A890');
            drawCarpetBorder(ctx, x, y);
            break;
        case TILE.BOOKSHELF:
            drawDiamond(ctx, x, y, isAlt ? P.FLOOR_LIGHT : P.FLOOR_DARK, '#D0C8BC');
            drawCarpetTexture(ctx, x, y);
            break;
        case TILE.COUNTER:
            drawDiamond(ctx, x, y, P.FLOOR_KITCHEN, '#C0B8AC');
            drawTileGrout(ctx, x, y);
            break;
        case TILE.FRIDGE:
            drawDiamond(ctx, x, y, P.FLOOR_KITCHEN, '#C0B8AC');
            drawTileGrout(ctx, x, y);
            break;
        case TILE.WHITEBOARD:
            drawDiamond(ctx, x, y, P.FLOOR_MEETING, '#C8C4BC');
            drawMeetingCarpet(ctx, x, y);
            break;
        case TILE.VOID:
        default:
            // Don't draw anything for void
            break;
    }

    // Sparse floor decorations (cable outlets, marks)
    if (tileType !== TILE.VOID) {
        const hash = (col * 7 + row * 13) % 23;
        if (hash === 3 || hash === 17) {
            // Floor outlet cover
            ctx.fillStyle = 'rgba(60,56,48,0.12)';
            ctx.fillRect(x - 2, y - 1, 4, 3);
        }
    }
}

// Draw elevated objects (walls, furniture) — called in z-sorted order
export function drawElevated(ctx, tileType, x, y) {
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
    }
}

// Check if a tile type has elevated geometry that needs z-sorting
export function hasElevated(tileType) {
    return tileType !== TILE.VOID && tileType !== TILE.FLOOR && tileType !== TILE.DOOR;
}

// Ambient occlusion — soft shadows on floor tiles near walls
const WALL_TILES = new Set([TILE.WALL_SOUTH, TILE.WALL_EAST, TILE.WALL_CORNER]);

export function drawAmbientShadow(ctx, x, y, col, row, tilemap) {
    // Check each neighbor for walls
    const north = tilemap.getTile(col, row - 1);
    const south = tilemap.getTile(col, row + 1);
    const west = tilemap.getTile(col - 1, row);
    const east = tilemap.getTile(col + 1, row);

    ctx.fillStyle = 'rgba(0,0,0,0.04)';

    // Shadow from north wall (shadow falls south, on top edge of this tile)
    if (WALL_TILES.has(north)) {
        ctx.beginPath();
        ctx.moveTo(x, y - HH);
        ctx.lineTo(x + HW, y);
        ctx.lineTo(x + HW * 0.7, y);
        ctx.lineTo(x, y - HH + 4);
        ctx.lineTo(x - HW * 0.7, y);
        ctx.lineTo(x - HW, y);
        ctx.closePath();
        ctx.fill();
    }

    // Shadow from west wall
    if (WALL_TILES.has(west) || west === TILE.GLASS_WALL_E) {
        ctx.beginPath();
        ctx.moveTo(x - HW, y);
        ctx.lineTo(x, y - HH);
        ctx.lineTo(x - HW + 6, y);
        ctx.lineTo(x, y + HH);
        ctx.closePath();
        ctx.fill();
    }
}
