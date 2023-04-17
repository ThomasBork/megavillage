import { Component, Input } from '@angular/core';
import { ConnectionService } from 'src/app/connection.service';
import { GameService } from 'src/app/game.service';
import { GiveItemComposerService } from 'src/app/message-composers/give-item-composer.service';
import { UIGameObjectPlayer } from 'src/app/ui-game-state/ui-game-object-player';
import { Item } from 'src/shared/game-state/item';

@Component({
  selector: 'app-hud-items',
  templateUrl: './hud-items.component.html',
  styleUrls: ['./hud-items.component.scss']
})
export class HudItemsComponent {
  @Input()
  public player!: UIGameObjectPlayer;

  public constructor(
    private connectionService: ConnectionService,
    private giveItemComposerService: GiveItemComposerService,
    private gameService: GameService,
  ) {}

  public giveItem(item: Item | null): void {
    if (item !== null) {
      const shop = this.gameService.getGame().getSelectedShop();
      if (shop) {
        const message = this.giveItemComposerService.compose(shop.getId(), item.id);
        this.connectionService.sendMessage(message);
      }
    }
  }
}
