import { Injectable } from '@angular/core';
import { UIGameObject } from './ui-game-state/ui-game-object';
import { PlayerActionType } from 'src/shared/game-state/player-action-type';
import { PerformActionComposerService } from './message-composers/perform-action-composer.service';
import { ConnectionService } from './connection.service';
import { UIGameObjectPlayer } from './ui-game-state/ui-game-object-player';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { UIGameObjectShop } from './ui-game-state/ui-game-object-shop';
import { GameService } from './game.service';
import { ItemType } from 'src/shared/game-state/item-type';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  public constructor(
    private performActionComposerService: PerformActionComposerService,
    private connectionService: ConnectionService,
    private gameService: GameService,
  ) { }

  public handleGenericActionOnObject(performingPlayer: UIGameObjectPlayer, targetGameObject: UIGameObject): void {
    let availableActionTypes = this.getAvailableActionTypesOnTarget(performingPlayer, targetGameObject);
    const turnInResourcesActionType = availableActionTypes.find((a) => a === PlayerActionType.turnInResources);
    const hasResourceStack = this.gameService.getCurrentPlayer().getItems().some((i) => i !== null && i.type === ItemType.resourceStack);
    if (turnInResourcesActionType && hasResourceStack) {
      const message = this.performActionComposerService.compose(turnInResourcesActionType, targetGameObject.getId());
      this.connectionService.sendMessage(message);
      availableActionTypes = availableActionTypes.filter((a) => a !== turnInResourcesActionType);
      return;
    }
    if (targetGameObject instanceof UIGameObjectShop) {
      this.gameService.getGame().setSelectedShop(targetGameObject);
      return;
    }
    if (availableActionTypes.length === 1) {
      const message = this.performActionComposerService.compose(availableActionTypes[0], targetGameObject.getId());
      this.connectionService.sendMessage(message);
    }
  }

  private getAvailableActionTypesOnTarget(performingPlayer: UIGameObjectPlayer, targetGameObject: UIGameObject): PlayerActionType[] {
    return performingPlayer.getAvailableActions()
      .filter((a) => a.targetType === targetGameObject.getType())
      .map((a) => a.actionType);
  }
}
