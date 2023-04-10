import { Injectable } from '@nestjs/common';
import { ServerMessageConnectionClosed } from 'src/shared/messages/server/server-message-connection-closed';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class ConnectionClosedComposer {
  public compose(reason: string): ServerMessageContainer<ServerMessageConnectionClosed> {
    return {
      type: ServerMessageType.connectionClosed,
      message: {
        reason: reason,
      },
    };
  }
}
