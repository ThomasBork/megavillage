import WebSocket from 'ws';
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Connection } from './connection';
import { MessageDispatcher } from './message-dispatcher';
import { ClientMessageContainer } from './shared/messages/client/client-message-container';
import { ConnectionManager } from './connection-manager';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('AppGateway');

  public constructor(
    private messageDispatcher: MessageDispatcher,
    private connectionManager: ConnectionManager,
  ) {}

  public async handleDisconnect(client: WebSocket): Promise<void> {
    this.logger.log("Client disconnected.");
    // const connection = this.connectionsManager.getConnectionFromWebSocketClient(client);
    // this.connectionsManager.removeConnection(client);
    // if (connection && connection.user) {
    //   const messageContent = `${connection.user.userName} disconnected.`;
    //   const message = new ContractChatMessageSentMessage(connection.user.id, connection.user.userName, messageContent, ContractServerChatMessageType.userDisconnected);
    //   this.connectionsManager.sendMessageToAll(message);
    // }
  }

  public async handleConnection(client: WebSocket, ...args: any[]): Promise<void> {
    this.logger.log(`Client connected.`);
    const connection = new Connection(client);
    client.onmessage = async (event) => {
      this.logger.log('Client message received: ' + event.data);
      const message = JSON.parse(event.data.toString()) as ClientMessageContainer;
      this.messageDispatcher.dispatchMessage(
        connection,
        message
      );
    };
    this.connectionManager.connections.push(connection);
  }
}
