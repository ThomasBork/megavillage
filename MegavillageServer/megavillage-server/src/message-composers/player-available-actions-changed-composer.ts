import { Injectable } from '@nestjs/common';
import { ActionTypeWithTargetType } from 'src/shared/game-state/action-type-with-target-type';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessagePlayerAvailableActionsChanged } from 'src/shared/messages/server/server-message-player-available-actions-changed';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class PlayerAvailableActionsChangedComposer {
  public compose(playerId: number, availableActions: ActionTypeWithTargetType[]): ServerMessageContainer<ServerMessagePlayerAvailableActionsChanged> {
    return {
      type: ServerMessageType.playerAvailableActionsChanged,
      message: {
        playerId: playerId,
        availableActions: availableActions,
      },
    };
  }
}
