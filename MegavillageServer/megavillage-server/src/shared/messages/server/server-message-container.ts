import { ServerMessageType } from './server-message-type';

export interface ServerMessageContainer<T extends object> {
  type: ServerMessageType;
  message: T;
}
