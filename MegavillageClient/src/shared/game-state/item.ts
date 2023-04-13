import { ItemType } from './item-type';
import { PlayerActionType } from './player-action-type';

export interface Item {
  id: number;
  name: string;
  type: ItemType;
  actionsEnabledByItem: PlayerActionType[];
}