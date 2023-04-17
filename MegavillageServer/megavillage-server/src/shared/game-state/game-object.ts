import { GameObjectType } from './game-object-type';
import { Item } from './item';
import { Vector2 } from './vector2';

export interface GameObject {
  id: number;
  type: GameObjectType;
  position: Vector2;
  size: Vector2;
  direction: Vector2;
  speed: number;
  blocksMovement: boolean;
  items: (Item | null)[];
  maxItemCount: number;
}
