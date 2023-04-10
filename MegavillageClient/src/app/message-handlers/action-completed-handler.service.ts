import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { UIGameObjectPlayer } from '../ui-game-state/ui-game-object-player';
import { ServerMessageActionCompleted } from 'src/shared/messages/server/server-message-action-completed';

@Injectable({
  providedIn: 'root'
})
export class ActionCompletedHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageActionCompleted): void {
    const gameObject = this.gameService.getGameObject(message.performingPlayerId);
    if (gameObject instanceof UIGameObjectPlayer) {
      gameObject.setAction(null);
    } else {
      throw new Error('Non-player game object found completing an action. Id: "' + gameObject.getId() + '".');
    }
  }
}
