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
import { ItemType } from './shared/game-state/item-type';
import { PlayerActionType } from './shared/game-state/player-action-type';
import { ActionTypeWithTargetType } from './shared/game-state/action-type-with-target-type';
import { ListService } from './list.service';
import { PlayerAvailableActionsChangedComposer } from './message-composers/player-available-actions-changed-composer';
import { Item } from './shared/game-state/item';
import { ItemGainedComposer } from './message-composers/item-gained-composer';
import { GameObjectRemovedComposer } from './message-composers/game-object-removed-composer';
import { ResourceType } from './shared/game-state/resource-type';
import { ItemResourceStack } from './shared/game-state/item-resource-stack';
import { ItemResourceStackQuantityChangedComposer } from './message-composers/item-resource-stack-quantity-changed-composer';
import { ItemRemovedComposer } from './message-composers/item-removed-composer';
import { GameResourceQuantityChangedComposer } from './message-composers/game-resource-quantity-changed-composer';
import { WorldBuilderService } from './world-builder.service';
import { ItemRecipe } from './shared/game-state/item-recipe';
import { Shop } from './shared/game-state/shop';
import { GameResource } from './shared/game-state/game-resource';
import { GameObjectStageChangedComposer } from './message-composers/game-object-stage-changed-composer';
import { GameObjectWithStages } from './shared/game-state/game-object-with-stages';

@Injectable()
export class GameManager {
  public game: Game;

  public constructor(
    private connectionManager: ConnectionManager,
    private vectorService: VectorService,
    private userService: UserService,
    private listService: ListService,
    private playerJoinedComposer: PlayerJoinedComposer,
    private playerAvailableActionsChangedComposer: PlayerAvailableActionsChangedComposer,
    private itemGainedComposer: ItemGainedComposer,
    private gameObjectRemovedComposer: GameObjectRemovedComposer,
    private itemResourceStackQuantityChangedComposer: ItemResourceStackQuantityChangedComposer,
    private itemRemovedComposer: ItemRemovedComposer,
    private gameResourceQuantityChangedComposer: GameResourceQuantityChangedComposer,
    private gameObjectStageChangedComposer: GameObjectStageChangedComposer,
    private worldBuilderService: WorldBuilderService,
  ) {
    const gameObjects = this.worldBuilderService.buildWorld();
    this.game = {
      nextGameObjectId: this.worldBuilderService.builderNextGameObjectId,
      nextItemId: 1,
      gameObjects: gameObjects,
      sharedResources: [{
        resourceType: ResourceType.wood,
        quantity: 0,
      }],
      basicActionsForPlayers: [{
        actionType: PlayerActionType.buy,
        targetType: GameObjectType.shop,
      }, {
        actionType: PlayerActionType.giveItem,
        targetType: GameObjectType.shop,
      }, {
        actionType: PlayerActionType.takeItem,
        targetType: GameObjectType.shop,
      }, {
        actionType: PlayerActionType.turnInResources,
        targetType: GameObjectType.shop,
      }, {
        actionType: PlayerActionType.harvest,
        targetType: GameObjectType.bush,
      }],
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
      size: this.vectorService.buildVector(80, 100),
      speed: 250,
      userId: userId,
      action: null,
      items: [{
        id: this.game.nextItemId++,
        name: 'Axe',
        type: ItemType.axe,
        actionsEnabledByItem: [{actionType: PlayerActionType.chop, targetType: GameObjectType.tree}],
      }],
      maxItemCount: 8,
      availableActions: []
    };
    player.items.length = player.maxItemCount;
    for (let i = 0; i<player.maxItemCount; i++) {
      if (player.items[i] === undefined) {
        player.items[i] = null;
      }
    }
    player.availableActions = this.getAvailableActionsForPlayer(player);
    this.game.gameObjects.push(player);

    const connectionsOfOtherUsers = this
      .getConnectionsForAllPlayers()
      .filter((c) => c.getUserId() !== userId);
    const playerJoinedMessage = this.playerJoinedComposer.compose(player);
    for (const connectionOfOtherPlayer of connectionsOfOtherUsers) {
      connectionOfOtherPlayer.sendMessage(playerJoinedMessage);
    }
  }

  public resolveAction(player: Player, target: GameObject, actionType: PlayerActionType) {
    switch (actionType) {
      case PlayerActionType.chop: {
        this.removeGameObject(target)
        const woodToGive = 15 + Math.floor(Math.random() * 8);
        this.giveResourcesToPlayer(player, ResourceType.wood, woodToGive);
        break;
      }
      case PlayerActionType.mine: {
        this.removeGameObject(target);
        const stoneToGive = 10 + Math.floor(Math.random() * 5);
        this.giveResourcesToPlayer(player, ResourceType.stone, stoneToGive);
        break;
      }
      case PlayerActionType.harvest: {
        const targetWithStages = target as GameObjectWithStages;
        if (targetWithStages.currentStage > 1) {
          switch(target.type) {
            case GameObjectType.bush: {
              const minBerriesFound = 4 * (targetWithStages.currentStage - 1) - 1;
              const maxBerriesFound = minBerriesFound + 2;
              const berriesFound = minBerriesFound + Math.floor(Math.random() * (maxBerriesFound - minBerriesFound));
              this.giveResourcesToPlayer(player, ResourceType.berries, berriesFound);

              const previousStage = targetWithStages.currentStage;
              targetWithStages.currentStage = 1;
              targetWithStages.timeUntilNextStage = targetWithStages.totalTimePerStage;
              const message = this.gameObjectStageChangedComposer.compose(
                targetWithStages.id, 
                previousStage, 
                targetWithStages.currentStage, 
                targetWithStages.timeUntilNextStage
              );
              this.queueMessageToAllPlayers(message);
            }
          }
        }
        break;
      }
      case PlayerActionType.turnInResources: {
        for (const item of this.getActualItems(player)) {
          if (item.type === ItemType.resourceStack) {
            const itemResourceStack = item as ItemResourceStack;
            this.giveResourcesToGame(itemResourceStack.resourceType, itemResourceStack.quantity);
            this.removeItemFromGameObject(player, itemResourceStack);
          }
        }
        break;
      }
      default: throw new Error('No logic for handling player action: "' + actionType + '".');
    }
  }

  public tryPayCosts(costs: GameResource[]): boolean {
    const canPay = costs.every((r) => {
      const gameResource = this.findOrCreateResource(r.resourceType);
      return gameResource.quantity >= r.quantity;
    });
    if (canPay) {
      for (const cost of costs) {
        this.removeResourcesFromGame(cost.resourceType, cost.quantity);
      }
    }
    return canPay;
  }

  public moveItem(giver: GameObject, receiver: GameObject, item: Item): void {
    this.removeItemFromGameObject(giver, item);
    this.giveItemToGameObject(receiver, item);
  }

  public buildItemAndGiveToShop(itemRecipe: ItemRecipe, shop: Shop): void {
    const item: Item = {
      id: this.game.nextGameObjectId++,
      actionsEnabledByItem: [...itemRecipe.actionsEnabledByItem],
      name: itemRecipe.name,
      type: itemRecipe.type,
    };
    this.giveItemToGameObject(shop, item);
  }

  public getNumberOfEmptyItemSpaces(object: GameObject): number {
    return object.maxItemCount - this.getActualItems(object).length;
  }

  public getActualItems(object: GameObject): Item[] {
    return object.items.filter((i) => i !== null);
  }

  private removeResourcesFromGame(resourceType: ResourceType, quantity: number): void {
    const gameResource = this.findOrCreateResource(resourceType);
    const newQuantity = gameResource.quantity - quantity;
    this.changeResourceQuantity(gameResource, newQuantity);
  }

  private giveResourcesToGame(resourceType: ResourceType, quantity: number): void {
    const gameResource = this.findOrCreateResource(resourceType);
    const newQuantity = gameResource.quantity + quantity;
    this.changeResourceQuantity(gameResource, newQuantity);
  }

  private changeResourceQuantity(gameResource: GameResource, newQuantity: number): void {
    const oldQuantity = gameResource.quantity;
    gameResource.quantity = newQuantity;
    const message = this.gameResourceQuantityChangedComposer.compose(oldQuantity, newQuantity, gameResource.resourceType);
    this.queueMessageToAllPlayers(message);
  }

  private findOrCreateResource(resourceType: ResourceType): GameResource {
    let gameResource = this.game.sharedResources.find((r) => r.resourceType === resourceType);
    if (!gameResource) {
      gameResource = {
        quantity: 0,
        resourceType: resourceType,
      };
      this.game.sharedResources.push(gameResource);
    }
    return gameResource;
  }
  
  private giveResourcesToPlayer(player:Player, resourceType: ResourceType, quantity: number): void {
    let quantityLeftToGive = quantity;
    for (const item of this.getActualItems(player)) {
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
            this.queueMessageToAllPlayers(stackQuantityChangedMessage);

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
      && this.getActualItems(player).length < player.maxItemCount
    ) {
      const quantityToAddToStack = Math.min(maxQuantity, quantityLeftToGive);
      quantityLeftToGive -= quantityToAddToStack;
      const itemResourceStack: ItemResourceStack = {
        id: this.getGame().nextItemId++,
        actionsEnabledByItem: [],
        maxQuantity: maxQuantity,
        name: 'Stack of ' + resourceType,
        quantity: quantityToAddToStack,
        resourceType: resourceType,
        type: ItemType.resourceStack,
      };
      this.giveItemToGameObject(player, itemResourceStack);
    }
  }

  private getResourceStackMaxQuantity(resourceType: ResourceType): number {
    switch(resourceType) {
      case ResourceType.wood: return 30;
      case ResourceType.stone: return 20;
      case ResourceType.berries: return 20;
      default: throw new Error('No resource stack max quantity for: "' + resourceType + '".');
    }
  }

  public removeGameObject(gameObject: GameObject): void {
    this.getGame().gameObjects = this.getGame().gameObjects.filter((o) => o !== gameObject);
    const objectRemovedMessage = this.gameObjectRemovedComposer.compose(gameObject.id);
    this.queueMessageToAllPlayers(objectRemovedMessage);
  }

  public giveItemToGameObject(gameObject: GameObject, item: Item): void {
    const emptyIndex = this.listService.findFirstEmptyIndex(gameObject.items, gameObject.maxItemCount);
    if (emptyIndex < 0) {
      throw new Error('Game object has no space for another item. Game object id: "' + gameObject.id + '".');
    }
    gameObject.items[emptyIndex] = item;
    const itemGainedMessage = this.itemGainedComposer.compose(gameObject.id, item, emptyIndex);
    this.queueMessageToAllPlayers(itemGainedMessage);
    if (gameObject.type === GameObjectType.player) {
      this.updateAvailableActionsForPlayer(gameObject as Player);
    }
  }

  private removeItemFromGameObject(gameObject: GameObject, item: Item): void {
    const index = gameObject.items.indexOf(item);
    if (index < 0) {
      throw new Error ('Item not found on game object. Id: "' + item.id + '".');
    }
    gameObject.items[index] = null;
    const message = this.itemRemovedComposer.compose(gameObject.id, item.id);
    this.queueMessageToAllPlayers(message);
    if (gameObject.type === GameObjectType.player) {
      this.updateAvailableActionsForPlayer(gameObject as Player);
    }
  }

  public updateAvailableActionsForPlayer(player: Player): void {
    const newActions = this.getAvailableActionsForPlayer(player);
    const hasChanged = !this.listService.areListsIdentical(newActions, player.availableActions);
    if (hasChanged) {
      player.availableActions = newActions;
      const message = this.playerAvailableActionsChangedComposer.compose(player.id, newActions);
      this.queueMessageToAllPlayers(message);
    }
  }

  private getAvailableActionsForPlayer(player: Player): ActionTypeWithTargetType[] {
    const game = this.getGame();
    const availableActions: ActionTypeWithTargetType[] = [];
    const addAction = (actionToAdd: ActionTypeWithTargetType) => {
      if (availableActions.some((a) => a.actionType === actionToAdd.actionType && a.targetType === actionToAdd.targetType)) {
        return;
      }
      availableActions.push(actionToAdd);
    };
    for (const gameAction of game.basicActionsForPlayers) {
      addAction(gameAction);
    }
    for (const item of this.getActualItems(player)) {
      for (const itemAction of item.actionsEnabledByItem) {
        addAction(itemAction);
      }
    }
    return availableActions;
  }
}
