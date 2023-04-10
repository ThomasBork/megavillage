import { PlayerActionType } from 'src/shared/game-state/player-action-type';

export interface ClientMessagePerformAction {
  type: PlayerActionType;
  targetGameObjectId: number;
}
