import { Injectable } from '@angular/core';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { JoinGameComposerService } from './message-composers/join-game-composer.service';
import { MessageDispatcherService } from './message-dispatcher.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private ws?: WebSocket

  public constructor(
    private messageDispatcherService: MessageDispatcherService,
    private joinGameComposerService: JoinGameComposerService,
  ) { }

  public connect(playerName: string) {
    this.ws = new WebSocket('ws://localhost:3000');
  
    this.ws.onopen = (event: Event) => {
      console.log('Connection was opened.');
      if (!this.ws) {
        console.log('Connection was aborted.');
        return;
      }

      //this.ws.send('{"type":"joinGame", "message":{"playerName":"' + playerName + '"}}');
      const joinGameMessage = this.joinGameComposerService.compose();
      this.sendMessage(joinGameMessage);
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
