import { Injectable } from '@angular/core';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { MessageDispatcherService } from './message-dispatcher.service';
import { AuthenticateComposerService } from './message-composers/authenticate-composer.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private ws?: WebSocket

  public constructor(
    private messageDispatcherService: MessageDispatcherService,
    private authenticateComposerService: AuthenticateComposerService,
  ) { }

  public connect(authenticationToken: string) {
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onclose = (event: CloseEvent) => {
      this.ws = undefined;
    };
  
    this.ws.onopen = (event: Event) => {
      console.log('Connection was opened.');
      if (!this.ws) {
        console.log('Connection was aborted.');
        return;
      }

      const authenticateMessage = this.authenticateComposerService.compose(authenticationToken);
      this.sendMessage(authenticateMessage);
    };
  
    this.ws.onmessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data.toString());
      console.log('Message received:', message);
      this.messageDispatcherService.handleMessage(message);
    };
  }

  public sendMessage<T extends object>(messageContainer: ClientMessageContainer<T>): void {
    if (!this.ws) {
      throw new Error('Unable to send message to undefined websocket.');
    }
    const jsonMessage = JSON.stringify(messageContainer);
    this.ws.send(jsonMessage);
  }
}
