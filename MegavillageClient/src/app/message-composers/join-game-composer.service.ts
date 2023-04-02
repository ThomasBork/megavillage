import { Injectable } from '@angular/core';
import { ClientMessageContainer } from 'src/shared/messages/client/client-message-container';
import { ClientMessageJoinGame } from 'src/shared/messages/client/client-message-join-game';
import { ClientMessageType } from 'src/shared/messages/client/client-message-type';
import { PlayerService } from '../player.service';

@Injectable({
  providedIn: 'root'
})
export class JoinGameComposerService {

  constructor(private playerService: PlayerService) { }

  public compose(): ClientMessageContainer<ClientMessageJoinGame> {
    return {
      type: ClientMessageType.joinGame,
      message: {
        playerName: this.playerService.playerName
      }
    };
  }
}
