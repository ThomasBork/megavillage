import { Game } from 'src/shared/game-state/game';
import { UIGameObject } from './ui-game-object';
import { UIGameObjectPlayer } from './ui-game-object-player';
import { Vector2 } from 'src/shared/game-state/vector2';
import { GameResource } from 'src/shared/game-state/game-resource';
import { UIGameObjectShop } from './ui-game-object-shop';

export class UIGame {
  private currentTargetObject?: UIGameObject;
  private gameObjects: UIGameObject[];
  private serverState: Game;
  private currentMovementDirection: Vector2;
  private selectedShop: UIGameObjectShop | undefined;

  public constructor(
    serverState: Game,
    gameObjects: UIGameObject[],
  ) {
    this.serverState = serverState;
    this.gameObjects = gameObjects;
    this.currentMovementDirection = {x: 0, y: 0};
  }

  public getGameObjects(): UIGameObject[] {
    return this.gameObjects;
  }

  public addGameObject(gameObject: UIGameObject): void {
    this.gameObjects.push(gameObject);
  }

  public getCurrentPlayer(): UIGameObjectPlayer {
    const currentPlayer = this.getPlayers()
      .find((p) => p.isCurrentPlayer);
    if (!currentPlayer) {
      throw new Error('Could not find current player.');
    }
    return currentPlayer;
  }

  public setMovementDirection(newDirection: Vector2): void {
    this.currentMovementDirection = newDirection;
  }

  public getMovementDirection(): Vector2 {
    return this.currentMovementDirection;
  }

  public setCurrentTargetObject(target: UIGameObject | undefined): void {
    this.currentTargetObject = target;
  }

  public getCurrentTargetObject(): UIGameObject | undefined {
    return this.currentTargetObject;
  }

  public removeGameObjectWithId(gameObjectId: number): void {
    this.gameObjects = this.gameObjects.filter((o) => o.getId() !== gameObjectId);
    if (this.currentTargetObject && this.currentTargetObject.getId() === gameObjectId) {
      this.currentTargetObject = undefined;
    }
    if (this.selectedShop && this.selectedShop.getId() === gameObjectId) {
      this.selectedShop = undefined;
    }
  }

  public getResources(): GameResource[] {
    return this.serverState.sharedResources;
  }

  public setSelectedShop(shop: UIGameObjectShop | undefined): void {
    this.selectedShop = shop;
  }

  public getSelectedShop(): UIGameObjectShop | undefined {
    return this.selectedShop;
  }

  private getPlayers(): UIGameObjectPlayer[] {
    return this.gameObjects
      .filter((o) => o instanceof UIGameObjectPlayer) as UIGameObjectPlayer[];
  }
}
