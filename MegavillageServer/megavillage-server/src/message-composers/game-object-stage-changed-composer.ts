import { Injectable } from '@nestjs/common';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageGameObjectStageChanged } from 'src/shared/messages/server/server-message-game-object-stage-changed';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class GameObjectStageChangedComposer {
  public compose(gameObjectId: number, oldStage: number, newStage: number, timeToNextStage: number): ServerMessageContainer<ServerMessageGameObjectStageChanged> {
    return {
      type: ServerMessageType.gameObjectStageChanged,
      message: {
        gameObjectId: gameObjectId,
        oldStage: oldStage,
        newStage: newStage,
        timeToNextStage: timeToNextStage,
      },
    };
  }
}
