import { Injectable } from '@nestjs/common';
import { ServerMessageActionCompleted } from 'src/shared/messages/server/server-message-action-completed';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class ActionCompletedComposer {
  public compose(playerId: number): ServerMessageContainer<ServerMessageActionCompleted> {
    return {
      type: ServerMessageType.actionCompleted,
      message: {
        performingPlayerId: playerId
      },
    };
  }
}
