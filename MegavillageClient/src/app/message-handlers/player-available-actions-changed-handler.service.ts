import { Injectable } from '@angular/core';
import { GameService } from '../game.service';
import { ServerMessagePlayerAvailableActionsChanged } from 'src/shared/messages/server/server-message-player-available-actions-changed';

@Injectable({
  providedIn: 'root'
})
export class PlayerAvailableActionsChangedHandlerService {

  public constructor(
    private gameService: GameService,
  ) { }

  public handle(message: ServerMessagePlayerAvailableActionsChanged): void {
    const player = this.gameService.getPlayer(message.playerId);
    player.setAvailableActions(message.availableActions);
  }
}
