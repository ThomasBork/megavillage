import { ServerMessageType } from './server-message-type';

export interface ServerMessageContainer {
  type: ServerMessageType;
  message: object;
}
