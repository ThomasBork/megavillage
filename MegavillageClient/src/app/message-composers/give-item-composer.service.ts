import { Injectable } from '@angular/core';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { ClientMessageGiveItem } from 'src/shared/messages/client/client-message-give-item';
import { ClientMessageType } from 'src/shared/messages/client/client-message-type';

@Injectable({
  providedIn: 'root'
})
export class GiveItemComposerService {
  public compose(receiverId: number, itemId: number): ClientMessageContainer<ClientMessageGiveItem> {
    return {
      type: ClientMessageType.giveItem,
      message: {
        receiverId: receiverId,
        itemId: itemId,
      },
    };
  }
}
