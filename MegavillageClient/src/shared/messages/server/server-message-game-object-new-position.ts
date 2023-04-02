import { Vector2 } from 'src/shared/game-state/vector2';

export interface ServerMessageGameObjectNewPosition {
  gameObjectId: number;
  oldPosition: Vector2;
  newPosition: Vector2;
}
