import { ActionTypeWithTargetType } from './action-type-with-target-type';
import { ItemType } from './item-type';

export interface Item {
  id: number;
  name: string;
  type: ItemType;
  actionsEnabledByItem: ActionTypeWithTargetType[];
}