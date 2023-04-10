import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { ServerMessageActionStarted } from 'src/shared/messages/server/server-message-action-started';
import { UIGameObjectPlayer } from '../ui-game-state/ui-game-object-player';

@Injectable({
  providedIn: 'root'
})
export class ActionStartedHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageActionStarted): void {
    const gameObject = this.gameService.getGameObject(message.performingPlayerId);
    if (gameObject instanceof UIGameObjectPlayer) {
      gameObject.setAction(message.action);
    } else {
      throw new Error('Non-player game object found performing an action. Id: "' + gameObject.getId() + '".');
    }
  }
}
