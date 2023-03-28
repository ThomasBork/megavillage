import { Injectable } from '@nestjs/common';
import { Game } from './game/game';

@Injectable()
export class GameManager {
  public game: Game;

  public constructor() {
    this.game = {
      nextPlayerId: 0,
      players: [],
    };
  }
}
