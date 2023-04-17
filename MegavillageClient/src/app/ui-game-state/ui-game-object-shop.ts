import { ItemRecipe } from 'src/shared/game-state/item-recipe';
import { UIGameObject } from './ui-game-object';
import { Shop } from 'src/shared/game-state/shop';

export class UIGameObjectShop extends UIGameObject {
  public constructor(serverState: Shop) {
    super(serverState);
  }
  public getItemsForSale(): ItemRecipe[] {
    return this.getShopServerState().itemsForSale;
  }
  private getShopServerState(): Shop {
    return this.serverState as Shop;
  }
}