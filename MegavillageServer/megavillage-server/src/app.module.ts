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
import { JoinGameHandler } from './message-handlers/join-game-handler';
import { SetVelocityHandler } from './message-handlers/set-velocity-handler';
import { VectorService } from './vector.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    MessageDispatcher,
    ConnectionManager,
    GameManager,
    GameLoop,
    VectorService,
    JoinGameHandler,
    SetVelocityHandler,
    CompleteGameStateComposer,
    PlayerJoinedComposer,
    GameObjectNewPositionComposer,
  ],
})
export class AppModule {}
