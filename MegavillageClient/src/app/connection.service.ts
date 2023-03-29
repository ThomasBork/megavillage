import { Injectable } from '@angular/core';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { MessageDispatcherService } from './message-dispatcher.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private ws?: WebSocket

  public constructor(private messageDispatcherService: MessageDispatcherService) { }

  public connect(playerName: string) {
    this.ws = new WebSocket('ws://localhost:3000');
  
    this.ws.onopen = (event: Event) => {
      console.log('Connection was opened.');
      if (!this.ws) {
        console.log('Connection was aborted.');
        return;
      }

      this.ws.send('{"type":"joinGame", "message":{"playerName":"' + playerName + '"}}');
    };
  
    this.ws.onmessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data.toString()) as ServerMessageContainer;
      console.log('Message received:', message);
      this.messageDispatcherService.handleMessage(message);
    };
  }
}
