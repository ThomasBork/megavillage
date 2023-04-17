import { GameObjectType } from './game-object-type';
import { PlayerActionType } from './player-action-type';

export interface ActionTypeWithTargetType {
  actionType: PlayerActionType;
  targetType: GameObjectType;
}
