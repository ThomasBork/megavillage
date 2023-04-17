import { Component, Input } from '@angular/core';
import { ConnectionService } from 'src/app/connection.service';
import { GameService } from 'src/app/game.service';
import { BuyItemComposerService } from 'src/app/message-composers/buy-item-composer.service';
import { TakeItemComposerService } from 'src/app/message-composers/take-item-composer.service';
import { UIGameObjectShop } from 'src/app/ui-game-state/ui-game-object-shop';
import { Item } from 'src/shared/game-state/item';
import { ItemRecipe } from 'src/shared/game-state/item-recipe';
import { ResourceType } from 'src/shared/game-state/resource-type';

@Component({
  selector: 'app-hud-shop-window',
  templateUrl: './hud-shop-window.component.html',
  styleUrls: ['./hud-shop-window.component.scss']
})
export class HudShopWindowComponent {
  @Input()
  public shop!: UIGameObjectShop;

  public constructor(
    private connectionService: ConnectionService,
    private buyItemComposerService: BuyItemComposerService,
    private takeItemComposerService: TakeItemComposerService,
    private gameService: GameService,
  ) {}

  public getItemImagePath(itemRecipe: ItemRecipe): string {
    return 'assets/images/items/' + itemRecipe.type.toString() + '.png';
  }

  public getResourceImagePath(resourceType: ResourceType): string {
    return 'assets/images/items/' + resourceType.toString() + '.png';
  }

  public getItemDescriptionLines(itemRecipe: ItemRecipe): string[] {
    const lines = itemRecipe.actionsEnabledByItem.map((a) => `Enables the ${a.actionType} action on ${a.targetType}.`);
    return lines;
  }

  public canPurchaseItem(itemRecipe: ItemRecipe): boolean {
    return this.gameService.hasResources(itemRecipe.cost);
  }

  public buyItem(itemRecipe: ItemRecipe): void {
    if (this.canPurchaseItem(itemRecipe)) {
      const message = this.buyItemComposerService.compose(itemRecipe.id, this.shop.getId());
      this.connectionService.sendMessage(message);
    }
  }

  public takeItem(item: Item | null): void {
    if (item !== null) {
      const message = this.takeItemComposerService.compose(this.shop.getId(), item.id);
      this.connectionService.sendMessage(message);
    }
  }
}
