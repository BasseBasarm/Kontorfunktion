import { TYPING_SPEED, LINE_PAUSE } from '../constants.js';
import { DIALOGUE_DATA } from './dialogue-data.js';

export class DialogueSystem {
    constructor() {
        this.state = 'IDLE'; // IDLE, TYPING, WAITING, COMPLETE
        this.currentDialogue = null;
        this.lineIndex = 0;
        this.charIndex = 0;
        this.typingTimer = 0;
        this.waitTimer = 0;
        this.timeCost = 0;
        this.isEnding = false;
        this.npcId = null;
    }

    start(npcType, variant, isFirstEncounter) {
        const data = DIALOGUE_DATA[npcType];
        if (!data) return false;

        const variantData = data[variant];
        if (!variantData) return false;

        // Prepend player introduction only on the very first coworker encounter
        let lines = variantData.lines;
        if (isFirstEncounter && npcType !== 'chief') {
            lines = [
                { speaker: 'Dig', text: 'Jeg har en skarp deadline og mangler feedback på et notat i F2.' },
                ...lines,
            ];
        }

        this.currentDialogue = lines;
        this.timeCost = variantData.timeCost;
        this.timeBonus = variantData.timeBonus || 0;
        this.isEnding = !!variantData.isEnding;
        this.lineIndex = 0;
        this.charIndex = 0;
        this.typingTimer = 0;
        this.waitTimer = 0;
        this.state = 'TYPING';
        this.npcId = npcType;

        return true;
    }

    update(dt) {
        if (this.state === 'TYPING') {
            this.typingTimer += dt;
            const line = this.currentDialogue[this.lineIndex];
            const targetChars = Math.floor(this.typingTimer / TYPING_SPEED);

            if (targetChars >= line.text.length) {
                this.charIndex = line.text.length;
                this.state = 'WAITING';
                this.waitTimer = 0;
            } else {
                this.charIndex = targetChars;
            }
        } else if (this.state === 'WAITING') {
            this.waitTimer += dt;
            if (this.waitTimer >= LINE_PAUSE) {
                this.advanceLine();
            }
        }
    }

    // Allow skipping current line with keypress
    skipOrAdvance() {
        if (this.state === 'TYPING') {
            // Complete current line immediately
            this.charIndex = this.currentDialogue[this.lineIndex].text.length;
            this.state = 'WAITING';
            this.waitTimer = 0;
        } else if (this.state === 'WAITING') {
            this.advanceLine();
        }
    }

    advanceLine() {
        this.lineIndex++;
        if (this.lineIndex >= this.currentDialogue.length) {
            this.state = 'COMPLETE';
        } else {
            this.charIndex = 0;
            this.typingTimer = 0;
            this.state = 'TYPING';
        }
    }

    isComplete() {
        return this.state === 'COMPLETE';
    }

    isActive() {
        return this.state !== 'IDLE' && this.state !== 'COMPLETE';
    }

    getCurrentLine() {
        if (!this.currentDialogue || this.lineIndex >= this.currentDialogue.length) {
            return null;
        }
        const line = this.currentDialogue[this.lineIndex];
        return {
            speaker: line.speaker,
            text: line.text.substring(0, this.charIndex),
            fullText: line.text,
            isComplete: this.charIndex >= line.text.length,
        };
    }

    getTimeCost() {
        return this.timeCost;
    }

    getTimeBonus() {
        return this.timeBonus;
    }

    reset() {
        this.state = 'IDLE';
        this.currentDialogue = null;
        this.lineIndex = 0;
        this.charIndex = 0;
        this.isEnding = false;
        this.timeBonus = 0;
        this.npcId = null;
    }
}
