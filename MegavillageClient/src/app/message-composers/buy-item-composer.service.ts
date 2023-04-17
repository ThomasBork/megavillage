import { Injectable } from '@angular/core';
import { ClientMessageBuyItem } from 'src/shared/messages/client/client-message-buy-item';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { ClientMessageType } from 'src/shared/messages/client/client-message-type';

@Injectable({
  providedIn: 'root'
})
export class BuyItemComposerService {
  public compose(itemRecipeId: number, shopId: number): ClientMessageContainer<ClientMessageBuyItem> {
    return {
      type: ClientMessageType.buyItem,
      message: {
        itemRecipeId: itemRecipeId,
        targetShopId: shopId,
      },
    };
  }
}
