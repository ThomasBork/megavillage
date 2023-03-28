import WebSocket from 'ws';
import { ServerMessageContainer } from './messages/server/server-message-container';

export class Connection {
  public websocket: WebSocket;
  public playerId?: number;
  public constructor(websocket: WebSocket) {
    this.websocket = websocket;
  }
  public sendMessage(message: ServerMessageContainer) {
    this.websocket.send(JSON.stringify(message));
  }
}
