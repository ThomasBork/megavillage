import { Injectable } from '@angular/core';
import { Game } from 'src/shared/game-state/game';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { Player } from 'src/shared/game-state/player';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  constructor(private userService: UserService) {}

  public getPlayers(game: Game): Player[] {
    return game.gameObjects
      .filter(g => g.type === GameObjectType.player) as Player[];
  }

  public getPlayer(game: Game): Player {
    const user = this.userService.user;
    if (!user) {
      throw new Error ('User not authenticated.');
    }
    const player = this.getPlayers(game).find(p => p.userId === user.id);
    if (!player) {
      throw new Error('Player not found in game for user with id: "' + user.id + '"');
    }
    return player;
  }
}
