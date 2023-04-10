import { Injectable } from '@angular/core';
import { ClientMessageAuthenticate } from 'src/shared/messages/client/client-message-authenticate';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { ClientMessageType } from 'src/shared/messages/client/client-message-type';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateComposerService {
  public compose(authenticationToken: string): ClientMessageContainer<ClientMessageAuthenticate> {
    return {
      type: ClientMessageType.authenticate,
      message: {
        authenticationToken: authenticationToken,
      },
    };
  }
}
