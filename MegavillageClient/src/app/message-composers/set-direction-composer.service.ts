import { Injectable } from '@angular/core';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { ClientMessageSetDirection } from 'src/shared/messages/client/client-message-set-direction';
import { ClientMessageType } from 'src/shared/messages/client/client-message-type';
import { Vector2 } from 'src/shared/game-state/vector2';

@Injectable({
  providedIn: 'root'
})
export class SetDirectionComposerService {
  public constructor() { }

  public compose(newDirection: Vector2): ClientMessageContainer<ClientMessageSetDirection> {
    return {
      type: ClientMessageType.setDirection,
      message: {
        newDirection: newDirection,
      },
    };
  }
}
