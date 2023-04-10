import { Injectable } from '@nestjs/common';
import { PlayerAction } from 'src/shared/game-state/player-action';
import { ServerMessageActionStarted } from 'src/shared/messages/server/server-message-action-started';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class ActionStartedComposer {
  public compose(
    performingPlayerId: number, 
    playerAction: PlayerAction
  ): ServerMessageContainer<ServerMessageActionStarted> {
    return {
      type: ServerMessageType.actionStarted,
      message: {
        performingPlayerId: performingPlayerId,
        action: playerAction,
      },
    };
  }
}
