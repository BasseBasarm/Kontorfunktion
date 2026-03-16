import { PALETTE as P } from './palette.js';

// Habbo-style chunky character sprites — pixel-art version
// Characters drawn with fillRect only — no arcs, ellipses, or curves

// Sprite cache: key = configHash+pose → offscreen canvas
const _spriteCache = new Map();
const SPRITE_W = 32;
const SPRITE_H = 56;
const SPRITE_CX = 16;
const SPRITE_CY = 52;
// Display scale: sprites are drawn small then nearest-neighbor scaled up
// At 480x320 @2x, we need 1.5x to match the visual size from 320x213 @3x
const SPRITE_DISPLAY_SCALE = 1.5;
const DISPLAY_W = Math.round(SPRITE_W * SPRITE_DISPLAY_SCALE);
const DISPLAY_H = Math.round(SPRITE_H * SPRITE_DISPLAY_SCALE);
const DISPLAY_CX = Math.round(SPRITE_CX * SPRITE_DISPLAY_SCALE);
const DISPLAY_CY = Math.round(SPRITE_CY * SPRITE_DISPLAY_SCALE);

function _configKey(config, pose) {
    return `${config.skinTone}|${config.hairColor}|${config.hairStyle}|${config.shirtColor}|${config.pantsColor}|${config.gender || 'male'}|${config.isChief ? 1 : 0}|${config.hasGlasses ? 1 : 0}|${config.beard || 'none'}|${pose}`;
}

// Get or create a cached sprite
function getCachedSprite(config, pose) {
    const key = _configKey(config, pose);
    let cached = _spriteCache.get(key);
    if (!cached) {
        const canvas = document.createElement('canvas');
        canvas.width = SPRITE_W;
        canvas.height = SPRITE_H;
        const sctx = canvas.getContext('2d');
        sctx.imageSmoothingEnabled = false;
        _drawCharacterDirect(sctx, SPRITE_CX, SPRITE_CY, config, pose);
        cached = canvas;
        _spriteCache.set(key, cached);
    }
    return cached;
}

// Pre-render a character sprite to an offscreen canvas
export function createCharacterSprite(config) {
    return getCachedSprite(config, 'standing');
}

// Draw a character using cached sprite — nearest-neighbor scaled up
export function drawCharacter(ctx, cx, bottomY, config, pose = 'standing') {
    const sprite = getCachedSprite(config, pose);
    // imageSmoothingEnabled should already be false on the target ctx
    ctx.drawImage(sprite,
        0, 0, SPRITE_W, SPRITE_H,
        Math.round(cx) - DISPLAY_CX, Math.round(bottomY) - DISPLAY_CY,
        DISPLAY_W, DISPLAY_H);
}

// Direct drawing — used internally for cache population
function _drawCharacterDirect(ctx, cx, bottomY, config, pose = 'standing') {
    const {
        skinTone = P.SKIN_LIGHT,
        hairColor = P.HAIR_BROWN,
        hairStyle = 'short',
        shirtColor = P.SHIRT_WHITE,
        pantsColor = P.PANTS_DARK,
        gender = 'male',
        isChief = false,
        hasGlasses = false,
        beard = 'none',
    } = config;

    const outline = P.WALL_OUTLINE;

    ctx.save();
    ctx.translate(Math.round(cx), Math.round(bottomY));

    // Ground shadow (flat pixel diamond)
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(-6, -1, 12, 2);
    ctx.fillRect(-4, -2, 8, 1);
    ctx.fillRect(-4, 1, 8, 1);

    const isSitting = pose === 'sitting' || pose === 'sitting_typing';
    // Sitting pose: shift upper body down, draw bent legs
    if (isSitting) {
        // Feet (forward, flat on ground)
        ctx.fillStyle = P.SHOES_DARK;
        ctx.fillRect(-6, -2, 5, 3);
        ctx.fillRect(1, -2, 5, 3);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-6, -2, 5, 3);
        ctx.strokeRect(1, -2, 5, 3);
        // Lower legs (vertical, short)
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-5, -7, 4, 6);
        ctx.fillRect(1, -7, 4, 6);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-5, -7, 4, 6);
        ctx.strokeRect(1, -7, 4, 6);
        // Thighs (horizontal, going forward — the seated part)
        ctx.fillStyle = pantsColor;
        ctx.fillRect(-6, -10, 12, 4);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-6, -10, 12, 4);
    } else {
    // Shoes
    ctx.fillStyle = P.SHOES_DARK;
    if (pose === 'walking') {
        ctx.fillRect(-7, -4, 5, 4);
        ctx.fillRect(2, -5, 5, 4);
    } else {
        ctx.fillRect(-6, -4, 5, 4);
        ctx.fillRect(1, -4, 5, 4);
    }
    // Shoe outline
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1;
    if (pose === 'walking') {
        ctx.strokeRect(-7, -4, 5, 4);
        ctx.strokeRect(2, -5, 5, 4);
    } else {
        ctx.strokeRect(-6, -4, 5, 4);
        ctx.strokeRect(1, -4, 5, 4);
    }

    // Legs / pants
    ctx.fillStyle = pantsColor;
    if (pose === 'walking') {
        ctx.fillRect(-6, -12, 4, 9);
        ctx.fillRect(2, -13, 4, 9);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-6, -12, 4, 9);
        ctx.strokeRect(2, -13, 4, 9);
    } else {
        ctx.fillRect(-5, -12, 4, 9);
        ctx.fillRect(1, -12, 4, 9);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-5, -12, 4, 9);
        ctx.strokeRect(1, -12, 4, 9);
    }
    } // end non-sitting legs

    // Sitting offset: shift upper body down so character appears seated
    const sitOffset = isSitting ? 6 : 0;
    if (isSitting) ctx.translate(0, sitOffset);

    // Torso / shirt
    ctx.fillStyle = shirtColor;
    if (gender === 'female') {
        // Slightly shaped torso
        ctx.fillRect(-6, -22, 12, 11);
        ctx.fillRect(-7, -19, 1, 4);
        ctx.fillRect(6, -19, 1, 4);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-7, -22, 14, 11);
    } else if (gender === 'nonbinary') {
        ctx.fillRect(-6, -22, 12, 11);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-6, -22, 12, 11);
    } else {
        ctx.fillRect(-6, -22, 12, 11);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-6, -22, 12, 11);
    }

    // Shirt detail - subtle collar line
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, -22, 1, 6);

    // Arms (pose-dependent)
    ctx.fillStyle = shirtColor;
    if (pose === 'sitting_typing' || pose === 'typing') {
        ctx.fillRect(-8, -20, 3, 7);
        ctx.fillRect(5, -20, 3, 7);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-8, -20, 3, 7);
        ctx.strokeRect(5, -20, 3, 7);
        ctx.fillStyle = skinTone;
        ctx.fillRect(-5, -13, 3, 3);
        ctx.fillRect(2, -13, 3, 3);
    } else if (pose === 'phone') {
        ctx.fillRect(-9, -21, 3, 9);
        ctx.fillRect(5, -24, 3, 6);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-9, -21, 3, 9);
        ctx.strokeRect(5, -24, 3, 6);
        ctx.fillStyle = skinTone;
        ctx.fillRect(-9, -12, 3, 3);
        ctx.fillRect(5, -27, 3, 3);
        ctx.fillStyle = '#303030';
        ctx.fillRect(6, -31, 2, 4);
    } else if (pose === 'stretching') {
        ctx.fillRect(-9, -28, 3, 9);
        ctx.fillRect(6, -28, 3, 9);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-9, -28, 3, 9);
        ctx.strokeRect(6, -28, 3, 9);
        ctx.fillStyle = skinTone;
        ctx.fillRect(-9, -31, 3, 3);
        ctx.fillRect(6, -31, 3, 3);
    } else if (pose === 'carrying') {
        ctx.fillRect(-5, -20, 10, 3);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-5, -20, 10, 3);
        ctx.fillStyle = skinTone;
        ctx.fillRect(-6, -20, 3, 3);
        ctx.fillRect(5, -20, 3, 3);
        // Paper stack
        ctx.fillStyle = '#F0EBE0';
        ctx.fillRect(-4, -23, 8, 3);
        ctx.strokeStyle = '#A09080';
        ctx.lineWidth = 1;
        ctx.strokeRect(-4, -23, 8, 3);
        ctx.fillStyle = '#C0B8A8';
        ctx.fillRect(-2, -22, 4, 1);
        ctx.fillRect(-2, -21, 5, 1);
    } else {
        ctx.fillRect(-9, -21, 3, 9);
        ctx.fillRect(6, -21, 3, 9);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-9, -21, 3, 9);
        ctx.strokeRect(6, -21, 3, 9);
        ctx.fillStyle = skinTone;
        ctx.fillRect(-9, -12, 3, 3);
        ctx.fillRect(6, -12, 3, 3);
    }

    // Neck
    ctx.fillStyle = skinTone;
    ctx.fillRect(-2, -25, 4, 4);

    // Head (pixel-art oval using stacked fillRects)
    ctx.fillStyle = skinTone;
    // Build an oval ~16px wide, ~18px tall centered at (0, -32)
    ctx.fillRect(-5, -40, 10, 1);  // top
    ctx.fillRect(-7, -39, 14, 1);
    ctx.fillRect(-8, -38, 16, 2);
    ctx.fillRect(-8, -36, 16, 6);  // main body
    ctx.fillRect(-8, -30, 16, 2);
    ctx.fillRect(-7, -28, 14, 1);
    ctx.fillRect(-5, -27, 10, 1);
    ctx.fillRect(-4, -26, 8, 1);   // bottom
    // Head outline
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1;
    // Top edge
    ctx.fillStyle = outline;
    ctx.fillRect(-5, -41, 10, 1);
    ctx.fillRect(-7, -40, 2, 1);
    ctx.fillRect(5, -40, 2, 1);
    ctx.fillRect(-8, -39, 1, 1);
    ctx.fillRect(7, -39, 1, 1);
    // Sides
    ctx.fillRect(-9, -38, 1, 10);
    ctx.fillRect(8, -38, 1, 10);
    // Bottom edge
    ctx.fillRect(-8, -28, 1, 1);
    ctx.fillRect(7, -28, 1, 1);
    ctx.fillRect(-7, -27, 2, 1);
    ctx.fillRect(5, -27, 2, 1);
    ctx.fillRect(-5, -26, 1, 1);
    ctx.fillRect(4, -26, 1, 1);
    ctx.fillRect(-4, -25, 8, 1);

    // Hair
    ctx.fillStyle = hairColor;
    drawHair(ctx, hairStyle, gender);

    // Eyebrows
    ctx.fillStyle = hairColor;
    ctx.fillRect(-4, -36, 3, 1);
    ctx.fillRect(1, -36, 3, 1);

    // Eyes (pixel squares)
    // Eye whites
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-4, -35, 3, 3);
    ctx.fillRect(1, -35, 3, 3);
    // Pupils
    ctx.fillStyle = '#181410';
    ctx.fillRect(-3, -34, 2, 2);
    ctx.fillRect(2, -34, 2, 2);

    // Mouth
    ctx.fillStyle = '#7B5B40';
    ctx.fillRect(-2, -29, 4, 1);

    // Glasses
    if (isChief || hasGlasses) {
        ctx.strokeStyle = '#303030';
        ctx.lineWidth = 1;
        ctx.strokeRect(-5, -36, 4, 4);
        ctx.strokeRect(1, -36, 4, 4);
        // Bridge
        ctx.fillStyle = '#303030';
        ctx.fillRect(-1, -34, 2, 1);
    }

    // Beard
    if (beard === 'stubble') {
        ctx.fillStyle = hairColor;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(-4, -29, 7, 3);
        ctx.globalAlpha = 1;
    } else if (beard === 'full') {
        ctx.fillStyle = hairColor;
        ctx.fillRect(-3, -29, 6, 2);
        ctx.fillRect(-4, -28, 8, 2);
        ctx.fillRect(-3, -26, 6, 1);
        ctx.fillRect(-2, -25, 4, 1);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1;
        ctx.strokeRect(-4, -29, 8, 5);
    }

    ctx.restore();
}

function drawHair(ctx, style, gender) {
    switch (style) {
        case 'bald':
            break;
        case 'short':
            // Flat cap on top of head
            ctx.fillRect(-6, -41, 12, 3);
            ctx.fillRect(-7, -39, 14, 1);
            break;
        case 'medium':
            // Wider, with sideburns
            ctx.fillRect(-7, -41, 14, 4);
            ctx.fillRect(-8, -39, 16, 1);
            ctx.fillRect(-9, -38, 2, 5);
            ctx.fillRect(7, -38, 2, 5);
            break;
        case 'long':
            // Long hair with sides going down
            ctx.fillRect(-7, -41, 14, 4);
            ctx.fillRect(-8, -39, 16, 1);
            ctx.fillRect(-9, -38, 2, 14);
            ctx.fillRect(7, -38, 2, 14);
            break;
        case 'bun':
            // Cap + bun on top
            ctx.fillRect(-6, -41, 12, 3);
            ctx.fillRect(-7, -39, 14, 1);
            // Bun
            ctx.fillRect(-3, -46, 6, 4);
            ctx.fillRect(-2, -47, 4, 1);
            break;
        case 'curly':
            // Wide curly mass
            ctx.fillRect(-8, -42, 16, 5);
            ctx.fillRect(-9, -41, 18, 3);
            ctx.fillRect(-10, -40, 2, 6);
            ctx.fillRect(8, -40, 2, 6);
            break;
        case 'buzz':
            // Very short, just a thin cap
            ctx.fillRect(-6, -41, 12, 2);
            ctx.fillRect(-7, -40, 14, 1);
            break;
        case 'ponytail':
            // Cap + ponytail to the side
            ctx.fillRect(-6, -41, 12, 3);
            ctx.fillRect(-7, -39, 14, 1);
            // Ponytail
            ctx.fillRect(6, -40, 3, 3);
            ctx.fillRect(8, -38, 3, 6);
            ctx.fillRect(9, -32, 2, 3);
            break;
        case 'headscarf':
            // Wide covering
            ctx.fillRect(-9, -42, 18, 6);
            ctx.fillRect(-10, -40, 20, 2);
            ctx.fillRect(-9, -36, 18, 6);
            break;
        default:
            ctx.fillRect(-6, -41, 12, 3);
            ctx.fillRect(-7, -39, 14, 1);
    }
}

// NPC visual configurations — diverse cast
export const NPC_CONFIGS = {
    teamleder: {
        skinTone: P.SKIN_LIGHT,
        hairColor: P.HAIR_LIGHT_BROWN,
        hairStyle: 'short',
        shirtColor: P.SHIRT_BLUE,
        pantsColor: P.PANTS_NAVY,
        gender: 'male',
        beard: 'stubble',
    },
    kollega_moede: {
        skinTone: P.SKIN_MEDIUM,
        hairColor: P.HAIR_DARK,
        hairStyle: 'long',
        shirtColor: P.SHIRT_LIGHTBLUE,
        pantsColor: P.PANTS_DARK,
        gender: 'female',
    },
    hr: {
        skinTone: P.SKIN_LIGHT,
        hairColor: P.HAIR_GREY,
        hairStyle: 'medium',
        shirtColor: P.SHIRT_GREY,
        pantsColor: P.PANTS_DARK,
        gender: 'male',
        hasGlasses: true,
        beard: 'stubble',
    },
    f2_superbruger: {
        skinTone: P.SKIN_LIGHT,
        hairColor: P.HAIR_BLONDE,
        hairStyle: 'ponytail',
        shirtColor: P.SHIRT_GREEN,
        pantsColor: P.PANTS_KHAKI,
        gender: 'female',
    },
    sekretaer: {
        skinTone: P.SKIN_LIGHT,
        hairColor: P.HAIR_LIGHT_BROWN,
        hairStyle: 'short',
        shirtColor: P.SHIRT_LIGHTBLUE,
        pantsColor: P.PANTS_NAVY,
        gender: 'male',
    },
    smalltalk: {
        skinTone: P.SKIN_LIGHT,
        hairColor: P.HAIR_RED,
        hairStyle: 'medium',
        shirtColor: P.SHIRT_WHITE,
        pantsColor: P.PANTS_GREY,
        gender: 'male',
        beard: 'full',
    },
    raadgiver: {
        skinTone: P.SKIN_LIGHT,
        hairColor: P.HAIR_DARK,
        hairStyle: 'short',
        shirtColor: P.SHIRT_BLUE,
        pantsColor: P.PANTS_NAVY,
        gender: 'male',
    },
    moededeltager: {
        skinTone: P.SKIN_BROWN,
        hairColor: P.HAIR_BLACK,
        hairStyle: 'curly',
        shirtColor: P.SHIRT_LIGHTBLUE,
        pantsColor: P.PANTS_DARK,
        gender: 'male',
        hasGlasses: true,
    },
    kaffe: {
        skinTone: P.SKIN_TAN,
        hairColor: P.HAIR_DARK,
        hairStyle: 'headscarf',
        shirtColor: P.SHIRT_GREEN,
        pantsColor: P.PANTS_NAVY,
        gender: 'female',
    },
    toilet: {
        skinTone: P.SKIN_LIGHT,
        hairColor: P.HAIR_BLONDE,
        hairStyle: 'short',
        shirtColor: P.SHIRT_WHITE,
        pantsColor: P.PANTS_KHAKI,
        gender: 'male',
    },
    chief: {
        skinTone: P.SKIN_DARK,
        hairColor: P.HAIR_BLACK,
        hairStyle: 'bun',
        shirtColor: P.SHIRT_BLUE,
        pantsColor: P.PANTS_NAVY,
        gender: 'female',
        isChief: true,
    },
    minister: {
        skinTone: P.SKIN_LIGHT,
        hairColor: P.HAIR_GREY,
        hairStyle: 'bun',
        shirtColor: '#4A5068',
        pantsColor: P.PANTS_NAVY,
        gender: 'female',
        hasGlasses: true,
    },
};
