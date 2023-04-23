import { ActionTypeWithTargetType } from './action-type-with-target-type';
import { GameObjectType } from './game-object-type';
import { ItemType } from './item-type';

export interface Item {
  id: number;
  name: string;
  type: ItemType;
  actionsEnabledByItem: ActionTypeWithTargetType[];
  objectsThatCanBeWalkedOverWithItem: GameObjectType[];
}