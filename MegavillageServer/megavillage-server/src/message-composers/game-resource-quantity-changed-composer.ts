import { Injectable } from '@nestjs/common';
import { ResourceType } from 'src/shared/game-state/resource-type';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageGameResourceQuantityChanged } from 'src/shared/messages/server/server-message-game-resource-quantity-changed';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class GameResourceQuantityChangedComposer {
  public compose(oldQuantity: number, newQuantity: number, resourceType: ResourceType): ServerMessageContainer<ServerMessageGameResourceQuantityChanged> {
    return {
      type: ServerMessageType.gameResourceQuantityChanged,
      message: {
        oldQuantity: oldQuantity,
        newQuantity: newQuantity,
        resourceType: resourceType,
      },
    };
  }
}
