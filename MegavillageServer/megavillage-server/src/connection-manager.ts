import { Injectable } from '@nestjs/common';
import { Connection } from './connection';
import { WebSocket } from 'ws';

@Injectable()
export class ConnectionManager {
  private connections: Connection[];
  public constructor() {
    this.connections = [];
  }
  public addConnection(connection: Connection): void {
    this.connections.push(connection);
  }
  public removeConnection(connection: Connection): void {
    this.connections = this.connections.filter((c) => c !== connection);
  }
  public getConnectionForUser(userId: number): Connection | undefined {
    const connection = this.connections.find((c) => c.tryGetUserId() === userId);
    return connection;
  }
  public getConnectionForWebSocket(webSocket: WebSocket): Connection {
    const connection = this.tryGetConnectionForWebSocket(webSocket);
    if (!connection) {
      throw new Error('No connection found for web socket.');
    }
    return connection;
  }
  public tryGetConnectionForWebSocket(webSocket: WebSocket): Connection | undefined {
    const connection = this.connections.find((c) => c.webSocket === webSocket);
    return connection;
  }
}
