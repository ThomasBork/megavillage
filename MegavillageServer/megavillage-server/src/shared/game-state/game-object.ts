import { GameObjectType } from './game-object-type';
import { Vector2 } from './vector2';

export interface GameObject {
  id: number;
  type: GameObjectType;
  position: Vector2;
  size: Vector2;
  velocity: Vector2;
  blocksMovement: boolean;
}