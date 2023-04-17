import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { ServerMessageItemResourceStackQuantityChanged } from 'src/shared/messages/server/server-message-item-resource-stack-quantity-changed';
import { ItemResourceStack } from 'src/shared/game-state/item-resource-stack';

@Injectable({
  providedIn: 'root'
})
export class ItemResourceStackQuantityChangedHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageItemResourceStackQuantityChanged): void {
    const gameObject = this.gameService.getGameObject(message.playerId);
    (gameObject.getItem(message.itemId) as ItemResourceStack).quantity = message.newQuantity;
  }
}
