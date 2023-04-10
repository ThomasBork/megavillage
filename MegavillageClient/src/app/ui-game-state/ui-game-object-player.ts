import { Player } from 'src/shared/game-state/player';
import { UIGameObject } from './ui-game-object';
import { PlayerAction } from 'src/shared/game-state/player-action';

export class UIGameObjectPlayer extends UIGameObject {
  public isCurrentPlayer: boolean;
  public constructor(serverState: Player, isCurrentPlayer: boolean) {
    super(serverState);
    this.isCurrentPlayer = isCurrentPlayer;
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
  private getPlayerServerState(): Player {
    return this.serverState as Player;
  }
}