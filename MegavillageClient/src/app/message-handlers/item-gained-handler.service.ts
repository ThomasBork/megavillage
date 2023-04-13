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
    const gameObject = this.gameService.getGameObject(message.playerId);
    if (gameObject instanceof UIGameObjectPlayer) {
      gameObject.addItem(message.item);
    } else {
      throw new Error('Non-player game object found gaining an item. Id: "' + gameObject.getId() + '".');
    }
  }
}
