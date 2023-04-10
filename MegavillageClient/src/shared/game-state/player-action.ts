import { PlayerActionType } from './player-action-type';

export interface PlayerAction {
  type: PlayerActionType;
	targetGameObjectId: number;
  timeRemainingInMilliseconds: number;
}