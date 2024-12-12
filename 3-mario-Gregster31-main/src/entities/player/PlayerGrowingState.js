import PlayerState from './PlayerState.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import Player from './Player.js';
import {timer, images, sounds} from "../../globals.js"
import SoundName from '../../enums/SoundName.js';



/**
 * Represents the falling state of the player.
 * @extends PlayerState
 */
export default class PlayerGrowingState extends PlayerState {
	/**
	 * Creates a new PlayerGrowingState instance.
	 * @param {Player} player - The player object.
	 */
	constructor(player) {
		super(player);
	}

	/**
	 * Called when entering the growing state.
	 */
	async enter() {
		this.player.currentAnimation = this.player.animations.grow;
		sounds.play(SoundName.Powerup);
		
		this.player.dimensions.y *= 1.3;
		await this.wait();

		this.player.stateMachine.change(PlayerStateName.Idling);
	}

	
	/**
	 * Updates the growing state.
	 * @param {number} dt - The time passed since the last update.
	*/
	update(dt) {
		super.update(dt);
	}
	
	async wait() {
		await timer.wait(0.7);
	}
}
