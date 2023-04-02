import { Injectable } from '@nestjs/common';
import { Vector2 } from 'src/shared/game-state/vector2';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageGameObjectNewPosition } from 'src/shared/messages/server/server-message-game-object-new-position';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class GameObjectNewPositionComposer {
  public compose(gameObjectId: number, oldPosition: Vector2, newPosition: Vector2): ServerMessageContainer<ServerMessageGameObjectNewPosition> {
    return {
      type: ServerMessageType.gameObjectNewPosition,
      message: {
        gameObjectId: gameObjectId,
        newPosition: newPosition,
        oldPosition: oldPosition,
      },
    };
  }
}
