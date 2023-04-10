import { PlayerAction } from 'src/shared/game-state/player-action';

export interface ServerMessageActionStarted {
  performingPlayerId: number;
  action: PlayerAction;
}
