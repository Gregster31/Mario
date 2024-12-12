import Entity from './Entity.js';
import Sprite from '../../lib/Sprite.js';
import { objectSpriteConfig } from '../../config/SpriteConfig.js';
import Tile from '../services/Tile.js';
import { sounds, timer } from '../globals.js';
import Easing from '../../lib/Easing.js';
import Graphic from '../../lib/Graphic.js';
import SoundName from '../enums/SoundName.js';

/**
 * Represents a block in the game world.
 * @extends Entity
 */
export default class Coin extends Entity {
	/**
	 * @param {number} x - The x-coordinate of the coin.
	 * @param {number} y - The y-coordinate of the coin.
	 * @param {Graphic} spriteSheet - The sprite sheet for the block.
	 */
	constructor(x, y, spriteSheet) {
		super(x, y, Tile.SIZE, Tile.SIZE);

        this.spriteSheet = spriteSheet;
        this.sprites = objectSpriteConfig.coin.map(
            (frame) =>
                new Sprite(
                    spriteSheet,
                    frame.x,
                    frame.y,
                    frame.width,
                    frame.height
                )
        );
        this.currentSprite = this.sprites[0];
        this.isCollected = false;
    }

	/**
	 * Renders the coin.
	 */
	render() {
        if (!this.isCollected) {
            this.currentSprite.render(this.position.x, this.position.y);
        }	
    }

    /**
     * Handles the coin being collected.
     * @returns {Promise<boolean>} A promise that resolves to true if the coin was collected, false otherwise.
     */
    async collect() {
        if (!this.isCollected) {
            this.isCollected = true;
            sounds.play(SoundName.Coin);

            // Coin moves just a bit up when collected.
            await timer.tweenAsync(
                this.position,
                { y: this.position.y - 20 },
                0.2,
                Easing.easeOutQuad
            );

            return true;
        }

        return false;
    }
}
