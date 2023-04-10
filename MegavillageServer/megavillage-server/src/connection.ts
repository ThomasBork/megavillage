import WebSocket from 'ws';
import { ServerMessageContainer } from './shared/messages/server/server-message-container';

export class Connection {
  public webSocket: WebSocket;
  public messageQueue: ServerMessageContainer<object>[];
  
  private userId?: number;
  
  public constructor(webSocket: WebSocket) {
    this.webSocket = webSocket;
    this.messageQueue = [];
  }
  public sendMessage<T extends object>(message: ServerMessageContainer<T>) {
    this.webSocket.send(JSON.stringify(message));
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
  public isAuthenticated(): boolean {
    return this.userId !== undefined;
  }
  public setUserId(id: number): void {
    this.userId = id;
  }
  public getUserId(): number {
    if (!this.userId) {
      throw new Error('Attempted to look up user id while not authenticated.');
    }
    return this.userId;
  }
  public tryGetUserId(): number | undefined {
    return this.userId;
  }
}
