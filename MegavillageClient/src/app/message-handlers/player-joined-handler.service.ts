import { Injectable } from '@angular/core';
import { ServerMessagePlayerJoined } from 'src/shared/messages/server/server-message-player-joined';
import { GameService } from '../game.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerJoinedHandlerService {

  public constructor(private gameService: GameService) { }

  public handle(message: ServerMessagePlayerJoined): void {
    this.gameService.getGame().gameObjects.push(message.player);
  }
}
