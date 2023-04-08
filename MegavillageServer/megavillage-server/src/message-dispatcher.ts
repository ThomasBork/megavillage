import { Injectable } from '@nestjs/common';
import { Connection } from './connection';
import { JoinGameHandler } from './message-handlers/join-game-handler';
import { SetDirectionHandler } from './message-handlers/set-direction-handler';
import { ClientMessageContainer } from './shared/messages/client/client-message-container';
import { ClientMessageJoinGame } from './shared/messages/client/client-message-join-game';
import { ClientMessageSetDirection } from './shared/messages/client/client-message-set-direction';
import { ClientMessageType } from './shared/messages/client/client-message-type';

@Injectable()
export class MessageDispatcher {
  public constructor(
    private joinGameHandler: JoinGameHandler,
    private setDirectionHandler: SetDirectionHandler,
  ) {}

  public dispatchMessage<T extends object>(
    sender: Connection,
    messageContainer: ClientMessageContainer<T>,
  ): void {
    switch (messageContainer.type) {
      case ClientMessageType.joinGame: {
        this.joinGameHandler.handle(
          sender,
          messageContainer.message as ClientMessageJoinGame,
        );
        break;
      }
      case ClientMessageType.setDirection: {
        this.setDirectionHandler.handle(
          sender,
          messageContainer.message as ClientMessageSetDirection,
        );
        break;
      }
      default:
        throw new Error('Unknown message type: "' + messageContainer.type + '"');
    }
  }
}
