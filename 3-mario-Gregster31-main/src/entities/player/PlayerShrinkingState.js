import PlayerState from './PlayerState.js';
import { input, timer, sounds } from '../../globals.js';
import PlayerStateName from '../../enums/PlayerStateName.js';
import SoundName from '../../enums/SoundName.js';

export default class PlayerShrinkingState extends PlayerState {

    constructor(player) {
        super(player);
    }

    async enter() {
        this.player.currentAnimation = this.player.animations.shrink;
        sounds.play(SoundName.Pipe);
        await this.wait();
        this.player.dimensions.y /= 1.3;
        this.player.stateMachine.change(PlayerStateName.Idling);
    }
    
    update(dt) {
        super.update(dt);
    }
    
    async wait(){
        await timer.wait(0.7);
    }
}