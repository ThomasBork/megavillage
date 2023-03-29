import { Injectable } from '@nestjs/common';
import { Game } from './shared/game-state/game';
import { GameObject } from './shared/game-state/game-object';
import { GameObjectType } from './shared/game-state/game-object-type';

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

  public constructor() {
    this.builderNextGameObjectId = 0;
    const nonPlayerGameObjects = this.buildWorld();
    this.game = {
      nextGameObjectId: this.builderNextGameObjectId,
      players: [],
      nonPlayerGameObjects: nonPlayerGameObjects,
    };
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
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 2, this.treeHeight * 6),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 6),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 10, this.treeHeight * 10),
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
      velocity: { x: 0, y: 0 },
    };
  }

  private buildTree(id: number, x: number, y: number): GameObject {
    return {
      blocksMovement: true,
      id: id,
      position: { x: x, y: y },
      size: { x: this.treeWidth, y: this.treeHeight },
      type: GameObjectType.tree,
      velocity: { x: 0, y: 0 },
    };
  }
}
