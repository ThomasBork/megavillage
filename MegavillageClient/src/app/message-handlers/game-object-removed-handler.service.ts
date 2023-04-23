import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { UIGameObjectPlayer } from '../ui-game-state/ui-game-object-player';
import { ServerMessageGameObjectRemoved } from 'src/shared/messages/server/server-message-game-object-removed';

@Injectable({
  providedIn: 'root'
})
export class GameObjectRemovedHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageGameObjectRemoved): void {
    this.gameService.getGame().removeGameObjectWithId(message.gameObjectId);
    this.gameService.updateCurrentTargetObject();
  }
}
