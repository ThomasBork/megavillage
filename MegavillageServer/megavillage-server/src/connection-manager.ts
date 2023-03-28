import { Injectable } from '@nestjs/common';
import { Connection } from './connection';

@Injectable()
export class ConnectionManager {
  private connections: Connection[];
  public constructor() {
    this.connections = [];
  }
}
