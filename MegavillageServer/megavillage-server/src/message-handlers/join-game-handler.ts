import { Injectable } from '@nestjs/common';
import { Connection } from 'src/connection';
import { ConnectionManager } from 'src/connection-manager';
import { GameManager } from 'src/game-manager';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { Player } from 'src/shared/game-state/player';
import { Vector2 } from 'src/shared/game-state/vector2';
import { ClientMessageJoinGame } from 'src/shared/messages/client/client-message-join-game';
import { ServerMessageContainer } from 'src/shared/messages/server/server-message-container';
import { ServerMessageType } from 'src/shared/messages/server/server-message-type';

@Injectable()
export class JoinGameHandler {
  public constructor(
    private gameManager: GameManager,
    private connectionManager: ConnectionManager,
  ) {}

  public handle(sender: Connection, message: ClientMessageJoinGame): void {
    const game = this.gameManager.game;
    const id = game.nextGameObjectId++;
    const position: Vector2 = { x: 0, y: 0 };
    const player: Player = {
      id: id,
      type: GameObjectType.player,
      name: message.playerName,
      position: position,
      velocity: { x: 0, y: 0 },
      blocksMovement: false,
      size: { x: 100, y: 100 },
    };
    game.players.push(player);
    sender.playerId = id;

    const connectionsOfOtherPlayers = game.players
      .filter((p) => p.id != id)
      .map((p) => this.connectionManager.getConnectionForPlayer(p.id));
    const playerJoinedMessage: ServerMessageContainer = {
      type: ServerMessageType.playerJoined,
      message: {
        player: player,
      },
    };
    for (const connectionOfOtherPlayer of connectionsOfOtherPlayers) {
      connectionOfOtherPlayer.sendMessage(playerJoinedMessage);
    }

    const gameStateMessage: ServerMessageContainer = {
      type: ServerMessageType.completeGameState,
      message: {
        game: game,
      },
    };
    sender.sendMessage(gameStateMessage);
  }
}
