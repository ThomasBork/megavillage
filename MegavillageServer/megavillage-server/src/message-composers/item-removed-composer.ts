import { Injectable } from '@nestjs/common';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageItemRemoved } from 'src/shared/messages/server/server-message-item-removed';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class ItemRemovedComposer {
  public compose(playerId: number, itemId: number): ServerMessageContainer<ServerMessageItemRemoved> {
    return {
      type: ServerMessageType.itemRemoved,
      message: {
        playerId: playerId,
        itemId: itemId,
      },
    };
  }
}
