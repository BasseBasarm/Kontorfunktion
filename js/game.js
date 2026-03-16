import { STATE, CANVAS_WIDTH, CANVAS_HEIGHT, INTERNAL_WIDTH, INTERNAL_HEIGHT, PIXEL_SCALE, INTERACTION_DISTANCE, CHIEF_RELOCATE_TIME, CHIEF_RELOCATE_NPC_COUNT, TIMER_WARNING, TIMER_CRITICAL } from './constants.js';
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
        this.ctx.imageSmoothingEnabled = false;

        this.state = STATE.TITLE;
        this.lastTime = 0;

        // Camera (uses logical viewport at INTERNAL resolution)
        this.camera = {
            x: 0,
            y: 0,
            offsetX: INTERNAL_WIDTH / 2,
            offsetY: INTERNAL_HEIGHT * 0.45,
            width: INTERNAL_WIDTH,
            height: INTERNAL_HEIGHT,
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
        this.currentDialogueNPC = null;
        this.lastTickSecond = -1;
        this.chiefSpawned = false;

        // Intro message overlay
        this.introTimer = 0;
        this.introDuration = 5000; // 5 seconds total
        this.introFadeStart = 3500; // start fading at 3.5s
        this.showIntro = false;

        // Pre-calculate elevated objects for z-sorting
        this.elevatedObjects = this.mapRenderer.getElevatedObjects();

        // Attach canvas for touch input + camera for screen-to-world
        this.input.attachCanvas(canvas);
        this.input.setCamera(this.camera);

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
                if (this.showIntro) {
                    this.introTimer += dt;
                    if (this.introTimer >= this.introDuration) {
                        this.showIntro = false;
                    }
                }
                this.timer.update(dt);
                this.player.update(dt, this.input, this.tilemap);
                for (const npc of this.npcs) npc.update(dt, this.tilemap);
                this.microEvents.update(dt, this.npcs, this.tilemap);
                this.updateCamera();
                this.checkNPCCollisions();
                this.checkChiefSpawn();
                this.checkTimerTick();
                if (this.timer.isExpired()) {
                    this.enterState(STATE.FAILURE);
                }
                break;

            case STATE.DIALOGUE:
                this.timer.update(dt);
                this.dialogueSystem.update(dt);
                for (const npc of this.npcs) npc.update(dt, this.tilemap);
                // Allow space/enter/tap to advance dialogue
                if (this.input.wasPressed(' ') || this.input.wasPressed('Enter') || this.input.wasTapped()) {
                    this.dialogueSystem.skipOrAdvance();
                }
                if (this.dialogueSystem.isComplete()) {
                    this.onDialogueComplete();
                }
                if (this.timer.isExpired()) {
                    if (this.currentDialogueNPC) {
                        this.currentDialogueNPC.inDialogue = false;
                        this.currentDialogueNPC = null;
                    }
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

        // Clear canvas
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = '#14100A';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        switch (this.state) {
            case STATE.TITLE:
                this.titleScreen.render(ctx);
                break;

            case STATE.PLAYING:
            case STATE.DIALOGUE:
                // Game world renders at 2x zoom (logical viewport = INTERNAL_WIDTH×HEIGHT)
                ctx.save();
                ctx.scale(PIXEL_SCALE, PIXEL_SCALE);
                this.renderGameWorld(ctx);
                ctx.restore();

                // UI overlays render at native resolution (crisp text)
                this.hud.render(ctx, this.timer);
                if (this.state === STATE.DIALOGUE) {
                    this.dialogueRenderer.render(ctx, this.dialogueSystem);
                }
                if (this.showIntro) {
                    this.renderIntroMessage(ctx);
                }
                break;

            case STATE.SUCCESS:
                this.endScreen.renderSuccess(ctx);
                break;

            case STATE.FAILURE:
                this.endScreen.renderFailure(ctx);
                break;
        }

        // Touch controls render at native resolution
        if (this.state === STATE.PLAYING || this.state === STATE.DIALOGUE) {
            this.hud.renderTouchControls(ctx, this.input);
        }
    }

    renderGameWorld(ctx) {
        const camera = {
            x: Math.round(this.camera.x),
            y: Math.round(this.camera.y),
            offsetX: INTERNAL_WIDTH / 2,
            offsetY: Math.round(INTERNAL_HEIGHT * 0.45),
            width: INTERNAL_WIDTH,
            height: INTERNAL_HEIGHT,
        };

        // Ground pass
        this.mapRenderer.renderGround(ctx, camera);

        // Warm lighting overlay
        this.mapRenderer.renderLighting(ctx, camera);

        // Wall-mounted signs
        this.mapRenderer.renderSigns(ctx, camera);

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
                    this.mapRenderer.renderElevated(ctx, item.col, item.row, item.tile, camera);
                    break;
                case 'player':
                    this.player.render(ctx, camera);
                    break;
                case 'npc':
                    item.npc.render(ctx, camera);
                    break;
            }
        }

        // Micro-events overlay (speech bubbles, alerts)
        this.microEvents.render(ctx, camera);
    }

    updateCamera() {
        // Event-driven camera pan override
        const panTarget = this.microEvents.getCameraPanTarget();
        const lerpFactor = panTarget ? 0.04 : 0.08;
        const col = panTarget ? panTarget.col : this.player.col;
        const row = panTarget ? panTarget.row : this.player.row;

        const target = cartToIso(col, row);
        this.camera.x += (target.x - this.camera.x) * lerpFactor;
        this.camera.y += (target.y - this.camera.y) * lerpFactor;
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
        const variant = Math.random() < 0.5 ? 'A' : 'B';
        const isFirst = this.dialoguesCompleted === 0;
        const started = this.dialogueSystem.start(npc.type, variant, isFirst);
        if (started) {
            npc.hasInteracted = true;
            npc.inDialogue = true;
            this.currentDialogueNPC = npc;
            this.state = STATE.DIALOGUE;
            this.dialoguesCompleted++;
            this.audio.playDialogueStart();
            this.input.clearTouchTarget();
        }
    }

    onDialogueComplete() {
        const timeCost = this.dialogueSystem.getTimeCost();
        const timeBonus = this.dialogueSystem.getTimeBonus();
        const isEnding = this.dialogueSystem.isEnding;

        if (timeCost > 0) {
            this.timer.deduct(timeCost);
        }
        if (timeBonus > 0) {
            this.timer.add(timeBonus);
        }

        // Release NPC from dialogue freeze
        if (this.currentDialogueNPC) {
            this.currentDialogueNPC.inDialogue = false;
            this.currentDialogueNPC = null;
        }

        this.dialogueSystem.reset();

        if (isEnding) {
            this.enterState(STATE.SUCCESS);
        } else {
            this.state = STATE.PLAYING;
        }
    }

    checkChiefSpawn() {
        // Spawn the chief in the final 30-45 seconds
        if (!this.chiefSpawned && this.timer.getSeconds() <= this.chiefSpawnThreshold) {
            this.chiefSpawned = true;
            this.npcSpawner.spawnChief();
        }
    }

    checkTimerTick() {
        const sec = this.timer.getSeconds();
        if (sec !== this.lastTickSecond && sec <= 60) {
            this.lastTickSecond = sec;
            if (sec <= 10) {
                this.audio.playTick();
            } else if (sec <= 30 && sec % 2 === 0) {
                this.audio.playTick();
            } else if (sec % 5 === 0) {
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

        // Connect audio and player to micro-events
        this.microEvents.setAudio(this.audio);

        // Create player
        this.player = new Player(PLAYER_START.col, PLAYER_START.row, hairStyle);
        this.microEvents.setPlayer(this.player);

        // Spawn NPCs
        this.npcs = this.npcSpawner.spawn(this.variantRound);

        // Reset state
        this.dialoguesCompleted = 0;
        this.currentDialogueNPC = null;
        this.chiefSpawned = false;
        this.chiefSpawnThreshold = 30 + Math.floor(Math.random() * 16); // 30-45 seconds remaining
        this.lastTickSecond = -1;
        this.timer.start();
        this.dialogueSystem.reset();

        // Center camera on player
        const target = cartToIso(this.player.col, this.player.row);
        this.camera.x = target.x;
        this.camera.y = target.y;

        this.showIntro = true;
        this.introTimer = 0;
        this.state = STATE.PLAYING;
    }

    renderIntroMessage(ctx) {
        let alpha = 1;
        if (this.introTimer > this.introFadeStart) {
            alpha = 1 - (this.introTimer - this.introFadeStart) / (this.introDuration - this.introFadeStart);
        }
        if (this.introTimer < 400) {
            alpha = Math.min(alpha, this.introTimer / 400);
        }

        // Dark overlay (renders at native resolution)
        ctx.fillStyle = `rgba(10, 8, 6, ${0.7 * alpha})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cy = CANVAS_HEIGHT / 2;
        const cx = CANVAS_WIDTH / 2;

        // Background box
        ctx.fillStyle = `rgba(30, 26, 20, ${0.85})`;
        ctx.fillRect(cx - 220, cy - 50, 440, 110);
        ctx.strokeStyle = `rgba(200, 168, 130, 0.4)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 220, cy - 50, 440, 110);

        // Main message
        ctx.font = 'bold 24px "Courier New", monospace';
        ctx.fillStyle = '#F5E6C8';
        ctx.fillText('Find din kontorchef', cx, cy - 16);
        ctx.fillText('inden børnehaven lukker', cx, cy + 16);

        // Timer hint
        ctx.font = '14px "Courier New", monospace';
        ctx.fillStyle = '#A89070';
        ctx.fillText('Du har 2 minutter og 59 sekunder', cx, cy + 46);

        ctx.restore();
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
