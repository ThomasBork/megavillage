import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { ServerMessageGameResourceQuantityChanged } from 'src/shared/messages/server/server-message-game-resource-quantity-changed';

@Injectable({
  providedIn: 'root'
})
export class GameResourceQuantityChangedHandlerService {

  public constructor(
    private gameService: GameService,
  ) { }

  public handle(message: ServerMessageGameResourceQuantityChanged): void {
    const game = this.gameService.getGame();
    const resources = game.getResources();
    const existingResource = resources.find((r) => r.resourceType === message.resourceType);
    if (existingResource) {
      existingResource.quantity = message.newQuantity;
    } else {
      resources.push({
        quantity: message.newQuantity,
        resourceType: message.resourceType,
      });
    }
  }
}
