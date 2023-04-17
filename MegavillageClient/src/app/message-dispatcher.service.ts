import { Injectable } from '@angular/core';
import { ServerMessageCompleteGameState } from 'src/shared/messages/server/server-message-complete-game-state';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageGameObjectNewPosition } from 'src/shared/messages/server/server-message-game-object-new-position';
import { ServerMessagePlayerJoined } from 'src/shared/messages/server/server-message-player-joined';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';
import { CompleteGameStateHandlerService } from './message-handlers/complete-game-state-handler.service';
import { GameObjectNewPositionHandlerService } from './message-handlers/game-object-new-position-handler.service';
import { PlayerJoinedHandlerService } from './message-handlers/player-joined-handler.service';
import { AuthenticationResultHandlerService } from './message-handlers/authentication-result-handler.service';
import { ServerMessageAuthenticationResult } from 'src/shared/messages/server/server-message-authentication-result';
import { ServerMessageConnectionClosed } from 'src/shared/messages/server/server-message-connection-closed';
import { ConnectionClosedHandlerService } from './message-handlers/connection-closed-handler.service';
import { ActionStartedHandlerService } from './message-handlers/action-started-handler.service';
import { ServerMessageActionStarted } from 'src/shared/messages/server/server-message-action-started';
import { ActionCompletedHandlerService } from './message-handlers/action-completed-handler.service';
import { GameObjectRemovedHandlerService } from './message-handlers/game-object-removed-handler.service';
import { ServerMessageActionCompleted } from 'src/shared/messages/server/server-message-action-completed';
import { ServerMessageGameObjectRemoved } from 'src/shared/messages/server/server-message-game-object-removed';
import { ActionCanceledHandlerService } from './message-handlers/action-canceled-handler.service';
import { ServerMessageActionCanceled } from 'src/shared/messages/server/server-message-action-canceled';
import { ItemGainedHandlerService } from './message-handlers/item-gained-handler.service';
import { ServerMessageItemGained } from 'src/shared/messages/server/server-message-item-gained';
import { ItemResourceStackQuantityChangedHandlerService } from './message-handlers/item-resource-stack-quantity-changed-handler.service';
import { ServerMessageItemResourceStackQuantityChanged } from 'src/shared/messages/server/server-message-item-resource-stack-quantity-changed';
import { PlayerAvailableActionsChangedHandlerService } from './message-handlers/player-available-actions-changed-handler.service';
import { ServerMessagePlayerAvailableActionsChanged } from 'src/shared/messages/server/server-message-player-available-actions-changed';
import { GameResourceQuantityChangedHandlerService } from './message-handlers/game-resource-quantity-changed-handler.service';
import { ItemRemovedHandlerService } from './message-handlers/item-removed-handler.service';
import { ServerMessageGameResourceQuantityChanged } from 'src/shared/messages/server/server-message-game-resource-quantity-changed';
import { ServerMessageItemRemoved } from 'src/shared/messages/server/server-message-item-removed';

@Injectable({
  providedIn: 'root'
})
export class MessageDispatcherService {
  public constructor(
    private authenticationResultHandlerService: AuthenticationResultHandlerService,
    private connectionClosedHandlerService: ConnectionClosedHandlerService,
    private completeGameStateHandlerService: CompleteGameStateHandlerService,
    private playerJoinedHandlerService: PlayerJoinedHandlerService,
    private gameObjectNewPositionHandlerService: GameObjectNewPositionHandlerService,
    private actionStartedHandlerService: ActionStartedHandlerService,
    private actionCompletedHandlerService: ActionCompletedHandlerService,
    private actionCanceledHandlerService: ActionCanceledHandlerService,
    private gameObjectRemovedHandlerService: GameObjectRemovedHandlerService,
    private itemGainedHandlerService: ItemGainedHandlerService,
    private itemResourceStackQuantityChangedHandlerService: ItemResourceStackQuantityChangedHandlerService,
    private playerAvailableActionsChangedHandlerService: PlayerAvailableActionsChangedHandlerService,
    private itemRemovedHandlerService: ItemRemovedHandlerService,
    private gameResourceQuantityChangedHandlerService: GameResourceQuantityChangedHandlerService,
  ) { }

  public handleMessage<T extends object>(messageContainer: ServerMessageContainer<T>): void {
    switch (messageContainer.type) {
      case ServerMessageType.authenticationResult: {
        this.authenticationResultHandlerService.handle(messageContainer.message as ServerMessageAuthenticationResult);
        break;
      }
      case ServerMessageType.connectionClosed: {
        this.connectionClosedHandlerService.handle(messageContainer.message as ServerMessageConnectionClosed);
        break;
      }
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
      case ServerMessageType.actionStarted: {
        this.actionStartedHandlerService.handle(messageContainer.message as ServerMessageActionStarted);
        break;
      }
      case ServerMessageType.actionCompleted: {
        this.actionCompletedHandlerService.handle(messageContainer.message as ServerMessageActionCompleted);
        break;
      }
      case ServerMessageType.gameObjectRemoved: {
        this.gameObjectRemovedHandlerService.handle(messageContainer.message as ServerMessageGameObjectRemoved);
        break;
      }
      case ServerMessageType.actionCanceled: {
        this.actionCanceledHandlerService.handle(messageContainer.message as ServerMessageActionCanceled);
        break;
      }
      case ServerMessageType.itemGained: {
        this.itemGainedHandlerService.handle(messageContainer.message as ServerMessageItemGained);
        break;
      }
      case ServerMessageType.itemResourceStackQuantityChanged: {
        this.itemResourceStackQuantityChangedHandlerService.handle(messageContainer.message as ServerMessageItemResourceStackQuantityChanged);
        break;
      }
      case ServerMessageType.playerAvailableActionsChanged: {
        this.playerAvailableActionsChangedHandlerService.handle(messageContainer.message as ServerMessagePlayerAvailableActionsChanged);
        break;
      }
      case ServerMessageType.itemRemoved: {
        this.itemRemovedHandlerService.handle(messageContainer.message as ServerMessageItemRemoved);
        break;
      }
      case ServerMessageType.gameResourceQuantityChanged: {
        this.gameResourceQuantityChangedHandlerService.handle(messageContainer.message as ServerMessageGameResourceQuantityChanged);
        break;
      }
      default:
        throw new Error('Unknown message type: "' + messageContainer.type + '".');
    }
  }
}
