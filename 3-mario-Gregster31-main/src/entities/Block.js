import Entity from './Entity.js';
import Sprite from '../../lib/Sprite.js';
import { objectSpriteConfig } from '../../config/SpriteConfig.js';
import Tile from '../services/Tile.js';
import { sounds, timer, images } from '../globals.js';
import Easing from '../../lib/Easing.js';
import Graphic from '../../lib/Graphic.js';
import SoundName from '../enums/SoundName.js';
import ImageName from '../enums/ImageName.js';
import Coin from '../entities/Coin.js'
import Mushroom from './Mushroom.js';


/**
 * Represents a block in the game world.
 * @extends Entity
 */
export default class Block extends Entity {
	/**
	 * @param {number} x - The x-coordinate of the block.
	 * @param {number} y - The y-coordinate of the block.
	 * @param {Graphic} spriteSheet - The sprite sheet for the block.
	 */
	constructor(x, y, spriteSheet, item = "coin") {
		super(x, y, Tile.SIZE, Tile.SIZE);

		this.spriteSheet = spriteSheet;
		this.sprites = objectSpriteConfig.block.map(
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
		this.isHit = false;
		this.item = item;
	}

	/**
	 * Renders the block.
	 */
	render() {
		this.currentSprite.render(this.position.x, this.position.y);
	}

	/**
	 * Handles the block being hit.
	 * @returns {Promise<boolean>} A promise that resolves to true if the block was hit, false otherwise.
	 */
	async hit(map) {
		if (!this.isHit) {
			this.isHit = true;
			sounds.play(SoundName.Bump);

			await timer.tweenAsync(
				this.position,
				{ y: this.position.y - 5 },
				0.1,
				Easing.easeInOutQuad
			);
			await timer.tweenAsync(
				this.position,
				{ y: this.position.y + 5 },
				0.1,
				Easing.easeInOutQuad
			);

			this.currentSprite = this.sprites[1];

			if (this.item == "mushroom") {
				let mush = new Mushroom(
					this.position.x, 
					this.position.y - 16, 
					map.tileSize, 
					map.tileSize, 
					images.get(ImageName.Tiles), 
					map
				);

				map.mushrooms.push(mush);

				sounds.play(SoundName.SproutItem);			
			}
			else {
				// Create a coin and add it to the map coins array
				let coin = new Coin(
					this.position.x, 
					this.position.y - 16, 
					images.get(ImageName.Tiles)
				);

				map.coins.push(coin);

				sounds.play(SoundName.Coin);

				await timer.tweenAsync(
					coin.position,
					{ y: this.position.y - 50 },
					0.1,
					Easing.easeInOutQuad
				);

				//Remove the coin after short amount of time
				setTimeout(() => {
					map.coins = map.coins.filter((c) => c !== coin);
				}, 300);
			}

			return true;
		}

		return false;
	}
}
