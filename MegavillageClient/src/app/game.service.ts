import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from 'src/shared/game-state/game';
import { UIGame } from './ui-game-state/ui-game';
import { UIGameStateBuilderService } from './ui-game-state/ui-game-state-builder.service';
import { UIGameObject } from './ui-game-state/ui-game-object';
import { Vector2 } from 'src/shared/game-state/vector2';
import { GameObjectService } from './game-object.service';
import { VectorService } from './vector.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private game?: UIGame;
  public onGameStateReceived: Subject<UIGame>;
  public constructor(
    private uiGameStateBuilderService: UIGameStateBuilderService,
    private gameObjectService: GameObjectService,
    private vectorService: VectorService,
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
      .filter((o) => this.gameObjectService.doesAreaOverlapWithGameObject(o, targetPoint, targetAreaSize));
    console.log('Movement direction', game.getMovementDirection());
    console.log('Player point', currentPlayer.getPosition(), 'Target point', targetPoint);
    console.log('Possible targets', possibleTargets.map((o) => o.getId()));
    let target: UIGameObject | undefined = undefined;
    let leastDistanceFromTargetPoint: number = Infinity;
    for (const possibleTarget of possibleTargets) {
      const distanceFromTargetPoint = this.vectorService.getDistance(possibleTarget.getPosition(), targetPoint);
      if (distanceFromTargetPoint < leastDistanceFromTargetPoint) {
        target = possibleTarget;
        leastDistanceFromTargetPoint = distanceFromTargetPoint;
      }
      console.log('Possible target', possibleTarget.getId(), distanceFromTargetPoint, possibleTarget.getPosition());
    }
    game.setCurrentTargetObject(target);
  }
}
