import { Injectable } from '@angular/core';
import { UIGameObject } from './ui-game-state/ui-game-object';
import { PlayerActionType } from 'src/shared/game-state/player-action-type';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { PerformActionComposerService } from './message-composers/perform-action-composer.service';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  public constructor(
    private performActionComposerService: PerformActionComposerService,
    private connectionService: ConnectionService,
  ) { }

  public handleGenericActionOnObject(targetGameObject: UIGameObject): void {
    const availableActionTypes = this.getAvailableActionTypesOnTarget(targetGameObject);
    if (availableActionTypes.length === 1) {
      const message = this.performActionComposerService.compose(availableActionTypes[0], targetGameObject.getId());
      this.connectionService.sendMessage(message);
    }
  }

  private getAvailableActionTypesOnTarget(targetGameObject: UIGameObject): PlayerActionType[] {
    switch (targetGameObject.getType()) {
      case GameObjectType.tree:
        return [PlayerActionType.chop];
      case GameObjectType.rock:
        return [PlayerActionType.mine];
      case GameObjectType.player:
        return [PlayerActionType.giveItem];
      default:
        throw new Error ('Unhandled game object type: "' + targetGameObject.getType() + '".');
    }
  }
}
