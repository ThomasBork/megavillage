import { Injectable } from '@angular/core';
import { ServerMessageGameObjectNewPosition } from 'src/shared/messages/server/server-message-game-object-new-position';
import { GameService } from '../game.service';
import { VectorService } from '../vector.service';
import { UIGameObjectPlayer } from '../ui-game-state/ui-game-object-player';

@Injectable({
  providedIn: 'root'
})
export class GameObjectNewPositionHandlerService {

  public constructor(
    private gameService: GameService,
    private vectorService: VectorService,
  ) { }

  public handle(message: ServerMessageGameObjectNewPosition): void {
    const gameObject = this.gameService.getGameObject(message.gameObjectId);
    gameObject.setPosition(message.newPosition);
    if (gameObject instanceof UIGameObjectPlayer) {
      const calculatedMovement = this.vectorService.subtractVector(message.newPosition, message.oldPosition);
      gameObject.lastNonzeroMovement = calculatedMovement;
    }
    this.gameService.updateCurrentTargetObject();
  }
}
