import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { UIGameObjectPlayer } from '../ui-game-state/ui-game-object-player';
import { ServerMessageItemGained } from 'src/shared/messages/server/server-message-item-gained';

@Injectable({
  providedIn: 'root'
})
export class ItemGainedHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageItemGained): void {
    const gameObject = this.gameService.getGameObject(message.gameObjectId);
    gameObject.setItem(message.item, message.index);
  }
}
