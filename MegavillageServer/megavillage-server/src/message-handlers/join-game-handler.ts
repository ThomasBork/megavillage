import { Injectable } from '@nestjs/common';
import { Connection } from 'src/connection';
import { ConnectionManager } from 'src/connection-manager';
import { GameManager } from 'src/game-manager';
import { CompleteGameStateComposer } from 'src/message-composers/complete-game-state-composer';
import { PlayerJoinedComposer } from 'src/message-composers/player-joined-composer';
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
    private completeGameStateComposer: CompleteGameStateComposer,
    private playerJoinedComposer: PlayerJoinedComposer,
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
      direction: { x: 0, y: 0 },
      blocksMovement: false,
      size: { x: 100, y: 100 },
      speed: 250,
    };
    game.gameObjects.push(player);
    sender.playerId = id;

    const connectionsOfOtherPlayers = this.gameManager
      .getPlayers()
      .filter((p) => p.id != id)
      .map((p) => this.connectionManager.getConnectionForPlayer(p.id));
    const playerJoinedMessage = this.playerJoinedComposer.compose(player);
    for (const connectionOfOtherPlayer of connectionsOfOtherPlayers) {
      connectionOfOtherPlayer.sendMessage(playerJoinedMessage);
    }

    const gameStateMessage = this.completeGameStateComposer.compose(game);
    sender.sendMessage(gameStateMessage);
  }
}
