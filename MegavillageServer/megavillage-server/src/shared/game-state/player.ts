import { GameObject } from './game-object';
import { PlayerAction } from './player-action';

export interface Player extends GameObject {
  name: string;
  userId: number;
  action: PlayerAction | null;
}
