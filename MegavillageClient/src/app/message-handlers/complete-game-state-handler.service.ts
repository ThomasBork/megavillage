import { Injectable } from '@angular/core';
import { ServerMessageCompleteGameState } from 'src/shared/messages/server/server-message-complete-game-state';
import { GameService } from '../game.service';

@Injectable({
  providedIn: 'root'
})
export class CompleteGameStateHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessageCompleteGameState): void {
    this.gameService.setGame(message.game);
  }
}
