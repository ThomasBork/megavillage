import { Item } from '../../game-state/item';

export interface ServerMessageItemGained {
  gameObjectId: number;
  item: Item;
  index: number;
}
