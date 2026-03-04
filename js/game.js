import { STATE, CANVAS_WIDTH, CANVAS_HEIGHT, CAMERA_SCALE, INTERACTION_DISTANCE, CHIEF_RELOCATE_TIME, CHIEF_RELOCATE_NPC_COUNT, TIMER_WARNING, TIMER_CRITICAL } from './constants.js';
import { gridDistance } from './utils.js';
import { cartToIso } from './utils.js';
import { Tilemap } from './map/tilemap.js';
import { MapRenderer } from './map/renderer.js';
import { Player } from './entities/player.js';
import { NPCSpawner } from './entities/npc-spawner.js';
import { Input } from './input.js';
import { Timer } from './timer.js';
import { DialogueSystem } from './dialogue/dialogue-system.js';
import { DialogueRenderer } from './dialogue/dialogue-renderer.js';
import { HUD } from './ui/hud.js';
import { TitleScreen } from './ui/title-screen.js';
import { EndScreen } from './ui/end-screen.js';
import { AudioManager } from './audio/audio-manager.js';
import { PLAYER_START } from './map/office-layout.js';
import { MicroEvents } from './events/micro-events.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = STATE.TITLE;
        this.lastTime = 0;

        // Camera
        this.camera = {
            x: 0,
            y: 0,
            offsetX: CANVAS_WIDTH / 2,
            offsetY: CANVAS_HEIGHT * 0.45,
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
        };

        // Core systems
        this.tilemap = new Tilemap();
        this.mapRenderer = new MapRenderer(this.tilemap);
        this.input = new Input();
        this.timer = new Timer();
        this.dialogueSystem = new DialogueSystem();
        this.dialogueRenderer = new DialogueRenderer();
        this.hud = new HUD();
        this.titleScreen = new TitleScreen();
        this.endScreen = new EndScreen();
        this.audio = new AudioManager();
        this.npcSpawner = new NPCSpawner();
        this.microEvents = new MicroEvents();

        // Game state
        this.player = null;
        this.npcs = [];
        this.variantRound = 0; // 0=A, 1=B — alternates between runs
        this.dialoguesCompleted = 0;
        this.lastTickSecond = -1;

        // Pre-calculate elevated objects for z-sorting
        this.elevatedObjects = this.mapRenderer.getElevatedObjects();

        // Start title screen
        this.titleScreen.activate(canvas);
    }

    start() {
        requestAnimationFrame((t) => this.loop(t));
    }

    loop(timestamp) {
        const dt = this.lastTime ? Math.min(timestamp - this.lastTime, 50) : 16;
        this.lastTime = timestamp;

        try {
            this.update(dt);
            this.render();
        } catch (e) {
            console.error('Game loop error:', e);
        }

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        switch (this.state) {
            case STATE.TITLE:
                this.titleScreen.update(dt);
                if (this.titleScreen.isReady()) {
                    this.startGame(this.titleScreen.getHairStyle());
                }
                break;

            case STATE.PLAYING:
                this.timer.update(dt);
                this.player.update(dt, this.input, this.tilemap);
                for (const npc of this.npcs) npc.update(dt, this.tilemap);
                this.microEvents.update(dt, this.npcs, this.tilemap);
                this.updateCamera();
                this.checkNPCCollisions();
                this.checkTimerTick();
                if (this.timer.isExpired()) {
                    this.enterState(STATE.FAILURE);
                }
                break;

            case STATE.DIALOGUE:
                this.timer.update(dt);
                this.dialogueSystem.update(dt);
                for (const npc of this.npcs) npc.update(dt, this.tilemap);
                // Allow space/enter to advance dialogue
                if (this.input.wasPressed(' ') || this.input.wasPressed('Enter')) {
                    this.dialogueSystem.skipOrAdvance();
                }
                if (this.dialogueSystem.isComplete()) {
                    this.onDialogueComplete();
                }
                if (this.timer.isExpired()) {
                    this.dialogueSystem.reset();
                    this.enterState(STATE.FAILURE);
                }
                break;

            case STATE.SUCCESS:
                this.endScreen.update(dt);
                if (this.endScreen.isReady()) {
                    this.returnToTitle();
                }
                break;

            case STATE.FAILURE:
                this.endScreen.update(dt);
                if (this.endScreen.isReady()) {
                    this.returnToTitle();
                }
                break;
        }

        this.input.clearJustPressed();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Dark background
        ctx.fillStyle = '#1C1810';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        switch (this.state) {
            case STATE.TITLE:
                this.titleScreen.render(ctx);
                break;

            case STATE.PLAYING:
            case STATE.DIALOGUE:
                this.renderGameWorld(ctx);
                this.hud.render(ctx, this.timer);
                if (this.state === STATE.DIALOGUE) {
                    this.dialogueRenderer.render(ctx, this.dialogueSystem);
                }
                break;

            case STATE.SUCCESS:
                this.endScreen.renderSuccess(ctx);
                break;

            case STATE.FAILURE:
                this.endScreen.renderFailure(ctx);
                break;
        }
    }

    renderGameWorld(ctx) {
        // Apply camera zoom
        ctx.save();
        ctx.scale(CAMERA_SCALE, CAMERA_SCALE);

        // Create scaled camera for world rendering
        const scaledCamera = {
            x: this.camera.x,
            y: this.camera.y,
            offsetX: CANVAS_WIDTH / (2 * CAMERA_SCALE),
            offsetY: (CANVAS_HEIGHT * 0.45) / CAMERA_SCALE,
            width: CANVAS_WIDTH / CAMERA_SCALE,
            height: CANVAS_HEIGHT / CAMERA_SCALE,
        };

        // Ground pass
        this.mapRenderer.renderGround(ctx, scaledCamera);

        // Warm lighting overlay
        this.mapRenderer.renderLighting(ctx, scaledCamera);

        // Build sorted list of all elevated objects + entities
        const drawList = [];

        // Elevated tiles
        for (const obj of this.elevatedObjects) {
            drawList.push({
                row: obj.row,
                col: obj.col,
                depth: obj.row + obj.col * 0.001,
                type: 'tile',
                tile: obj.tile,
            });
        }

        // Player
        drawList.push({
            row: this.player.row,
            col: this.player.col,
            depth: this.player.row + this.player.col * 0.001,
            type: 'player',
        });

        // NPCs
        for (const npc of this.npcs) {
            drawList.push({
                row: npc.row,
                col: npc.col,
                depth: npc.row + npc.col * 0.001,
                type: 'npc',
                npc: npc,
            });
        }

        // Sort by depth (back to front)
        drawList.sort((a, b) => a.depth - b.depth);

        // Render in order
        for (const item of drawList) {
            switch (item.type) {
                case 'tile':
                    this.mapRenderer.renderElevated(ctx, item.col, item.row, item.tile, scaledCamera);
                    break;
                case 'player':
                    this.player.render(ctx, scaledCamera);
                    break;
                case 'npc':
                    item.npc.render(ctx, scaledCamera);
                    break;
            }
        }

        // Micro-events overlay (speech bubbles, alerts)
        this.microEvents.render(ctx, scaledCamera);

        ctx.restore();
    }

    updateCamera() {
        // Camera follows player smoothly
        const target = cartToIso(this.player.col, this.player.row);
        this.camera.x += (target.x - this.camera.x) * 0.08;
        this.camera.y += (target.y - this.camera.y) * 0.08;
    }

    checkNPCCollisions() {
        for (const npc of this.npcs) {
            if (npc.hasInteracted) continue;

            const dist = gridDistance(this.player.col, this.player.row, npc.col, npc.row);
            if (dist <= INTERACTION_DISTANCE) {
                this.startDialogue(npc);
                break;
            }
        }
    }

    startDialogue(npc) {
        const variant = this.variantRound === 0 ? 'A' : 'B';
        const started = this.dialogueSystem.start(npc.type, variant);
        if (started) {
            npc.hasInteracted = true;
            this.state = STATE.DIALOGUE;
            this.dialoguesCompleted++;

            // Check if chief should relocate
            if (!this.npcSpawner.chiefHasRelocated) {
                const timeElapsed = (239 * 1000 - this.timer.remaining) / 1000;
                if (this.dialoguesCompleted >= CHIEF_RELOCATE_NPC_COUNT || timeElapsed >= CHIEF_RELOCATE_TIME) {
                    this.npcSpawner.relocateChief();
                }
            }
        }
    }

    onDialogueComplete() {
        const timeCost = this.dialogueSystem.getTimeCost();
        const isEnding = this.dialogueSystem.isEnding;

        if (timeCost > 0) {
            this.timer.deduct(timeCost);
        }

        this.dialogueSystem.reset();

        if (isEnding) {
            this.enterState(STATE.SUCCESS);
        } else {
            this.state = STATE.PLAYING;
        }
    }

    checkTimerTick() {
        const sec = this.timer.getSeconds();
        if (sec !== this.lastTickSecond && sec <= 60) {
            this.lastTickSecond = sec;
            if (sec <= 30) {
                this.audio.playTick();
            } else if (sec % 2 === 0) {
                this.audio.playTick();
            }
        }
    }

    startGame(hairStyle) {
        this.titleScreen.deactivate();

        // Init audio on user gesture
        this.audio.init();
        this.audio.resume();
        this.audio.startAmbience();

        // Create player
        this.player = new Player(PLAYER_START.col, PLAYER_START.row, hairStyle);

        // Spawn NPCs
        this.npcs = this.npcSpawner.spawn(this.variantRound);

        // Reset state
        this.dialoguesCompleted = 0;
        this.lastTickSecond = -1;
        this.timer.start();
        this.dialogueSystem.reset();

        // Center camera on player
        const target = cartToIso(this.player.col, this.player.row);
        this.camera.x = target.x;
        this.camera.y = target.y;

        this.state = STATE.PLAYING;
    }

    enterState(newState) {
        this.state = newState;
        if (newState === STATE.SUCCESS || newState === STATE.FAILURE) {
            this.audio.stopTickTimer();
            this.endScreen.activate(this.canvas);
        }
    }

    returnToTitle() {
        this.endScreen.deactivate();
        this.variantRound = (this.variantRound + 1) % 2; // Alternate variants
        this.state = STATE.TITLE;
        this.titleScreen = new TitleScreen();
        this.titleScreen.activate(this.canvas);
    }
}
