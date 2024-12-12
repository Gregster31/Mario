import Entity from './Entity.js';
import Animation from '../../lib/Animation.js';
import { objectSpriteConfig } from '../../config/SpriteConfig.js';
import Sprite from '../../lib/Sprite.js';
import Tile from '../services/Tile.js';
import Graphic from '../../lib/Graphic.js';
import Map from '../services/Map.js';
import Player from './player/Player.js';
import { sounds } from '../globals.js';
import SoundName from '../enums/SoundName.js';
import PlayerStateName from '../enums/PlayerStateName.js';


/**
 * Represents a Mushroom powerup in the game.
 * @extends Entity
 */
export default class Mushroom extends Entity {
	/**
	 * Creates a new Goomba instance.
	 * @param {number} x - The initial x-coordinate.
	 * @param {number} y - The initial y-coordinate.
	 * @param {number} width - The width of the Goomba.
	 * @param {number} height - The height of the Goomba.
	 * @param {Graphic} spriteSheet - The sprite sheet containing Mushroom graphics.
	 * @param {Map} map - The game map instance.
	 */
	constructor(x, y, width, height, spriteSheet, map) {
		super(x, y, width, height);
        this.map = map; 
        this.speed = 30; 
        this.direction = 1; // 1 for right, -1 for left
        this.gravity = 800; 
        this.verticalSpeed = 0;
        this.isAlive = true; 
        this.flickerStartTime = null;
        this.flickerDuration = 2000; 
        this.lifetime = 6000; 

        // Load the sprite frames for the mushroom
        this.sprites = objectSpriteConfig.mushroom.map(
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
        this.startTimers();
	}

	/**
	 * Updates the Goomba's state.
	 * @param {number} dt - The time passed since the last update.
	 */
	update(dt) {
		this.updateMovement(dt);
	}

	/**
	 * Updates the Goomba's movement.
	 * @param {number} dt - The time passed since the last update.
	 */
	updateMovement(dt) {
		// Apply gravity
		this.verticalSpeed += this.gravity * dt;
		this.position.y += this.verticalSpeed * dt;

		// Move horizontally
		this.position.x += this.direction * this.speed * dt;

		// Check for collisions
		this.checkCollisions();
	}

	/**
	 * Checks for collisions with the environment.
	 */
	checkCollisions() {
		// Check ground collision
		if (this.onGround()) {
			this.position.y =
				Math.floor(this.position.y / Tile.SIZE) * Tile.SIZE;
			this.verticalSpeed = 0;
		}

		// Check wall collision
		if (this.isCollidingWithWall()) {
			this.direction *= -1; // Reverse direction
		}
	}

	/**
	 * Checks if the Goomba is on the ground.
	 * @returns {boolean} True if the Goomba is on the ground, false otherwise.
	 */
	onGround() {
		const bottomTile = Math.floor(
			(this.position.y + this.dimensions.y) / Tile.SIZE
		);
		const leftTile = Math.floor(this.position.x / Tile.SIZE);
		const rightTile = Math.floor(
			(this.position.x + this.dimensions.x - 1) / Tile.SIZE
		);

		return (
			this.map.isSolidTileAt(leftTile, bottomTile) ||
			this.map.isSolidTileAt(rightTile, bottomTile)
		);
	}

	/**
	 * Checks if the Goomba is colliding with a wall.
	 * @returns {boolean} True if the Goomba is colliding with a wall, false otherwise.
	 */
	isCollidingWithWall() {
		const topTile = Math.floor(this.position.y / Tile.SIZE);
		const bottomTile = Math.floor(
			(this.position.y + this.dimensions.y - 1) / Tile.SIZE
		);
		const sideTile = Math.floor(
			(this.position.x + (this.direction > 0 ? this.dimensions.x : 0)) /
				Tile.SIZE
		);

		return (
			this.map.isSolidTileAt(sideTile, topTile) ||
			this.map.isSolidTileAt(sideTile, bottomTile)
		);
	}

	startTimers() {
        setTimeout(() => {
            this.flickerStartTime = Date.now();
        }, this.lifetime);

        setTimeout(() => {
            this.isAlive = false; 
            this.map.mushrooms = this.map.mushrooms.filter(mush => mush !== this);
        }, this.lifetime + this.flickerDuration);
    }

    render(context) {
        if (!this.isAlive) 
            return;

        if (this.flickerStartTime) {
            const currentTime = Date.now();
            if (currentTime - this.flickerStartTime < this.flickerDuration) {
                context.globalAlpha = (Math.floor(currentTime / 100) % 2 === 0) ? 0.5 : 1; 
            } else {
                context.globalAlpha = 1; 
            }
        } else {
            context.globalAlpha = 1;
        }

        this.currentSprite.render(this.position.x, this.position.y);
        context.globalAlpha = 1;
    }


	/**
	 * Handles collision with the player.
	 * @param {Player} player - The player instance.
	 */
	onCollideWithPlayer(player) {
		this.isAlive = false;
	}
}
