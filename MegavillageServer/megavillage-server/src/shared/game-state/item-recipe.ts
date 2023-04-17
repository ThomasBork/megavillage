import { ActionTypeWithTargetType } from './action-type-with-target-type';
import { GameResource } from './game-resource';
import { ItemType } from './item-type';

export interface ItemRecipe {
  id: number;
  name: string;
  type: ItemType;
  actionsEnabledByItem: ActionTypeWithTargetType[];
  cost: GameResource[];
}
