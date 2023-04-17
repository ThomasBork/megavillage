import { Injectable } from '@angular/core';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { ClientMessageTakeItem } from 'src/shared/messages/client/client-message-take-item';
import { ClientMessageType } from 'src/shared/messages/client/client-message-type';

@Injectable({
  providedIn: 'root'
})
export class TakeItemComposerService {
  public compose(giverId: number, itemId: number): ClientMessageContainer<ClientMessageTakeItem> {
    return {
      type: ClientMessageType.takeItem,
      message: {
        giverId: giverId,
        itemId: itemId,
      },
    };
  }
}
