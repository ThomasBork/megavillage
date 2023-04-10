export enum ServerMessageType {
  authenticationResult = 'authenticationResult',
  connectionClosed = 'connectionClosed',
  playerJoined = 'playerJoined',
  completeGameState = 'completeGameState',
  gameObjectNewPosition = 'gameObjectNewPosition',
  actionStarted = 'actionStarted',
  actionCanceled = 'actionCanceled',
  actionCompleted = 'actionCompleted',
  gameObjectRemoved = 'gameObjectRemoved',
}
