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
    AuthenticationResultComposer,
    ConnectionClosedComposer,
    CompleteGameStateComposer,
    PlayerJoinedComposer,
    GameObjectNewPositionComposer,
    UserPersistenceService,
  ],
})
export class AppModule {}
