import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { ConnectionManager } from './connection-manager';
import { GameLoop } from './game-loop/game-loop';
import { GameManager } from './game-manager';
import { CompleteGameStateComposer } from './message-composers/complete-game-state-composer';
import { GameObjectNewPositionComposer } from './message-composers/game-object-new-position-composer';
import { PlayerJoinedComposer } from './message-composers/player-joined-composer';
import { MessageDispatcher } from './message-dispatcher';
import { SetDirectionHandler } from './message-handlers/set-direction-handler';
import { VectorService } from './vector.service';
import { InputBufferService } from './game-loop/input-buffer/input-buffer.service';
import { GameObjectService } from './game-object.service';
import { UserController } from './user.controller';
import { AuthenticationResultComposer } from './message-composers/authentication-result-composer';
import { UserService } from './user.service';
import { ConnectionClosedComposer } from './message-composers/connection-closed-composer';
import { UserPersistenceService } from './user-persistence.service';
import { ActionStartedComposer } from './message-composers/action-started-composer';
import { PerformActionHandler } from './message-handlers/perform-action-handler';
import { ActionCompletedComposer } from './message-composers/action-completed-composer';
import { GameObjectRemovedComposer } from './message-composers/game-object-removed-composer';
import { ActionCanceledComposer } from './message-composers/action-canceled-composer';
import { ItemResourceStackQuantityChangedComposer } from './message-composers/item-resource-stack-quantity-changed-composer';
import { ItemGainedComposer } from './message-composers/item-gained-composer';
import { ListService } from './list.service';
import { PlayerAvailableActionsChangedComposer } from './message-composers/player-available-actions-changed-composer';
import { GameResourceQuantityChangedComposer } from './message-composers/game-resource-quantity-changed-composer';
import { ItemRemovedComposer } from './message-composers/item-removed-composer';
import { WorldBuilderService } from './world-builder.service';
import { BuyItemHandler } from './message-handlers/buy-item-handler';
import { TakeItemHandler } from './message-handlers/take-item-handler';
import { GiveItemHandler } from './message-handlers/give-item-handler';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    AppGateway,
    MessageDispatcher,
    ConnectionManager,
    GameManager,
    GameLoop,
    VectorService,
    InputBufferService,
    GameObjectService,
    UserService,
    SetDirectionHandler,
    PerformActionHandler,
    BuyItemHandler,
    TakeItemHandler,
    GiveItemHandler,
    AuthenticationResultComposer,
    ConnectionClosedComposer,
    CompleteGameStateComposer,
    PlayerJoinedComposer,
    GameObjectNewPositionComposer,
    ActionStartedComposer,
    ActionCompletedComposer,
    ActionCanceledComposer,
    GameObjectRemovedComposer,
    ItemGainedComposer,
    ItemResourceStackQuantityChangedComposer,
    PlayerAvailableActionsChangedComposer,
    ItemRemovedComposer,
    GameResourceQuantityChangedComposer,
    UserPersistenceService,
    ListService,
    WorldBuilderService,
  ],
})
export class AppModule {}
