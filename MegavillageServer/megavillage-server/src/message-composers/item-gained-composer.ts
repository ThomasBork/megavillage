import { Injectable } from '@nestjs/common';
import { Item } from 'src/shared/game-state/item';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageItemGained } from 'src/shared/messages/server/server-message-item-gained';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class ItemGainedComposer {
  public compose(playerId: number, item: Item): ServerMessageContainer<ServerMessageItemGained> {
    return {
      type: ServerMessageType.itemGained,
      message: {
        playerId: playerId,
        item: item,
      },
    };
  }
}
