import { Injectable } from '@angular/core';
import { ServerMessageCompleteGameState } from 'src/shared/messages/server/server-message-complete-game-state';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageGameObjectNewPosition } from 'src/shared/messages/server/server-message-game-object-new-position';
import { ServerMessagePlayerJoined } from 'src/shared/messages/server/server-message-player-joined';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';
import { CompleteGameStateHandlerService } from './message-handlers/complete-game-state-handler.service';
import { GameObjectNewPositionHandlerService } from './message-handlers/game-object-new-position-handler.service';
import { PlayerJoinedHandlerService } from './message-handlers/player-joined-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MessageDispatcherService {
  public constructor(
    private completeGameStateHandlerService: CompleteGameStateHandlerService,
    private playerJoinedHandlerService: PlayerJoinedHandlerService,
    private gameObjectNewPositionHandlerService: GameObjectNewPositionHandlerService,
  ) { }

  public handleMessage<T extends object>(messageContainer: ServerMessageContainer<T>): void {
    switch (messageContainer.type) {
      case ServerMessageType.completeGameState: {
        this.completeGameStateHandlerService.handle(messageContainer.message as ServerMessageCompleteGameState);
        break;
      }
      case ServerMessageType.playerJoined: {
        this.playerJoinedHandlerService.handle(messageContainer.message as ServerMessagePlayerJoined);
        break;
      }
      case ServerMessageType.gameObjectNewPosition: {
        this.gameObjectNewPositionHandlerService.handle(messageContainer.message as ServerMessageGameObjectNewPosition);
        break;
      }
      default:
        throw new Error('Unknown message type: "' + messageContainer.type + '".');
    }
  }
}
