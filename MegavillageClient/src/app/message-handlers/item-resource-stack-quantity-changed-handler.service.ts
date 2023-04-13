import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { UIGameObjectPlayer } from '../ui-game-state/ui-game-object-player';
import { ServerMessageItemResourceStackQuantityChanged } from 'src/shared/messages/server/server-message-item-resource-stack-quantity-changed';
import { ItemResourceStack } from 'src/shared/game-state/item-resource-stack';

@Injectable({
  providedIn: 'root'
})
export class ItemResourceStackQuantityChangedHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageItemResourceStackQuantityChanged): void {
    const gameObject = this.gameService.getGameObject(message.playerId);
    if (gameObject instanceof UIGameObjectPlayer) {
      (gameObject.getItem(message.itemId) as ItemResourceStack).quantity = message.newQuantity;
    } else {
      throw new Error('Non-player game object found gaining an item. Id: "' + gameObject.getId() + '".');
    }
  }
}
