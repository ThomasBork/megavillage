import { Injectable } from '@nestjs/common';
import { Connection } from './connection';
import { JoinGameHandler } from './message-handlers/join-game-handler';
import { SetVelocityHandler } from './message-handlers/set-velocity-handler';
import { ClientMessageContainer } from './shared/messages/client/client-message-container';
import { ClientMessageJoinGame } from './shared/messages/client/client-message-join-game';
import { ClientMessageSetVelocity } from './shared/messages/client/client-message-set-velocity';
import { ClientMessageType } from './shared/messages/client/client-message-type';

@Injectable()
export class MessageDispatcher {
  public constructor(
    private joinGameHandler: JoinGameHandler,
    private setVelocityHandler: SetVelocityHandler,
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
      case ClientMessageType.setVelocity: {
        this.setVelocityHandler.handle(
          sender,
          messageContainer.message as ClientMessageSetVelocity,
        );
        break;
      }
      default:
        throw new Error('Unknown message type: "' + messageContainer.type + '"');
    }
  }
}
