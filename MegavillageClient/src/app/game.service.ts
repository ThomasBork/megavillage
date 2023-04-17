import { Injectable } from '@angular/core';
import { UIGame } from './ui-game-state/ui-game';
import { UIGameObject } from './ui-game-state/ui-game-object';
import { Vector2 } from 'src/shared/game-state/vector2';
import { GameObjectService } from './game-object.service';
import { VectorService } from './vector.service';
import { UIGameObjectPlayer } from './ui-game-state/ui-game-object-player';
import { Subject } from 'rxjs';
import { UIGameStateBuilderService } from './ui-game-state/ui-game-state-builder.service';
import { Game } from 'src/shared/game-state/game';
import { PlayerActionType } from 'src/shared/game-state/player-action-type';
import { GameResource } from 'src/shared/game-state/game-resource';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private game?: UIGame;
  public onGameStateReceived: Subject<UIGame>;
  
  public constructor(
    private gameObjectService: GameObjectService,
    private vectorService: VectorService,
    private uiGameStateBuilderService: UIGameStateBuilderService,
  ) { 
    this.onGameStateReceived = new Subject<UIGame>();
  }
  
  public setGame(serverState: Game): void {
    this.game = this.uiGameStateBuilderService.build(serverState);
    this.onGameStateReceived.next(this.game);
  }

  public getGame(): UIGame {
    if (!this.game) {
      throw new Error('Game not set yet.');
    }
    return this.game;
  }

  public getGameObject(id: number): UIGameObject {
    const gameObject = this.getGame().getGameObjects().find(g => g.getId() === id);
    if (!gameObject) {
      throw new Error('Game object could not be found. Id: "' + id + '".');
    }
    return gameObject;
  }

  public getPlayer(id: number): UIGameObjectPlayer {
    const gameObject = this.getGameObject(id);
    if (gameObject instanceof UIGameObjectPlayer) {
      return gameObject;
    }
    throw new Error('Game object was not a player. Id: "' + id + '".');
  }

  public getCurrentPlayer(): UIGameObjectPlayer {
    return this.getGame().getCurrentPlayer();
  }

  public hasResources(resources: GameResource[]): boolean {
    return resources.every((resource) => {
      const gameResource = this.getGame().getResources().find((r) => r.resourceType === resource.resourceType);
      return gameResource && gameResource.quantity >= resource.quantity;
    });
  }
  
  public updateCurrentTargetObject(): void {
    const game = this.getGame();
    const currentPlayer = game.getCurrentPlayer();
    const targetPoint: Vector2 = {
      x: currentPlayer.getPosition().x + currentPlayer.getSize().x * 3 / 4 * game.getMovementDirection().x,
      y: currentPlayer.getPosition().y + currentPlayer.getSize().y * 3 / 4 * game.getMovementDirection().y,
    };
    const targetAreaSize = this.vectorService.multiplyVector(currentPlayer.getSize(), 2);
    const possibleTargets = game.getGameObjects()
      .filter((o) => o !== currentPlayer)
      .filter((o) => this.getAvailableActionTypesOnTarget(currentPlayer, o).length > 0)
      .filter((o) => this.gameObjectService.doesAreaOverlapWithGameObject(o, targetPoint, targetAreaSize));
    let target: UIGameObject | undefined = undefined;
    let leastDistanceFromTargetPoint: number = Infinity;
    for (const possibleTarget of possibleTargets) {
      const distanceFromTargetPoint = this.vectorService.getDistance(possibleTarget.getPosition(), targetPoint);
      if (distanceFromTargetPoint < leastDistanceFromTargetPoint) {
        target = possibleTarget;
        leastDistanceFromTargetPoint = distanceFromTargetPoint;
      }
    }
    game.setCurrentTargetObject(target);
  }
  
  private getAvailableActionTypesOnTarget(performingPlayer: UIGameObjectPlayer, targetGameObject: UIGameObject): PlayerActionType[] {
    return performingPlayer.getAvailableActions()
      .filter((a) => a.targetType === targetGameObject.getType())
      .map((a) => a.actionType);
  }
}
