import { GameObject } from './game-object';
import { ItemRecipe } from './item-recipe';

export interface Shop extends GameObject {
  itemsForSale: ItemRecipe[];
}
