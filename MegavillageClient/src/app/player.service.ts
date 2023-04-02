import { Injectable } from '@angular/core';
import { Game } from 'src/shared/game-state/game';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { Player } from 'src/shared/game-state/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  public playerName: string;
  constructor() { 
    this.playerName = 'player' + Math.floor(Math.random() * 1000000);
  }

  public getPlayers(game: Game): Player[] {
    return game.gameObjects
      .filter(g => g.type === GameObjectType.player) as Player[];
  }

  public getPlayer(game: Game): Player {
    const player = this.getPlayers(game).find(p => p.name === this.playerName);
    if (!player) {
      throw new Error('Player not found in game: "' + this.playerName + '"');
    }
    return player;
  }
}
