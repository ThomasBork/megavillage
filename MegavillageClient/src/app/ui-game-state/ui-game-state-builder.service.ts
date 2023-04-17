import { Injectable } from '@angular/core';
import { Game } from 'src/shared/game-state/game';
import { UIGame } from './ui-game';
import { GameObject } from 'src/shared/game-state/game-object';
import { UIGameObject } from './ui-game-object';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { UIGameObjectPlayer } from './ui-game-object-player';
import { Player } from 'src/shared/game-state/player';
import { UserService } from '../user.service';
import { Shop } from 'src/shared/game-state/shop';
import { UIGameObjectShop } from './ui-game-object-shop';

@Injectable({
  providedIn: 'root'
})
export class UIGameStateBuilderService {
  public constructor(private userService: UserService) {}

  public build(serverState: Game): UIGame {
    return new UIGame(
      serverState,
      serverState.gameObjects.map((o) => this.buildUIGameObject(o)),
    );
  }
  public buildUIGameObject(serverState: GameObject): UIGameObject {
    if (serverState.type === GameObjectType.player) {
      const playerServerState = serverState as Player;
      return new UIGameObjectPlayer(playerServerState, this.userService.getUser().id === playerServerState.userId);
    } else if (serverState.type === GameObjectType.shop) {
      const shopServerState = serverState as Shop;
      return new UIGameObjectShop(shopServerState);
    }
    return new UIGameObject(serverState);
  }
}
