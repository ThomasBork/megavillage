import { Injectable } from '@angular/core';
import { ServerMessagePlayerJoined } from 'src/shared/messages/server/server-message-player-joined';
import { UIGameStateBuilderService } from '../ui-game-state/ui-game-state-builder.service';
import { GameService } from '../game.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerJoinedHandlerService {

  public constructor(
    private gameService: GameService,
    private uiGameStateBuilderService: UIGameStateBuilderService,
  ) { }

  public handle(message: ServerMessagePlayerJoined): void {
    const uiGameObject = this.uiGameStateBuilderService.buildUIGameObject(message.player);
    this.gameService.getGame().addGameObject(uiGameObject);
  }
}
