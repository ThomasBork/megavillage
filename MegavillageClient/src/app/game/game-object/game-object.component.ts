import { Component, Input } from '@angular/core';
import { ActionService } from 'src/app/action.service';
import { GameObjectService } from 'src/app/game-object.service';
import { GameService } from 'src/app/game.service';
import { UIGameObject } from 'src/app/ui-game-state/ui-game-object';
import { UIGameObjectPlayer } from 'src/app/ui-game-state/ui-game-object-player';
import { UIGameObjectWithStages } from 'src/app/ui-game-state/ui-game-object-with-stages';
import { GameObjectType } from 'src/shared/game-state/game-object-type';

@Component({
  selector: 'app-game-object',
  templateUrl: './game-object.component.html',
  styleUrls: ['./game-object.component.scss']
})
export class GameObjectComponent {
  @Input()
  public gameObject!: UIGameObject;

  public constructor(
    private gameService: GameService,
    private actionService: ActionService,
    private gameObjectService: GameObjectService,
  ) {}

  public isCurrentTarget(): boolean {
    return this.gameService.getGame().getCurrentTargetObject() === this.gameObject;
  }

  public getBorder(): string {
    const isTarget = this.gameService.getGame().getCurrentTargetObject() === this.gameObject;
    if (isTarget) {
      return '2px dashed lightgrey';
    }
    return '2px solid transparent';
  }

  public isPlayer(): boolean {
    return this.gameObject instanceof UIGameObjectPlayer;
  }

  public isGameObjectWithStages(): boolean {
    return this.gameObject instanceof UIGameObjectWithStages;
  }

  public getPlayer(): UIGameObjectPlayer {
    if (this.gameObject instanceof UIGameObjectPlayer) {
      return this.gameObject;
    } else {
      throw new Error('Expected object to be a player, but it is of type: "' + this.gameObject.getType.toString() + '".');
    }
  }

  public getGameObjectWithStages(): UIGameObjectWithStages {
    if (this.gameObject instanceof UIGameObjectWithStages) {
      return this.gameObject;
    } else {
      throw new Error('Expected object to have stages, but it is of type: "' + this.gameObject.getType.toString() + '".');
    }
  }

  public getImagePath(): string {
    return 'assets/images/' + this.gameObject.getType().toString() + '.png';
  }

  public getZIndex(): number {
    if (this.gameObject instanceof UIGameObjectPlayer) {
      return 1000;
    }
    if (this.gameObject.getIsBlockingMovement()) {
      return 100;
    }
    return 10;
  }

  public shouldImageBeStretchedToEdges(): boolean {
    return this.gameObject.getType() === GameObjectType.water;
  }

  public onClick(): void {
    const player = this.gameService.getCurrentPlayer();
    if (this.isCurrentTarget()) {
      this.actionService.handleGenericActionOnObject(player, this.gameObject);
    } else {
      const xDistanceFromPlayer = this.gameObjectService.calculateDistanceOverlappedOnXAxis(this.gameObject, player.getPosition(), player.getSize());
      const yDistanceFromPlayer = this.gameObjectService.calculateDistanceOverlappedOnYAxis(this.gameObject, player.getPosition(), player.getSize());
      const minOverlappedDistance = Math.min(xDistanceFromPlayer, yDistanceFromPlayer);
      console.log(minOverlappedDistance);
      if (minOverlappedDistance > -10) {
        this.gameService.getGame().setCurrentTargetObject(this.gameObject);
      }
    }
  }
}
