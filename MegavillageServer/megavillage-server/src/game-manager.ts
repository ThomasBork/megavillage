import { Injectable } from '@nestjs/common';
import { ConnectionManager } from './connection-manager';
import { Game } from './shared/game-state/game';
import { GameObject } from './shared/game-state/game-object';
import { GameObjectType } from './shared/game-state/game-object-type';
import { Player } from './shared/game-state/player';
import { ServerMessageContainer } from './shared/messages/server/server-message-container';
import { Connection } from './connection';
import { VectorService } from './vector.service';
import { UserService } from './user.service';
import { PlayerJoinedComposer } from './message-composers/player-joined-composer';

@Injectable()
export class GameManager {
  public game: Game;

  private mapWidth = 10000;
  private mapHeight = 10000;
  private mapMinX = -this.mapWidth / 2;
  private mapMaxX = this.mapWidth / 2;
  private mapMinY = -this.mapHeight / 2;
  private mapMaxY = this.mapHeight / 2;
  private rockWidth = 50;
  private rockHeight = 50;
  private treeWidth = 100;
  private treeHeight = 100;
  private builderNextGameObjectId: number;

  public constructor(
    private connectionManager: ConnectionManager,
    private vectorService: VectorService,
    private userService: UserService,
    private playerJoinedComposer: PlayerJoinedComposer,
  ) {
    this.builderNextGameObjectId = 0;
    const gameObjects = this.buildWorld();
    this.game = {
      nextGameObjectId: this.builderNextGameObjectId,
      gameObjects: gameObjects,
    };
  }

  public queueMessageToAllPlayers<T extends object>(message: ServerMessageContainer<T>): void {
    for (const connection of this.getConnectionsForAllPlayers()) {
      connection.queueMessage(message);
    }
  }

  public sendMessageToAllPlayers<T extends object>(message: ServerMessageContainer<T>): void {
    for (const connection of this.getConnectionsForAllPlayers()) {
      connection.sendMessage(message);
    }
  }

  public getConnectionsForAllPlayers(): Connection[] {
    return this.getPlayers()
      .map((p) => this.connectionManager.getConnectionForUser(p.userId))
      .filter((c) => c !== undefined);
  }

  public getGame(): Game {
    if (!this.game) {
      throw new Error('Game not initialized.');
    }
    return this.game;
  }

  public getPlayerByUserId(userId: number): Player | undefined {
    return this.getPlayers()
      .find((p) => p.userId === userId);
  }

  public getObjectById(gameObjectId: number): GameObject | undefined {
    return this.getGame().gameObjects
      .find((o) => o.id === gameObjectId);
  }

  public getPlayers(): Player[] {
    return this.getGame()
      .gameObjects
      .filter(g => g.type === GameObjectType.player) as Player[];
  }

  public removeObject(gameObjectId: number): void {
    this.getGame().gameObjects = this.getGame().gameObjects.filter((o) => o.id !== gameObjectId);
  }

  public addPlayerForUser(userId: number): void {
    const existingPlayer = this.getPlayerByUserId(userId);
    if (existingPlayer) {
      return;
    }
    const user = this.userService.getUserWithId(userId);
    const playerId = this.game.nextGameObjectId++;
    const player: Player = {
      id: playerId,
      type: GameObjectType.player,
      name: user.userName,
      position: this.vectorService.buildVector(0, 0),
      direction: this.vectorService.buildVector(0, 0),
      blocksMovement: false,
      size: this.vectorService.buildVector(100, 100),
      speed: 250,
      userId: userId,
      action: null,
    };
    this.game.gameObjects.push(player);

    const connectionsOfOtherUsers = this
      .getConnectionsForAllPlayers()
      .filter((c) => c.getUserId() !== userId);
    const playerJoinedMessage = this.playerJoinedComposer.compose(player);
    for (const connectionOfOtherPlayer of connectionsOfOtherUsers) {
      connectionOfOtherPlayer.sendMessage(playerJoinedMessage);
    }
  }

  private buildWorld(): GameObject[] {
    const objects: GameObject[] = [];
    for (let x = this.mapMinX; x <= this.mapMaxX - this.rockWidth; x += this.rockWidth) {
      objects.push(this.buildRock(this.builderNextGameObjectId++, x, this.mapMinY));
      objects.push(this.buildRock(this.builderNextGameObjectId++, x, this.mapMaxY - this.rockHeight));
    }
    for (let y = this.mapMinY + this.rockHeight; y <= this.mapMaxY - 2 * this.rockHeight; y += this.rockHeight) {
      objects.push(this.buildRock(this.builderNextGameObjectId++, this.mapMinX, y));
      objects.push(this.buildRock(this.builderNextGameObjectId++, this.mapMaxX - this.rockWidth, y));
    }
    objects.push(
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 2, this.treeHeight * 2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 4, this.treeHeight * 2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 2, this.treeHeight * 6),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 6),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 10, this.treeHeight * 10),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -2, this.treeHeight * -2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -3, this.treeHeight * -2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -2, this.treeHeight * -3),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -2, this.treeHeight * -4),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -2, this.treeHeight * -5),
    );
    return objects;
  }

  private buildRock(id: number, x: number, y: number): GameObject {
    return {
      blocksMovement: true,
      id: id,
      position: { x: x, y: y },
      size: { x: this.rockWidth, y: this.rockHeight },
      type: GameObjectType.rock,
      direction: { x: 0, y: 0 },
      speed: 0,
    };
  }

  private buildTree(id: number, x: number, y: number): GameObject {
    return {
      blocksMovement: true,
      id: id,
      position: { x: x, y: y },
      size: { x: this.treeWidth, y: this.treeHeight },
      type: GameObjectType.tree,
      direction: { x: 0, y: 0 },
      speed: 0,
    };
  }
}
