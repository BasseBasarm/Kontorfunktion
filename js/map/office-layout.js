import { TILE as T } from '../constants.js';

// 20 columns × 16 rows — compact office floor plan
// Layout zones:
//   Rows 1-3:  Minister's office (left), Secretary area (center), Senior office (right)
//   Row 4:     Dividing wall with doors
//   Rows 5-6:  Main corridor with props
//   Rows 7-9:  Meeting room (left, glass), Open office desk islands (right)
//   Row 10:    Transition corridor
//   Rows 11-12: Lower desk area
//   Rows 13-14: Kitchen/coffee (left), Restrooms (right)
//   Row 15:    South wall

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

export const OFFICE_LAYOUT = [
    //0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19
    [ _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _,  _], // row 0
    [ _,  WC, WS, WS, WS, WS, WS, WS, WS, WS, WS, WS, WS, WS, WS, WS, WS, WS, WC, _], // row 1 - north wall
    [ _,  WE, F,  PL, DT, F,  F,  WE, F,  FD, F,  F,  WE, F,  F,  D,  F,  BS, WE, _], // row 2 - minister area
    [ _,  WE, F,  F,  C,  F,  F,  DR, F,  F,  F,  F,  DR, F,  F,  C,  F,  PL, WE, _], // row 3
    [ _,  WC, WS, WS, WS, WS, WS, WC, F,  F,  F,  F,  WC, WS, WS, GS, GS, WS, WC, _], // row 4 - dividing wall
    [ _,  WE, F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  CR, F,  WE, _], // row 5 - main corridor + coat rack
    [ _,  WE, F,  F,  PR, F,  F,  F,  RB, F,  F,  F,  F,  F,  F,  F,  PL, F,  WE, _], // row 6 - printer + recycling
    [ _,  WC, GS, GS, WC, F,  F,  DM, F,  F,  D,  F,  F,  DE, F,  F,  F,  F,  WE, _], // row 7 - meeting room + desk islands
    [ _,  GE, F,  F,  GE, F,  F,  C,  F,  F,  C,  F,  F,  C,  F,  F,  WB, F,  WE, _], // row 8
    [ _,  GE, MT, F,  DR, F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  WE, _], // row 9
    [ _,  WC, WS, WS, WC, F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  F,  WE, _], // row 10 - transition
    [ _,  WE, F,  F,  F,  F,  DT, F,  F,  F,  DM, F,  F,  D,  F,  F,  F,  F,  WE, _], // row 11 - lower desks (varied)
    [ _,  WE, F,  F,  F,  F,  C,  F,  F,  F,  C,  F,  F,  C,  F,  PL, F,  F,  WE, _], // row 12
    [ _,  WE, F,  CT, CM, F,  FR, F,  WC, WS, WS, WS, WC, F,  F,  F,  F,  F,  WE, _], // row 13 - kitchen + restroom wall
    [ _,  WE, F,  F,  F,  F,  F,  F,  WE, F,  TS, F,  WE, F,  F,  F,  F,  F,  WE, _], // row 14 - restrooms
    [ _,  WC, WS, WS, WS, WS, WS, WS, WC, WS, WS, WS, WC, WS, WS, WS, WS, WS, WC, _], // row 15 - south wall
];

// NPC spawn positions for the compact layout
export const NPC_POSITIONS = [
    { id: 'teamleder', col: 5, row: 5, type: 'teamleder' },
    { id: 'kollega_møde', col: 10, row: 6, type: 'kollega_moede' },
    { id: 'hr', col: 14, row: 10, type: 'hr' },
    { id: 'f2_superbruger', col: 13, row: 5, type: 'f2_superbruger' },
    { id: 'sekretær', col: 9, row: 3, type: 'sekretaer' },
    { id: 'smalltalk', col: 8, row: 10, type: 'smalltalk' },
    { id: 'rådgiver', col: 5, row: 2, type: 'raadgiver' },
    { id: 'mødedeltager', col: 2, row: 9, type: 'moededeltager' },
    { id: 'kaffe_kollega', col: 4, row: 13, type: 'kaffe' },
    { id: 'toilet_kollega', col: 9, row: 14, type: 'toilet' },
];

// Chief possible spawn locations (spread across the map)
export const CHIEF_SPAWNS = [
    { col: 3, row: 2 },   // Minister area left
    { col: 16, row: 2 },  // Senior office right
    { col: 2, row: 8 },   // Meeting room interior
    { col: 16, row: 6 },  // Far east corridor
    { col: 15, row: 11 }, // Lower office area
];

// Player start position (center of open office)
export const PLAYER_START = { col: 10, row: 8 };

// Points of interest for NPC pathfinding destinations
// These point to walkable floor tiles near the actual objects
export const POINTS_OF_INTEREST = {
    coffee_machine: { col: 5, row: 13 },  // floor next to coffee machine
    printer: { col: 5, row: 6 },          // floor next to printer
    meeting_room: { col: 3, row: 9 },     // door tile (walkable)
    kitchen: { col: 5, row: 13 },
    restroom: { col: 9, row: 14 },        // floor near toilet
    corridor_north: { col: 10, row: 5 },
    corridor_south: { col: 10, row: 10 },
};
