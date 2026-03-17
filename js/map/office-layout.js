import { TILE as T } from '../constants.js';

// 22 columns × 19 rows — compact, dense office layout
// Layout zones:
//   Row 1:      North wall
//   Rows 2-3:   Minister's office (left) | Secretary area (center) | Senior office (right)
//   Row 4:      Dividing wall with doors
//   Rows 5-6:   Main corridor (printer, recycling, coat rack)
//   Rows 7-10:  Meeting room (left, glass, 5×3 interior) | Open office desk islands (right)
//   Row 11:     Meeting south wall + lower corridor
//   Row 12:     Open floor / transition
//   Row 13:     Dividing wall + restroom north wall
//   Rows 14-16: Kitchen (left) | Restrooms (right, 3 stalls)
//   Row 17:     South wall

const _ = T.VOID;
const F = T.FLOOR;
const WS = T.WALL_SOUTH;
const WE = T.WALL_EAST;
const WC = T.WALL_CORNER;
const D = T.DESK;
const C = T.CHAIR;
const DR = T.DOOR;
const CM = T.COFFEE_MACHINE;
const PR = T.PRINTER;
const PL = T.PLANT;
const MT = T.MEETING_TABLE;
const GS = T.GLASS_WALL_S;
const GE = T.GLASS_WALL_E;
const TS = T.TOILET_STALL;
const FD = T.FRONT_DESK;
const BS = T.BOOKSHELF;
const CT = T.COUNTER;
const FR = T.FRIDGE;
const WB = T.WHITEBOARD;
const DM = T.DESK_MESSY;
const DT = T.DESK_TIDY;
const DE = T.DESK_EMPTY;
const RB = T.RECYCLING_BIN;
const CR = T.COAT_RACK;
const SK = T.SINK;
const MD = T.MINISTER_DESK;
const TG = T.TOILET_SIGN;
const DC = T.DESK_CLUTTERED;
const DK = T.DESK_TECH;
const DP = T.DYING_PLANT;

export const OFFICE_LAYOUT = [
    //0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21
    [ _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _], // row 0
    [ _,  WC, WS, WS, WS, WS, WS, WC, WS, WS, WS, WS, WS, WC, WS, WS, WS, WS, WS, WS, WC, _], // row 1  north wall
    [ _,  WE, MD, PL, F,  F,  BS, WE, F,  FD, F,  F,  F,  WE, F,  F,  D,  F,  F,  PL, WE, _], // row 2  minister | secretary | senior
    [ _,  WE, C,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  C,  F,  F,  F,  WE, _], // row 3  (col 7,13 opened for door access)
    [ _,  WC, WS, WS, WS, WS, WS, DR, F,  F,  F,  F,  F,  DR, WS, GS, GS, GS, GS, WS, WC, _], // row 4  dividing wall + doors
    [ _,  WE, F,  F,  PR, F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  WE, _], // row 5  corridor
    [ _,  WE, F,  F,  F,  F,  F,  RB, F,  F,  F,  F,  F,  F,  F,  F,  CR, F,  DP, F,  WE, _], // row 6  corridor continued
    [ _,  WC, GS, GS, GS, GS, GS, WC, F,  DM, F,  F,  DC, F,  F,  DK, F,  D,  F,  F,  WE, _], // row 7  meeting north + desk islands
    [ _,  GE, F,  WB, F,  F,  F,  GE, F,  C,  F,  F,  C,  F,  F,  C,  F,  C,  F,  F,  WE, _], // row 8  meeting interior + chairs
    [ _,  GE, MT, F,  MT, F,  F,  DR, F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  WE, _], // row 9  meeting tables + middle door
    [ _,  GE, F,  F,  F,  F,  F,  DR, F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  WE, _], // row 10 meeting door + open floor
    [ _,  WC, WS, WS, WS, WS, WS, WC, F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  PL, F,  WE, _], // row 11 meeting south wall
    [ _,  WE, F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  WE, _], // row 12 open floor
    [ _,  WC, WS, WS, WS, WS, WS, WS, F,  F,  F,  WC, TG, WS, WS, WS, WS, WS, WS, WS, WC, _], // row 13 divider + restroom wall
    [ _,  WE, F,  CT, CM, F,  FR, F,  F,  F,  F,  WE, F,  TS, F,  TS, F,  TS, F,  F,  WE, _], // row 14 kitchen + restroom stalls
    [ _,  WE, F,  F,  F,  F,  F,  F,  F,  PL, F,  DR, F,  F,  F,  F,  F,  F,  SK, F,  WE, _], // row 15 kitchen floor + restroom door
    [ _,  WE, F,  F,  F,  PL, F,  F,  F,  F,  F,  WE, F,  SK, F,  F,  F,  F,  F,  F,  WE, _], // row 16 floor + restroom sinks
    [ _,  WC, WS, WS, WS, WS, WS, WS, WS, WS, WS, WC, WS, WS, WS, WS, WS, WS, WS, WS, WC, _], // row 17 south wall
    [ _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _], // row 18
];

// NPC spawn positions for compact layout
// NPCs at desk chairs face their desks (desks are one row above chairs)
export const NPC_POSITIONS = [
    { id: 'teamleder', col: 9, row: 8, type: 'teamleder', atDesk: true },       // at messy desk chair
    { id: 'kollega_møde', col: 12, row: 8, type: 'kollega_moede', atDesk: true }, // at cluttered desk chair
    { id: 'hr', col: 17, row: 8, type: 'hr', atDesk: true },                     // at standard desk chair
    { id: 'f2_superbruger', col: 15, row: 8, type: 'f2_superbruger', atDesk: true }, // at tech desk chair
    { id: 'sekretær', col: 8, row: 3, type: 'sekretaer' },
    { id: 'smalltalk', col: 10, row: 12, type: 'smalltalk' },
    { id: 'rådgiver', col: 16, row: 3, type: 'raadgiver', atDesk: true },        // at senior desk
    { id: 'mødedeltager', col: 6, row: 10, type: 'moededeltager' },
    { id: 'kaffe_kollega', col: 5, row: 15, type: 'kaffe' },
    { id: 'toilet_kollega', col: 14, row: 15, type: 'toilet' },
    { id: 'minister', col: 3, row: 3, type: 'minister' },
];

// Chief possible spawn locations
export const CHIEF_SPAWNS = [
    { col: 10, row: 5 },  // Main corridor center
    { col: 5, row: 5 },   // Corridor near printer
    { col: 14, row: 10 }, // Open office floor (east)
    { col: 8, row: 12 },  // Lower open area (west)
    { col: 4, row: 15 },  // Kitchen area
    { col: 15, row: 12 }, // Open floor (south-east)
];

// Player start position (center of open office, clear of desk NPCs)
export const PLAYER_START = { col: 11, row: 10 };

// Points of interest for NPC pathfinding destinations
export const POINTS_OF_INTEREST = {
    coffee_machine: { col: 5, row: 14 },
    printer: { col: 5, row: 5 },
    meeting_room: { col: 5, row: 10 },
    kitchen: { col: 5, row: 15 },
    restroom: { col: 14, row: 15 },
    corridor_north: { col: 10, row: 5 },
    corridor_south: { col: 10, row: 12 },
};
