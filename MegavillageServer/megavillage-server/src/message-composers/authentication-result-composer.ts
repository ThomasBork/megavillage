import { Injectable } from '@nestjs/common';
import { ServerMessageAuthenticationResult } from 'src/shared/messages/server/server-message-authentication-result';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';
import { User } from 'src/shared/user/user';

@Injectable()
export class AuthenticationResultComposer {
  public compose(user: User | null, errorMessage: string | null): ServerMessageContainer<ServerMessageAuthenticationResult> {
    return {
      type: ServerMessageType.authenticationResult,
      message: {
        user: user,
        errorMessage: errorMessage,
      },
    };
  }
}
