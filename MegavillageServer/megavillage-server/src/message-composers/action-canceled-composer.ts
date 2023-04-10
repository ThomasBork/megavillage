import { Injectable } from '@nestjs/common';
import { ServerMessageActionCanceled } from 'src/shared/messages/server/server-message-action-canceled';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class ActionCanceledComposer {
  public compose(playerId: number): ServerMessageContainer<ServerMessageActionCanceled> {
    return {
      type: ServerMessageType.actionCanceled,
      message: {
        performingPlayerId: playerId
      },
    };
  }
}
