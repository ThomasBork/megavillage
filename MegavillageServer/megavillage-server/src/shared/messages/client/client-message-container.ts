import { ClientMessageType } from './client-message-type';

export interface ClientMessageContainer {
  type: ClientMessageType;
  message: object;
}
