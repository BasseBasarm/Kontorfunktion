import { PALETTE as P } from './palette.js';

// Habbo-style chunky character sprites
// Characters are drawn programmatically with big heads, small bodies, thick outlines

// Pre-render a character sprite to an offscreen canvas
export function createCharacterSprite(config) {
    const canvas = document.createElement('canvas');
    canvas.width = 36;
    canvas.height = 54;
    const ctx = canvas.getContext('2d');

    drawCharacter(ctx, 18, 50, config);

    return canvas;
}

// Draw a Habbo-style character at (cx, bottomY)
// pose: 'standing' (default), 'typing', 'walking', 'phone', 'stretching'
export function drawCharacter(ctx, cx, bottomY, config, pose = 'standing') {
    const {
        skinTone = P.SKIN_LIGHT,
        hairColor = P.HAIR_BROWN,
        hairStyle = 'short',
        shirtColor = P.SHIRT_WHITE,
        pantsColor = P.PANTS_DARK,
        gender = 'male',
        isChief = false,
    } = config;

    const outline = P.WALL_OUTLINE;
    const s = 1.12;

    ctx.save();
    ctx.translate(cx, bottomY);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Shoes
    ctx.fillStyle = P.SHOES_DARK;
    if (pose === 'walking') {
        // Walking: staggered feet
        ctx.fillRect(-7 * s, -4 * s, 5 * s, 4 * s);
        ctx.fillRect(2 * s, -5 * s, 5 * s, 4 * s);
    } else {
        ctx.fillRect(-6 * s, -4 * s, 5 * s, 4 * s);
        ctx.fillRect(1 * s, -4 * s, 5 * s, 4 * s);
    }

    // Legs / pants
    ctx.fillStyle = pantsColor;
    if (pose === 'walking') {
        ctx.fillRect(-6 * s, -12 * s, 4 * s, 9 * s);
        ctx.fillRect(2 * s, -13 * s, 4 * s, 9 * s);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-6 * s, -12 * s, 4 * s, 9 * s);
        ctx.strokeRect(2 * s, -13 * s, 4 * s, 9 * s);
    } else {
        ctx.fillRect(-5 * s, -12 * s, 4 * s, 9 * s);
        ctx.fillRect(1 * s, -12 * s, 4 * s, 9 * s);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-5 * s, -12 * s, 4 * s, 9 * s);
        ctx.strokeRect(1 * s, -12 * s, 4 * s, 9 * s);
    }

    // Torso / shirt
    ctx.fillStyle = shirtColor;
    if (gender === 'female') {
        ctx.beginPath();
        ctx.moveTo(-6 * s, -12 * s);
        ctx.lineTo(-7 * s, -18 * s);
        ctx.lineTo(-5 * s, -22 * s);
        ctx.lineTo(5 * s, -22 * s);
        ctx.lineTo(7 * s, -18 * s);
        ctx.lineTo(6 * s, -12 * s);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.stroke();
    } else if (gender === 'nonbinary') {
        // Slim tapered torso — distinct from both male and female
        ctx.beginPath();
        ctx.moveTo(-5 * s, -12 * s);
        ctx.lineTo(-6 * s, -17 * s);
        ctx.lineTo(-5 * s, -22 * s);
        ctx.lineTo(5 * s, -22 * s);
        ctx.lineTo(6 * s, -17 * s);
        ctx.lineTo(5 * s, -12 * s);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.stroke();
    } else {
        ctx.fillRect(-6 * s, -22 * s, 12 * s, 11 * s);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-6 * s, -22 * s, 12 * s, 11 * s);
    }

    // Arms (pose-dependent)
    ctx.fillStyle = shirtColor;
    if (pose === 'typing') {
        // Arms forward (bent down toward keyboard)
        ctx.fillRect(-8 * s, -20 * s, 3 * s, 7 * s);
        ctx.fillRect(5 * s, -20 * s, 3 * s, 7 * s);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-8 * s, -20 * s, 3 * s, 7 * s);
        ctx.strokeRect(5 * s, -20 * s, 3 * s, 7 * s);
        // Hands in front
        ctx.fillStyle = skinTone;
        ctx.fillRect(-5 * s, -13 * s, 3 * s, 3 * s);
        ctx.fillRect(2 * s, -13 * s, 3 * s, 3 * s);
    } else if (pose === 'phone') {
        // Left arm normal, right arm raised to ear
        ctx.fillRect(-9 * s, -21 * s, 3 * s, 9 * s);
        ctx.fillRect(5 * s, -24 * s, 3 * s, 6 * s);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-9 * s, -21 * s, 3 * s, 9 * s);
        ctx.strokeRect(5 * s, -24 * s, 3 * s, 6 * s);
        // Left hand normal
        ctx.fillStyle = skinTone;
        ctx.fillRect(-9 * s, -12 * s, 3 * s, 3 * s);
        // Right hand with phone near head
        ctx.fillRect(5 * s, -27 * s, 3 * s, 3 * s);
        // Phone rectangle
        ctx.fillStyle = '#383838';
        ctx.fillRect(5.5 * s, -31 * s, 2 * s, 4 * s);
    } else if (pose === 'stretching') {
        // Both arms raised up
        ctx.fillRect(-9 * s, -28 * s, 3 * s, 9 * s);
        ctx.fillRect(6 * s, -28 * s, 3 * s, 9 * s);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-9 * s, -28 * s, 3 * s, 9 * s);
        ctx.strokeRect(6 * s, -28 * s, 3 * s, 9 * s);
        // Hands up
        ctx.fillStyle = skinTone;
        ctx.fillRect(-9 * s, -31 * s, 3 * s, 3 * s);
        ctx.fillRect(6 * s, -31 * s, 3 * s, 3 * s);
    } else {
        // Default standing arms
        ctx.fillRect(-9 * s, -21 * s, 3 * s, 9 * s);
        ctx.fillRect(6 * s, -21 * s, 3 * s, 9 * s);
        ctx.strokeStyle = outline;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-9 * s, -21 * s, 3 * s, 9 * s);
        ctx.strokeRect(6 * s, -21 * s, 3 * s, 9 * s);
        // Hands
        ctx.fillStyle = skinTone;
        ctx.fillRect(-9 * s, -12 * s, 3 * s, 3 * s);
        ctx.fillRect(6 * s, -12 * s, 3 * s, 3 * s);
    }

    // Neck
    ctx.fillStyle = skinTone;
    ctx.fillRect(-2 * s, -25 * s, 4 * s, 4 * s);

    // Head (big Habbo-style head)
    ctx.fillStyle = skinTone;
    ctx.beginPath();
    ctx.ellipse(0, -32 * s, 8 * s, 9 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = outline;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Hair
    ctx.fillStyle = hairColor;
    drawHair(ctx, hairStyle, gender, s);

    // Eyes (simple dots)
    ctx.fillStyle = '#1C1810';
    ctx.fillRect(-3 * s, -33 * s, 2 * s, 2 * s);
    ctx.fillRect(1 * s, -33 * s, 2 * s, 2 * s);

    // Chief marker — small glasses
    if (isChief) {
        ctx.strokeStyle = '#404040';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(-4 * s, -34 * s, 3 * s, 3 * s);
        ctx.rect(1 * s, -34 * s, 3 * s, 3 * s);
        ctx.moveTo(-1 * s, -33 * s);
        ctx.lineTo(1 * s, -33 * s);
        ctx.stroke();
    }

    ctx.restore();
}

function drawHair(ctx, style, gender, s) {
    switch (style) {
        case 'bald':
            // No hair — just draw nothing
            break;
        case 'short':
            // Short cropped - covers top of head
            ctx.beginPath();
            ctx.ellipse(0, -35 * s, 8 * s, 6 * s, 0, Math.PI, 0);
            ctx.fill();
            break;
        case 'medium':
            // Medium length
            ctx.beginPath();
            ctx.ellipse(0, -35 * s, 9 * s, 7 * s, 0, Math.PI, 0);
            ctx.fill();
            // Side bits
            ctx.fillRect(-8 * s, -35 * s, 3 * s, 6 * s);
            ctx.fillRect(5 * s, -35 * s, 3 * s, 6 * s);
            break;
        case 'long':
            // Long hair - covers more
            ctx.beginPath();
            ctx.ellipse(0, -35 * s, 9 * s, 7 * s, 0, Math.PI, 0);
            ctx.fill();
            ctx.fillRect(-9 * s, -36 * s, 3 * s, 14 * s);
            ctx.fillRect(6 * s, -36 * s, 3 * s, 14 * s);
            break;
        case 'bun':
            // Bun style
            ctx.beginPath();
            ctx.ellipse(0, -35 * s, 8 * s, 6 * s, 0, Math.PI, 0);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, -42 * s, 4 * s, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'curly':
            // Curly / afro
            ctx.beginPath();
            ctx.ellipse(0, -34 * s, 10 * s, 10 * s, 0, Math.PI * 0.1, Math.PI * 0.9);
            ctx.fill();
            break;
        case 'buzz':
            // Very short buzz cut
            ctx.beginPath();
            ctx.ellipse(0, -36 * s, 7 * s, 5 * s, 0, Math.PI, 0);
            ctx.fill();
            break;
        case 'ponytail':
            ctx.beginPath();
            ctx.ellipse(0, -35 * s, 8 * s, 6 * s, 0, Math.PI, 0);
            ctx.fill();
            // Ponytail
            ctx.fillRect(4 * s, -38 * s, 4 * s, 3 * s);
            ctx.beginPath();
            ctx.ellipse(8 * s, -33 * s, 3 * s, 5 * s, 0.3, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'headscarf':
            // Headscarf/hijab
            ctx.beginPath();
            ctx.ellipse(0, -34 * s, 10 * s, 9 * s, 0, Math.PI * 0.05, Math.PI * 0.95);
            ctx.fill();
            ctx.fillRect(-8 * s, -34 * s, 16 * s, 10 * s);
            break;
        default:
            // Default short
            ctx.beginPath();
            ctx.ellipse(0, -35 * s, 8 * s, 6 * s, 0, Math.PI, 0);
            ctx.fill();
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
        skinTone: P.SKIN_TAN,
        hairColor: P.HAIR_BLACK,
        hairStyle: 'bun',
        shirtColor: P.SHIRT_PINK,
        pantsColor: P.PANTS_DARK,
        gender: 'female',
    },
    smalltalk: {
        skinTone: P.SKIN_LIGHT,
        hairColor: P.HAIR_RED,
        hairStyle: 'medium',
        shirtColor: P.SHIRT_WHITE,
        pantsColor: P.PANTS_GREY,
        gender: 'male',
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
};
