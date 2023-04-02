import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from 'src/shared/game-state/game';
import { GameObject } from 'src/shared/game-state/game-object';
import { Player } from 'src/shared/game-state/player';
import { PlayerService } from './player.service';

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

  public getGameObject(id: number): GameObject {
    const gameObject = this.getGame().gameObjects.find(g => g.id === id);
    if (!gameObject) {
      throw new Error('Game object could not be found. Id: "' + id + '".');
    }
    return gameObject;
  }
}
