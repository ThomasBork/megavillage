import { GameObject } from './game-object';
import { GameResource } from './game-resource';

export interface Game {
  gameObjects: GameObject[];
  nextGameObjectId: number;
  nextItemId: number;
  sharedResources: GameResource[];
}
