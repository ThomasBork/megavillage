import { Component, Input } from '@angular/core';
import { UIGameObjectPlayer } from 'src/app/ui-game-state/ui-game-object-player';
import { PlayerAction } from 'src/shared/game-state/player-action';
import { PlayerActionType } from 'src/shared/game-state/player-action-type';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  @Input() 
  public player!: UIGameObjectPlayer;

  public currentAnimationTimePassed: number;

  public constructor() {
    this.currentAnimationTimePassed = 0;
  }

  public isPerformingAction(): boolean {
    return this.player.getAction() !== null;
  }

  public getActionAnimationFolderPath(): string {
    const action = this.getAction();
    return 'player/' + action.type.toString() + '/';
  }

  public getActionAnimationImageCount(): number {
    switch (this.getAction().type) {
      case PlayerActionType.chop: return 2;
      default: throw new Error ('No animation image count set for action type: "' + this.getAction().type.toString() + '".');
    }
  }

  public getActionAnimationMaxDuration(): number {
    switch (this.getAction().type) {
      case PlayerActionType.chop: return 500;
      default: throw new Error ('No animation image count set for action type: "' + this.getAction().type.toString() + '".');
    }
  }

  public getImagePath(): string {
    return 'assets/images/' + this.player.getType().toString() + '.png';
  }

  public isFlippedHorizontally(): boolean {
    return this.player.lastNonzeroMovement !== null
      && this.player.lastNonzeroMovement.x > 0;
  }

  private getAction(): PlayerAction {
    const action = this.player.getAction();
    if (action === null) {
      throw new Error('Cannot get action animation path when there is no action.');
    }
    return action;
  }
}
