import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { UIGameObjectPlayer } from '../ui-game-state/ui-game-object-player';
import { ServerMessageItemGained } from 'src/shared/messages/server/server-message-item-gained';
import { ServerMessageItemRemoved } from 'src/shared/messages/server/server-message-item-removed';

@Injectable({
  providedIn: 'root'
})
export class ItemRemovedHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageItemRemoved): void {
    const gameObject = this.gameService.getGameObject(message.playerId);
    const item = gameObject.getItem(message.itemId);
    gameObject.removeItem(item);
  }
}
