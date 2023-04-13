import { Injectable } from '@nestjs/common';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageItemResourceStackQuantityChanged } from 'src/shared/messages/server/server-message-item-resource-stack-quantity-changed';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class ItemResourceStackQuantityChangedComposer {
  public compose(
    playerId: number, 
    itemId: number,
    oldQuantity: number,
    newQuantity: number
  ): ServerMessageContainer<ServerMessageItemResourceStackQuantityChanged> {
    return {
      type: ServerMessageType.itemResourceStackQuantityChanged,
      message: {
        playerId: playerId,
        itemId: itemId,
        newQuantity: newQuantity,
        oldQuantity: oldQuantity
      },
    };
  }
}
