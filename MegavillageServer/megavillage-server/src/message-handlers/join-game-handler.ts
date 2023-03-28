import { Injectable } from '@nestjs/common';
import { Connection } from 'src/connection';
import { GameManager } from 'src/game-manager';
import { Player } from 'src/game/player';
import { Vector2 } from 'src/game/vector2';
import { ClientMessageJoinGame } from 'src/messages/client/client-message-join-game';
import { ServerMessageContainer } from 'src/messages/server/server-message-container';

@Injectable()
export class JoinGameHandler {
  public constructor(private gameManager: GameManager) {}

  public handle(sender: Connection, message: ClientMessageJoinGame): void {
    const game = this.gameManager.game;
    const id = game.nextPlayerId++;
    const position: Vector2 = { x: 0, y: 0 };
    const player: Player = {
      id: id,
      name: message.playerName,
      position: position,
    };
    game.players.push(player);

    const gameStateMessage: ServerMessageContainer = {
      type: 'completeGameState',
      message: {
        game: game,
      },
    };
    sender.sendMessage(gameStateMessage);
  }
}
