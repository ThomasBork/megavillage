import { GameObject } from './game-object';

export interface Player extends GameObject {
  name: string;
  userId: number;
}
