import { GameObject } from './game-object';
import { Player } from './player';

export interface Game {
  players: Player[];
  nonPlayerGameObjects: GameObject[];
  nextGameObjectId: number;
}
