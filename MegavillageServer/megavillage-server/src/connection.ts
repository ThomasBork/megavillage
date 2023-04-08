import WebSocket from 'ws';
import { ServerMessageContainer } from './shared/messages/server/server-message-container';

export class Connection {
  public websocket: WebSocket;
  public playerId?: number;
  public messageQueue: ServerMessageContainer<object>[];
  public constructor(websocket: WebSocket) {
    this.websocket = websocket;
    this.messageQueue = [];
  }
  public sendMessage<T extends object>(message: ServerMessageContainer<T>) {
    this.websocket.send(JSON.stringify(message));
  }
  public queueMessage<T extends object>(message: ServerMessageContainer<T>) {
    this.messageQueue.push(message);
  }
  public flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }
}
