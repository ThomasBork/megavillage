import { Injectable } from '@nestjs/common';
import { Item } from 'src/shared/game-state/item';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageItemGained } from 'src/shared/messages/server/server-message-item-gained';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class ItemGainedComposer {
  public compose(gameObjectId: number, item: Item, index: number): ServerMessageContainer<ServerMessageItemGained> {
    return {
      type: ServerMessageType.itemGained,
      message: {
        gameObjectId: gameObjectId,
        item: item,
        index: index,
      },
    };
  }
}
