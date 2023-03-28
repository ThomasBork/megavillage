import { Injectable } from '@nestjs/common';
import { Connection } from './connection';
import { JoinGameHandler } from './message-handlers/join-game-handler';
import { ClientMessageContainer } from './messages/client/client-message-container';
import { ClientMessageJoinGame } from './messages/client/client-message-join-game';

@Injectable()
export class MessageDispatcher {
  public constructor(private joinGameHandler: JoinGameHandler) {}

  public dispatchMessage(
    sender: Connection,
    messageContainer: ClientMessageContainer,
  ): void {
    switch (messageContainer.type) {
      case 'joinGame':
        this.joinGameHandler.handle(
          sender,
          messageContainer.message as ClientMessageJoinGame,
        );
        break;
      default:
        throw new Error('Unknown message type: "' + messageContainer.type + '"');
    }
  }
}
