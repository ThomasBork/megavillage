import { Injectable } from '@nestjs/common';
import { Game } from 'src/shared/game-state/game';
import { ServerMessageCompleteGameState } from 'src/shared/messages/server/server-message-complete-game-state';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class CompleteGameStateComposer {
  public compose(game: Game): ServerMessageContainer<ServerMessageCompleteGameState> {
    return {
      type: ServerMessageType.completeGameState,
      message: {
        game: game,
      },
    };
  }
}
