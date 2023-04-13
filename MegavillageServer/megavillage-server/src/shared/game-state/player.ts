import { GameObject } from './game-object';
import { Item } from './item';
import { PlayerAction } from './player-action';

export interface Player extends GameObject {
  name: string;
  userId: number;
  action: PlayerAction | null;
  items: Item[];
  maxItemCount: number;
}
