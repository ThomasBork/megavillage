import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { ConnectionManager } from './connection-manager';
import { GameManager } from './game-manager';
import { MessageDispatcher } from './message-dispatcher';
import { JoinGameHandler } from './message-handlers/join-game-handler';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    MessageDispatcher,
    ConnectionManager,
    JoinGameHandler,
    GameManager,
  ],
})
export class AppModule {}
