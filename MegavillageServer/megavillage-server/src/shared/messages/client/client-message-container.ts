import { ClientMessageType } from './client-message-type';

export interface ClientMessageContainer<T extends object> {
  type: ClientMessageType;
  message: T;
}
