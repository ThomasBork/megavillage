import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from 'src/shared/game-state/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private game?: Game;
  public onGameStateReceived: Subject<Game>;
  public constructor() { 
    this.onGameStateReceived = new Subject<Game>();
  }

  public setGame(game: Game): void {
    this.game = game;
    this.onGameStateReceived.next(game);
  }

  public getGame(): Game {
    if (!this.game) {
      throw new Error('Game not set yet.');
    }
    return this.game;
  }
}
