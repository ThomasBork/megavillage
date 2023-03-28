import { Player } from './player';

export interface Game {
  players: Player[];
  nextPlayerId: number;
}
