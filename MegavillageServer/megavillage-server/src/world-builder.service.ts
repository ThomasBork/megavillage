import { Injectable } from '@nestjs/common';
import { GameObject } from './shared/game-state/game-object';
import { GameObjectType } from './shared/game-state/game-object-type';
import { Shop } from './shared/game-state/shop';
import { PlayerActionType } from './shared/game-state/player-action-type';
import { ResourceType } from './shared/game-state/resource-type';
import { ItemType } from './shared/game-state/item-type';
import { GameObjectWithStages } from './shared/game-state/game-object-with-stages';

@Injectable()
export class WorldBuilderService {
  private mapWidth = 10000;
  private mapHeight = 10000;
  private mapMinX = -this.mapWidth / 2;
  private mapMaxX = this.mapWidth / 2;
  private mapMinY = -this.mapHeight / 2;
  private mapMaxY = this.mapHeight / 2;
  private rockWidth = 50;
  private rockHeight = 50;
  private treeWidth = 80;
  private treeHeight = 100;
  private shopWidth = 600;
  private shopHeight = 200;
  private bushWidth = 50;
  private bushHeight = 50;
  private bushMaxStages = 4;
  private bushTotalTimePerStage = 10000;
  public builderNextGameObjectId: number;

  public constructor() {
    this.builderNextGameObjectId = 0;
  }

  public buildWorld(): GameObject[] {
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
      this.buildRock(this.builderNextGameObjectId++, this.rockWidth * -2, this.rockHeight * 2),
      this.buildRock(this.builderNextGameObjectId++, this.rockWidth * -2, this.rockHeight * 4),
      this.buildRock(this.builderNextGameObjectId++, this.rockWidth * -2, this.rockHeight * 7),
      this.buildRock(this.builderNextGameObjectId++, this.rockWidth * -2, this.rockHeight * 8),
      this.buildRock(this.builderNextGameObjectId++, this.rockWidth * -2, this.rockHeight * 9),
      this.buildRock(this.builderNextGameObjectId++, this.rockWidth * -3, this.rockHeight * 9),
      this.buildRock(this.builderNextGameObjectId++, this.rockWidth * -4, this.rockHeight * 9),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 2, this.treeHeight * 2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 4, this.treeHeight * 2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 3),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 4),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 5),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 6),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 7),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 8),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 9),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 6, this.treeHeight * 10),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 2, this.treeHeight * 6),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * 10, this.treeHeight * 10),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -7, this.treeHeight * -2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -8, this.treeHeight * -2),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -7, this.treeHeight * -3),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -7, this.treeHeight * -4),
      this.buildTree(this.builderNextGameObjectId++, this.treeWidth * -7, this.treeHeight * -5),
      this.buildShop(this.builderNextGameObjectId++, 0, -400),
      this.buildBush(this.builderNextGameObjectId++, this.bushWidth * -6, this.bushHeight * 0, 1, this.bushTotalTimePerStage),
      this.buildBush(this.builderNextGameObjectId++, this.bushWidth * -6, this.bushHeight * 1, 1, this.bushTotalTimePerStage / 2),
      this.buildBush(this.builderNextGameObjectId++, this.bushWidth * -6, this.bushHeight * 2, 2, this.bushTotalTimePerStage),
      this.buildBush(this.builderNextGameObjectId++, this.bushWidth * -6, this.bushHeight * 3, 2, this.bushTotalTimePerStage / 2),
      this.buildBush(this.builderNextGameObjectId++, this.bushWidth * -6, this.bushHeight * 4, 3, this.bushTotalTimePerStage),
      this.buildBush(this.builderNextGameObjectId++, this.bushWidth * -6, this.bushHeight * 5, 3, this.bushTotalTimePerStage / 2),
      this.buildBush(this.builderNextGameObjectId++, this.bushWidth * -6, this.bushHeight * 6, 4, 0),
      this.buildBush(this.builderNextGameObjectId++, this.bushWidth * -6, this.bushHeight * 7, 4, 0),
    );
    return objects;
  }

  private buildShop(id: number, x: number, y: number): Shop {
    const shop: Shop = {
      blocksMovement: true,
      id: id,
      position: { x: x, y: y },
      size: { x: this.shopWidth, y: this.shopHeight },
      type: GameObjectType.shop,
      direction: { x: 0, y: 0 },
      speed: 0,
      items: [],
      maxItemCount: 32,
      itemsForSale: [{
        id: this.builderNextGameObjectId++,
        actionsEnabledByItem: [{
          actionType: PlayerActionType.mine,
          targetType: GameObjectType.rock,
        }],
        cost: [{
          quantity: 200,
          resourceType: ResourceType.wood,
        }],
        name: 'Drill',
        type: ItemType.drill,
      }, {
        id: this.builderNextGameObjectId++,
        actionsEnabledByItem: [{
          actionType: PlayerActionType.mine,
          targetType: GameObjectType.rock,
        }],
        cost: [{
          quantity: 300,
          resourceType: ResourceType.wood,
        }, {
          quantity: 200,
          resourceType: ResourceType.stone,
        }],
        name: 'Fishing Rod',
        type: ItemType.fishingRod,
      }]
    };
    shop.items.length = shop.maxItemCount;
    for (let i = 0; i<shop.maxItemCount; i++) {
      if (shop.items[i] === undefined) {
        shop.items[i] = null;
      }
    }
    return shop;
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
      items: [],
      maxItemCount: 0,
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
      items: [],
      maxItemCount: 0,
    };
  }

  private buildBush(id: number, x: number, y: number, currentStage: number, timeUntilNextStage: number): GameObjectWithStages {
    return {
      blocksMovement: true,
      id: id,
      position: { x: x, y: y },
      size: { x: this.bushWidth, y: this.bushHeight },
      type: GameObjectType.bush,
      direction: { x: 0, y: 0 },
      speed: 0,
      items: [],
      maxItemCount: 0,
      currentStage: currentStage,
      maxStages: this.bushMaxStages,
      timeUntilNextStage: timeUntilNextStage,
      totalTimePerStage: this.bushTotalTimePerStage,
    };
  }
}
