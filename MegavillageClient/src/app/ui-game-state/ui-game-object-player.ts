import { Player } from 'src/shared/game-state/player';
import { UIGameObject } from './ui-game-object';
import { PlayerAction } from 'src/shared/game-state/player-action';
import { Vector2 } from 'src/shared/game-state/vector2';
import { ActionTypeWithTargetType } from 'src/shared/game-state/action-type-with-target-type';

export class UIGameObjectPlayer extends UIGameObject {
  public isCurrentPlayer: boolean;
  public lastNonzeroMovement: Vector2 | null;
  public lastNonzeroXMovement: number | null;
  public constructor(serverState: Player, isCurrentPlayer: boolean) {
    super(serverState);
    this.isCurrentPlayer = isCurrentPlayer;
    this.lastNonzeroMovement = null;
    this.lastNonzeroXMovement = null;
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
  public getAvailableActions(): ActionTypeWithTargetType[] {
    return this.getPlayerServerState().availableActions;
  }
  public setAvailableActions(actions: ActionTypeWithTargetType[]): void {
    this.getPlayerServerState().availableActions = actions;
  }
  private getPlayerServerState(): Player {
    return this.serverState as Player;
  }
}