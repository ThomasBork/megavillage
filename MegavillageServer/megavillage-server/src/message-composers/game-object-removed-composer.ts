import { Injectable } from '@nestjs/common';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageGameObjectRemoved } from 'src/shared/messages/server/server-message-game-object-removed';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class GameObjectRemovedComposer {
  public compose(gameObjectId: number): ServerMessageContainer<ServerMessageGameObjectRemoved> {
    return {
      type: ServerMessageType.gameObjectRemoved,
      message: {
        gameObjectId: gameObjectId,
      },
    };
  }
}
