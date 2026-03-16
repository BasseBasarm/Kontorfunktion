// Isometric tile dimensions (2:1 ratio, Habbo-style)
export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

// Display canvas dimensions
export const CANVAS_WIDTH = 960;
export const CANVAS_HEIGHT = 640;

// Internal pixel-art resolution (rendered at 1:1, then scaled up)
export const INTERNAL_WIDTH = 480;
export const INTERNAL_HEIGHT = 320;
export const PIXEL_SCALE = 2; // Integer scale-up: 480*2=960, 320*2=640

// Map dimensions (in tiles)
export const MAP_COLS = 22;
export const MAP_ROWS = 19;

// Wall height in pixels (Habbo-style — not too tall)
export const WALL_HEIGHT = 22;

// Character dimensions
export const CHAR_WIDTH = 20;
export const CHAR_HEIGHT = 36;

// Movement
export const MOVE_SPEED = 3.5; // tiles per second
export const MOVE_INTERPOLATION = 0.12; // smooth movement factor

// Timer
export const TIMER_START = 179; // 2:59 in seconds
export const TIMER_WARNING = 60; // seconds remaining for warning state
export const TIMER_CRITICAL = 30; // seconds remaining for critical state

// Dialogue
export const TYPING_SPEED = 35; // ms per character
export const LINE_PAUSE = 1800; // ms pause between lines
export const DIALOGUE_PADDING = 16;

// NPC interaction distance (Manhattan distance on grid)
export const INTERACTION_DISTANCE = 1.5;

// Chief behavior
export const CHIEF_RELOCATE_TIME = 120; // seconds into game when chief may move
export const CHIEF_RELOCATE_NPC_COUNT = 3; // NPCs talked to before chief may move

// Tile types
export const TILE = {
    VOID: 0,
    FLOOR: 1,
    WALL_SOUTH: 2,
    WALL_EAST: 3,
    WALL_CORNER: 4,
    DESK: 5,
    CHAIR: 6,
    DOOR: 7,
    COFFEE_MACHINE: 8,
    PRINTER: 9,
    PLANT: 10,
    MEETING_TABLE: 11,
    GLASS_WALL_S: 12,
    GLASS_WALL_E: 13,
    TOILET_STALL: 14,
    FRONT_DESK: 15,
    BOOKSHELF: 16,
    COUNTER: 17,
    FRIDGE: 18,
    WHITEBOARD: 19,
    MONITOR: 20,
    LAMP: 21,
    DANISH_FLAG: 22,
    WALL_NORTH: 23,
    WALL_WEST: 24,
    DESK_MESSY: 25,
    DESK_TIDY: 26,
    DESK_EMPTY: 27,
    RECYCLING_BIN: 28,
    COAT_RACK: 29,
    SINK: 30,
    MINISTER_DESK: 31,
    TOILET_SIGN: 32,
    DESK_CLUTTERED: 33,
    DESK_TECH: 34,
    DYING_PLANT: 35,
};

// Which tiles block movement
export const WALKABLE = new Set([
    TILE.FLOOR,
    TILE.DOOR,
]);

// Game states
export const STATE = {
    TITLE: 'TITLE',
    PLAYING: 'PLAYING',
    DIALOGUE: 'DIALOGUE',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
};
