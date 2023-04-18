import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { ServerMessageGameObjectStageChanged } from 'src/shared/messages/server/server-message-game-object-stage-changed';
import { UIGameObjectWithStages } from '../ui-game-state/ui-game-object-with-stages';

@Injectable({
  providedIn: 'root'
})
export class GameObjectStageChangedHandlerService {

  public constructor(
    private gameService: GameService,
  ) { }

  public handle(message: ServerMessageGameObjectStageChanged): void {
    const gameObject = this.gameService.getGameObject(message.gameObjectId);
    if (gameObject instanceof UIGameObjectWithStages) {
      gameObject.setCurrentStage(message.newStage);
    }
  }
}
