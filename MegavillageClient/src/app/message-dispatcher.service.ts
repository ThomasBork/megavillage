import { Injectable } from '@angular/core';
import { ServerMessageCompleteGameState } from 'src/shared/messages/server/server-message-complete-game-state';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';
import { GameService } from './game.service';
import { CompleteGameStateHandlerService } from './message-handlers/complete-game-state-handler.service';

@Injectable({
  providedIn: 'root'
})
export class MessageDispatcherService {
  public constructor(private completeGameStateHandlerService: CompleteGameStateHandlerService) { }

  public handleMessage(messageContainer: ServerMessageContainer): void {
    switch (messageContainer.type) {
      case ServerMessageType.completeGameState:
        this.completeGameStateHandlerService.handle(messageContainer.message as ServerMessageCompleteGameState);
        break;
      case ServerMessageType.playerJoined:
        break;
      default:
        throw new Error('Unknown message type: "' + messageContainer.type + '".');
    }
  }
}
