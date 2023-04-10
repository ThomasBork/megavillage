import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { UIGameObjectPlayer } from '../ui-game-state/ui-game-object-player';
import { ServerMessageActionCanceled } from 'src/shared/messages/server/server-message-action-canceled';

@Injectable({
  providedIn: 'root'
})
export class ActionCanceledHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageActionCanceled): void {
    const gameObject = this.gameService.getGameObject(message.performingPlayerId);
    if (gameObject instanceof UIGameObjectPlayer) {
      gameObject.setAction(null);
    } else {
      throw new Error('Non-player game object found canceling an action. Id: "' + gameObject.getId() + '".');
    }
  }
}
