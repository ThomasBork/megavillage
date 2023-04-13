import { Item } from '../../game-state/item';

export interface ServerMessageItemGained {
  playerId: number;
  item: Item;
}
