import { Player } from 'src/shared/game-state/player';
import { UIGameObject } from './ui-game-object';
import { PlayerAction } from 'src/shared/game-state/player-action';
import { Item } from 'src/shared/game-state/item';
import { Vector2 } from 'src/shared/game-state/vector2';

export class UIGameObjectPlayer extends UIGameObject {
  public isCurrentPlayer: boolean;
  public lastNonzeroMovement: Vector2 | null;
  public constructor(serverState: Player, isCurrentPlayer: boolean) {
    super(serverState);
    this.isCurrentPlayer = isCurrentPlayer;
    this.lastNonzeroMovement = null;
  }
  public setAction(action: PlayerAction | null): void {
    this.getPlayerServerState().action = action;
  }
  public getAction(): PlayerAction | null {
    return this.getPlayerServerState().action;
  }
  public getUserName(): string {
    return this.getPlayerServerState().name;
  }
  public getItems(): Item[] {
    return this.getPlayerServerState().items;
  }
  public getItem(itemId: number): Item {
    const item = this.getItems().find((i) => i.id === itemId);
    if (!item) {
      throw new Error ('Could not find item with id: "' + itemId + '".');
    }
    return item;
  }
  public addItem(item: Item): void {
    this.getPlayerServerState().items.push(item);
  }
  private getPlayerServerState(): Player {
    return this.serverState as Player;
  }
}