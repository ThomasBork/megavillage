import WebSocket from 'ws';
import { ServerMessageContainer } from './shared/messages/server/server-message-container';

export class Connection {
  public websocket: WebSocket;
  public playerId?: number;
  public constructor(websocket: WebSocket) {
    this.websocket = websocket;
  }
  public sendMessage<T extends object>(message: ServerMessageContainer<T>) {
    this.websocket.send(JSON.stringify(message));
  }
}
