import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { GameManager } from 'src/game-manager';
import { GameObjectNewPositionComposer } from 'src/message-composers/game-object-new-position-composer';
import { Game } from 'src/shared/game-state/game';
import { VectorService } from 'src/vector.service';
import { InputBufferService } from './input-buffer/input-buffer.service';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { Player } from 'src/shared/game-state/player';
import { Vector2 } from 'src/shared/game-state/vector2';
import { GameObject } from 'src/shared/game-state/game-object';
import { GameObjectService } from 'src/game-object.service';
import { ActionCompletedComposer } from 'src/message-composers/action-completed-composer';
import { GameObjectRemovedComposer } from 'src/message-composers/game-object-removed-composer';
import { ActionCanceledComposer } from 'src/message-composers/action-canceled-composer';
import { PlayerActionType } from 'src/shared/game-state/player-action-type';
import { ItemType } from 'src/shared/game-state/item-type';
import { ItemResourceStack } from 'src/shared/game-state/item-resource-stack';
import { ResourceType } from 'src/shared/game-state/resource-type';
import { ItemResourceStackQuantityChangedComposer } from 'src/message-composers/item-resource-stack-quantity-changed-composer';
import { ItemGainedComposer } from 'src/message-composers/item-gained-composer';

@Injectable()
export class GameLoop implements OnApplicationBootstrap {
  private readonly tickFrequencyInMilliseconds: number;
  private updatingInterval?: NodeJS.Timeout;
  private logger: Logger = new Logger('GameLoop');
  private previousTickTime: number;
  private currentTickTime: number;
  private tickLog: number[];

  public constructor(
    private gameManager: GameManager,
    private vectorService: VectorService,
    private gameObjectNewPositionComposer: GameObjectNewPositionComposer,
    private actionCompletedComposer: ActionCompletedComposer,
    private actionCanceledComposer: ActionCanceledComposer,
    private gameObjectRemovedComposer: GameObjectRemovedComposer,
    private inputBufferService: InputBufferService,
    private gameObjectService: GameObjectService,
    private itemResourceStackQuantityChangedComposer: ItemResourceStackQuantityChangedComposer,
    private itemGainedComposer: ItemGainedComposer,
  ) {
    this.tickFrequencyInMilliseconds = 50;
  }

  public onApplicationBootstrap() {
    this.tickLog = [];
    this.previousTickTime = Date.now();
    this.updatingInterval = setInterval(() => this.updateGameState(), this.tickFrequencyInMilliseconds);
  }

  private updateGameState(): void {
    const now = Date.now();
    while (this.previousTickTime + this.tickFrequencyInMilliseconds < now) {
      this.currentTickTime = this.previousTickTime + this.tickFrequencyInMilliseconds;
      const game = this.gameManager.getGame();
      this.updatePlayerActions(game);
      this.updateGameObjectMovement(game);
      this.previousTickTime = this.currentTickTime;
    }
    this.flushMessageQueues();
  }

  private updatePlayerActions(game: Game): void {
    for (const gameObject of game.gameObjects) {
      if (gameObject.type === GameObjectType.player) {
        const player = gameObject as Player;
        if (player.action) {
          const action = player.action;
          action.timeRemainingInMilliseconds -= this.tickFrequencyInMilliseconds;
          if (action.timeRemainingInMilliseconds < 0) {
            const actionCompletedMessage = this.actionCompletedComposer.compose(player.id);
            this.gameManager.queueMessageToAllPlayers(actionCompletedMessage);

            switch (action.type) {
              case PlayerActionType.chop: {
                this.gameManager.removeObject(action.targetGameObjectId);
                const targetRemovedMessage = this.gameObjectRemovedComposer.compose(action.targetGameObjectId);
                this.gameManager.queueMessageToAllPlayers(targetRemovedMessage);

                const woodToGive = 20 + Math.floor(Math.random() * 10);
                this.giveResourcesToPlayer(player, ResourceType.wood, woodToGive);
                break;
              }
              default: throw new Error('No logic for handling player action: "' + action.type + '".');
            }

            player.action = null;
          }
        }
      }
    }
  }

  private giveResourcesToPlayer(player:Player, resourceType: ResourceType, quantity: number): void {
    let quantityLeftToGive = quantity;
    for (const item of player.items) {
      if (item.type === ItemType.resourceStack) {
        const resourceStack = item as ItemResourceStack;
        if (resourceStack.resourceType === resourceType) {
          const spaceInStack = resourceStack.maxQuantity - resourceStack.quantity;
          if (spaceInStack > 0) {
            const quantityToAddToStack = Math.min(spaceInStack, quantityLeftToGive);
            const oldQuantity = resourceStack.quantity;
            resourceStack.quantity += quantityToAddToStack;
            quantityLeftToGive -= quantityToAddToStack;

            const stackQuantityChangedMessage = this.itemResourceStackQuantityChangedComposer.compose(
              player.id, 
              resourceStack.id,
              oldQuantity,
              resourceStack.quantity);
            this.gameManager.queueMessageToAllPlayers(stackQuantityChangedMessage);

            if (quantityLeftToGive === 0) {
              break;
            }
          }
        }
      }
    }

    const maxQuantity = this.getResourceStackMaxQuantity(resourceType);
    while (
      quantityLeftToGive > 0 
      && player.items.length < player.maxItemCount
    ) {
      const quantityToAddToStack = Math.min(maxQuantity, quantityLeftToGive);
      quantityLeftToGive -= quantityToAddToStack;
      const itemResourceStack: ItemResourceStack = {
        id: this.gameManager.getGame().nextItemId++,
        actionsEnabledByItem: [],
        maxQuantity: maxQuantity,
        name: 'Stack of ' + resourceType,
        quantity: quantityToAddToStack,
        resourceType: resourceType,
        type: ItemType.resourceStack,
      };
      player.items.push(itemResourceStack);
      const itemGainedMessage = this.itemGainedComposer.compose(player.id, itemResourceStack);
      this.gameManager.queueMessageToAllPlayers(itemGainedMessage);
    }
  }

  private getResourceStackMaxQuantity(resourceType: ResourceType): number {
    switch(resourceType) {
      case ResourceType.wood: return 50;
      case ResourceType.stone: return 30;
      default: throw new Error('No resource stack max quantity for: "' + resourceType + '".');
    }
  }

  private updateGameObjectMovement(game: Game): void {
    for (const gameObject of game.gameObjects) {
      let direction = gameObject.direction;
      if (gameObject.type === GameObjectType.player) {
        direction = this.calculateAndUpdateDirectionForPlayer(gameObject as Player);
      }

      if (this.vectorService.getLength(direction) !== 0) {
        const tickOverSecond = this.tickFrequencyInMilliseconds / 1000;
        let tickMovementVector = this.vectorService.multiplyVector(direction, tickOverSecond);
        tickMovementVector = this.vectorService.multiplyVector(tickMovementVector, gameObject.speed);
        tickMovementVector = this.capMovementByCollision(gameObject, tickMovementVector, game.gameObjects);
        // Intentionally calling capMovementByCollision again in case the capped movement results in another collision. The most common case of this is in corners.
        tickMovementVector = this.capMovementByCollision(gameObject, tickMovementVector, game.gameObjects);
        const oldGameObjectPosition = gameObject.position;
        const newGameObjectPosition = this.vectorService.addVectors(gameObject.position, tickMovementVector);
        gameObject.position = newGameObjectPosition;
        if (!this.vectorService.areIdentical(oldGameObjectPosition, newGameObjectPosition)) {
          const newPositionMessage = this.gameObjectNewPositionComposer.compose(gameObject.id, oldGameObjectPosition, newGameObjectPosition);
          this.gameManager.queueMessageToAllPlayers(newPositionMessage);

          if (gameObject.type === GameObjectType.player) {
            const playerObject = gameObject as Player;
            if (playerObject.action) {
              const actionCanceledMessage = this.actionCanceledComposer.compose(playerObject.id);
              this.gameManager.queueMessageToAllPlayers(actionCanceledMessage);
              playerObject.action = null;
            }
          }
        }
      }
    }
  }

  private calculateAndUpdateDirectionForPlayer(player: Player): Vector2 {
    let previousDirection = player.direction;
    let previousDirectionChangeTime = this.previousTickTime;
    let combinedDirection = this.vectorService.buildVector(0, 0);
    const tempLog: {multiplier: number, direction: Vector2}[] = [];
    const directionQueue = this.inputBufferService.popDirectionInputQueueForPlayerUntilTime(player.id, this.currentTickTime);
    for (const directionChange of directionQueue) {
      const durationOfPreviousDirection = directionChange.time.getTime() - previousDirectionChangeTime;
      const vectorMultiplier = durationOfPreviousDirection / this.tickFrequencyInMilliseconds;
      const partialDirection = this.vectorService.multiplyVector(previousDirection, vectorMultiplier);
      tempLog.push({multiplier: vectorMultiplier, direction: previousDirection});
      combinedDirection = this.vectorService.addVectors(combinedDirection, partialDirection);
      previousDirection = directionChange.direction;
      previousDirectionChangeTime = directionChange.time.getTime();
    }
    const durationOfPreviousDirection = this.currentTickTime - previousDirectionChangeTime;
    const vectorMultiplier = durationOfPreviousDirection / this.tickFrequencyInMilliseconds;
    const partialDirection = this.vectorService.multiplyVector(previousDirection, vectorMultiplier);
    tempLog.push({multiplier: vectorMultiplier, direction: previousDirection});
    combinedDirection = this.vectorService.addVectors(combinedDirection, partialDirection);
    player.direction = previousDirection;
    if (directionQueue.length > 0) {
      this.logger.log('Queue: ' + JSON.stringify(directionQueue));
      this.logger.log('Result: ' + JSON.stringify(combinedDirection));
      this.logger.log('Partial results: ' + JSON.stringify(tempLog));
    }
    return combinedDirection;
  }

  private capMovementByCollision(movingObject: GameObject, desiredMovement: Vector2, otherObjects: GameObject[]): Vector2 {
    const newMovement = this.vectorService.cloneVector(desiredMovement);
    const blockingObjects = otherObjects.filter((o) => o.blocksMovement);
    const newDesiredPosition = this.vectorService.addVectors(movingObject.position, desiredMovement);
    const desiredNewObject = this.gameObjectService.cloneGameObject(movingObject);
    desiredNewObject.position = newDesiredPosition;
    const objectsCollidingWithMovingObject = blockingObjects.filter((o) => this.gameObjectService.areObjectsIntersecting(desiredNewObject, o));
    if (objectsCollidingWithMovingObject.length === 0) {
      return newMovement;
    }
    const mostOverlappingObject = objectsCollidingWithMovingObject.reduce((a, b) => 
      this.gameObjectService.calculateDistanceOverlappedOnXAxisPlusYAxis(desiredNewObject, a) > this.gameObjectService.calculateDistanceOverlappedOnYAxis(desiredNewObject, b)
        ? a
        : b
    );
    const xOverlap = this.gameObjectService.calculateDistanceOverlappedOnXAxis(desiredNewObject, mostOverlappingObject);
    const yOverlap = this.gameObjectService.calculateDistanceOverlappedOnYAxis(desiredNewObject, mostOverlappingObject);
    if (xOverlap < yOverlap) {
      if (movingObject.position.x < mostOverlappingObject.position.x) {
        newMovement.x = mostOverlappingObject.position.x - mostOverlappingObject.size.x / 2 - movingObject.size.x / 2 - movingObject.position.x;
      } else {
        newMovement.x = mostOverlappingObject.position.x + mostOverlappingObject.size.x / 2 + movingObject.size.x / 2 - movingObject.position.x;
      }
    } else {
      if (movingObject.position.y < mostOverlappingObject.position.y) {
        newMovement.y = mostOverlappingObject.position.y - mostOverlappingObject.size.y / 2 - movingObject.size.y / 2 - movingObject.position.y;
      } else {
        newMovement.y = mostOverlappingObject.position.y + mostOverlappingObject.size.y / 2 + movingObject.size.y / 2 - movingObject.position.y;
      }
    }
    return newMovement;
  }

  private flushMessageQueues(): void {
    for (const connection of this.gameManager.getConnectionsForAllPlayers()) {
      connection.flushMessageQueue();
    }
  }
}
