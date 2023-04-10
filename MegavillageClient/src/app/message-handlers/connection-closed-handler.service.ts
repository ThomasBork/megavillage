import { Injectable } from '@angular/core';
import { ServerMessageConnectionClosed } from 'src/shared/messages/server/server-message-connection-closed';

@Injectable({
  providedIn: 'root'
})
export class ConnectionClosedHandlerService {
  public handle(message: ServerMessageConnectionClosed): void {
    alert(message.reason);
  }
}
