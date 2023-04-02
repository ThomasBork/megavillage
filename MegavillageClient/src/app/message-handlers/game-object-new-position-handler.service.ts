import { Injectable } from '@angular/core';
import { ServerMessageGameObjectNewPosition } from 'src/shared/messages/server/server-message-game-object-new-position';
import { GameService } from '../game.service';

@Injectable({
  providedIn: 'root'
})
export class GameObjectNewPositionHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageGameObjectNewPosition): void {
    const gameObject = this.gameService.getGameObject(message.gameObjectId);
    gameObject.position = message.newPosition;
  }
}
