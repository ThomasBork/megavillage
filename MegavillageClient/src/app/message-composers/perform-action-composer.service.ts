import { Injectable } from '@angular/core';
import { PlayerActionType } from 'src/shared/game-state/player-action-type';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { ClientMessagePerformAction } from 'src/shared/messages/client/client-message-perform-action';
import { ClientMessageType } from 'src/shared/messages/client/client-message-type';

@Injectable({
  providedIn: 'root'
})
export class PerformActionComposerService {
  public compose(type: PlayerActionType, targetId: number): ClientMessageContainer<ClientMessagePerformAction> {
    return {
      type: ClientMessageType.performAction,
      message: {
        type: type,
        targetGameObjectId: targetId,
      },
    };
  }
}
