import { Injectable, Logger } from '@nestjs/common';
import { Connection } from './connection';
import { SetDirectionHandler } from './message-handlers/set-direction-handler';
import { ClientMessageContainer } from './shared/messages/client/client-message-container';
import { ClientMessageSetDirection } from './shared/messages/client/client-message-set-direction';
import { ClientMessageType } from './shared/messages/client/client-message-type';
import { UserService } from './user.service';
import { ClientMessageAuthenticate } from './shared/messages/client/client-message-authenticate';
import { AuthenticationResultComposer } from './message-composers/authentication-result-composer';
import { GameManager } from './game-manager';
import { CompleteGameStateComposer } from './message-composers/complete-game-state-composer';
import { ConnectionManager } from './connection-manager';
import { ConnectionClosedComposer } from './message-composers/connection-closed-composer';
import { PerformActionHandler } from './message-handlers/perform-action-handler';
import { ClientMessagePerformAction } from './shared/messages/client/client-message-perform-action';
import { BuyItemHandler } from './message-handlers/buy-item-handler';
import { ClientMessageBuyItem } from './shared/messages/client/client-message-buy-item';
import { TakeItemHandler } from './message-handlers/take-item-handler';
import { GiveItemHandler } from './message-handlers/give-item-handler';
import { ClientMessageTakeItem } from './shared/messages/client/client-message-take-item';
import { ClientMessageGiveItem } from './shared/messages/client/client-message-give-item';

@Injectable()
export class MessageDispatcher {
  private logger: Logger;
  public constructor(
    private setDirectionHandler: SetDirectionHandler,
    private userService: UserService,
    private authenticationResultComposer: AuthenticationResultComposer,
    private connectionClosedComposer: ConnectionClosedComposer,
    private completeGameStateComposer: CompleteGameStateComposer,
    private gameManager: GameManager,
    private connectionManager: ConnectionManager,
    private performActionHandler: PerformActionHandler,
    private buyItemHandler: BuyItemHandler,
    private takeItemHandler: TakeItemHandler,
    private giveItemHandler: GiveItemHandler,
  ) {
    this.logger = new Logger('MessageDispatcher');
  }

  public dispatchMessage<T extends object>(
    sender: Connection,
    messageContainer: ClientMessageContainer<T>,
  ): void {
    if (!sender.isAuthenticated()) {
      if (messageContainer.type === ClientMessageType.authenticate) {
        const message = messageContainer.message as ClientMessageAuthenticate;
        const authenticationResult = this.userService.authenticate(message.authenticationToken);
        if (authenticationResult.user) {
          const otherConnectionOfUser = this.connectionManager.getConnectionForUser(authenticationResult.user.id);
          if (otherConnectionOfUser && otherConnectionOfUser !== sender) {
            this.connectionManager.removeConnection(otherConnectionOfUser);
            const connectionClosedMessage = this.connectionClosedComposer.compose('User connected elsewhere.');
            otherConnectionOfUser.sendMessage(connectionClosedMessage);
            otherConnectionOfUser.webSocket.close();
          }

          sender.setUserId(authenticationResult.user.id);
          const authenticationResultMessage = this.authenticationResultComposer.compose(authenticationResult.user, authenticationResult.errorMessage);
          sender.sendMessage(authenticationResultMessage);

          this.gameManager.addPlayerForUser(authenticationResult.user.id);

          const gameStateMessage = this.completeGameStateComposer.compose(this.gameManager.getGame());
          sender.sendMessage(gameStateMessage);
        } else {
          this.logger.warn('Error message while authenticating: "' + authenticationResult.errorMessage + '".');
          const authenticationResultMessage = this.authenticationResultComposer.compose(authenticationResult.user, authenticationResult.errorMessage);
          sender.sendMessage(authenticationResultMessage);
        }
      } else {
        this.logger.warn('User is not authenticated while sending message of type "' + messageContainer.type.toString() + '".');
      }
      return;
    }

    switch (messageContainer.type) {
      case ClientMessageType.setDirection: {
        this.setDirectionHandler.handle(
          sender,
          messageContainer.message as ClientMessageSetDirection,
        );
        break;
      }
      case ClientMessageType.performAction: {
        this.performActionHandler.handle(
          sender,
          messageContainer.message as ClientMessagePerformAction,
        );
        break;
      }
      case ClientMessageType.buyItem: {
        this.buyItemHandler.handle(
          sender,
          messageContainer.message as ClientMessageBuyItem,
        );
        break;
      }
      case ClientMessageType.takeItem: {
        this.takeItemHandler.handle(
          sender,
          messageContainer.message as ClientMessageTakeItem,
        );
        break;
      }
      case ClientMessageType.giveItem: {
        this.giveItemHandler.handle(
          sender,
          messageContainer.message as ClientMessageGiveItem,
        );
        break;
      }
      default:
        throw new Error('Unknown message type: "' + messageContainer.type + '"');
    }
  }
}
