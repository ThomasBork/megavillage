import { ActionTypeWithTargetType } from 'src/shared/game-state/action-type-with-target-type';

export interface ServerMessagePlayerAvailableActionsChanged {
  playerId: number;
  availableActions: ActionTypeWithTargetType[];
}
