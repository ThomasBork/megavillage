import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'src/connection';
import { GameManager } from 'src/game-manager';
import { GameObject } from 'src/shared/game-state/game-object';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { Player } from 'src/shared/game-state/player';
import { Shop } from 'src/shared/game-state/shop';
import { ClientMessageBuyItem } from 'src/shared/messages/client/client-message-buy-item';

@Injectable()
export class BuyItemHandler {
  private logger: Logger;
  public constructor(
    private gameManager: GameManager,
  ) {
    this.logger = new Logger('BuyItemHandler');
  }

  public handle(sender: Connection, message: ClientMessageBuyItem): void {
    const gameObject = this.gameManager.getObjectById(message.targetShopId);
    if (gameObject.type !== GameObjectType.shop) {
      this.logger.log('Player attempted to buy from an object which is not a shop. User: "' + sender.getUserId() + '", Target: "' + gameObject.id + '".');
      return;
    }
    const shop = gameObject as Shop;
    const itemRecipe = shop.itemsForSale.find((i) => i.id === message.itemRecipeId);
    if (!itemRecipe) {
      this.logger.log('Player attempted to buy an item from a shop which does not sell the item. User: "' + sender.getUserId() + '", RecipeId: "' + message.itemRecipeId + '".');
      return;
    }
    const hasSpace = this.gameManager.getNumberOfEmptyItemSpaces(shop) > 0;
    if (!hasSpace) {
      this.logger.log('Player attempted to buy an item from a shop which has no more space. User: "' + sender.getUserId() + '", RecipeId: "' + message.itemRecipeId + '".');
      return;
    } 
    const player = this.gameManager.getPlayerByUserId(sender.getUserId());
    const isTargetWithinReach = this.isTargetWithinReach(player, shop);
    if (!isTargetWithinReach) {
      this.logger.log('Player attempted to buy an item from a shop which is not within reach. User: "' + sender.getUserId() + '", Shop: "' + shop.id + '".');
      return;
    }

    const hasPaid = this.gameManager.tryPayCosts(itemRecipe.cost);
    if (!hasPaid) {
      this.logger.log('Player attempted to buy an item without available resources. User: "' + sender.getUserId() + '", RecipeId: "' + message.itemRecipeId + '".');
      return;
    }

    this.gameManager.buildItemAndGiveToShop(itemRecipe, shop);
  }

  private isTargetWithinReach(player: Player, target: GameObject): boolean {
    // Trust the front end - For now.
    return true;
  }
}
