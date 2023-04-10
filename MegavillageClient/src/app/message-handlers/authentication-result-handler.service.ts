import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { ServerMessageAuthenticationResult } from 'src/shared/messages/server/server-message-authentication-result';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationResultHandlerService {

  public constructor(private userService: UserService) { }
  public handle(message: ServerMessageAuthenticationResult): void {
    if (!message.user) {
      throw new Error ('Authentication failed with message: "' + message.errorMessage + '".');
    }
    this.userService.setUser(message.user);
  }
}
