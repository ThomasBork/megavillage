import { GameObject } from './game-object';

export interface Game {
  gameObjects: GameObject[];
  nextGameObjectId: number;
}
