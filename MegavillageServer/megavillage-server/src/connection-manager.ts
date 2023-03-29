import { Injectable } from '@nestjs/common';
import { Connection } from './connection';

@Injectable()
export class ConnectionManager {
  public connections: Connection[];
  public constructor() {
    this.connections = [];
  }
  public getConnectionForPlayer(playerId: number): Connection {
    const connection = this.connections.find((c) => c.playerId === playerId);
    if (!connection) {
      throw new Error('No connection found for player id: "' + playerId + '".');
    }
    return connection;
  }
}
