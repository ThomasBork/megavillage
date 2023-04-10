import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'src/connection';
import { GameManager } from 'src/game-manager';
import { ActionStartedComposer } from 'src/message-composers/action-started-composer';
import { GameObject } from 'src/shared/game-state/game-object';
import { GameObjectType } from 'src/shared/game-state/game-object-type';
import { Player } from 'src/shared/game-state/player';
import { PlayerActionType } from 'src/shared/game-state/player-action-type';
import { ClientMessagePerformAction } from 'src/shared/messages/client/client-message-perform-action';

@Injectable()
export class PerformActionHandler {
  private logger: Logger;
  public constructor(
    private gameManager: GameManager,
    private actionStartedComposer: ActionStartedComposer,
  ) {
    this.logger = new Logger('PerformActionHandler');
  }

  public handle(sender: Connection, message: ClientMessagePerformAction): void {
    const player = this.gameManager.getPlayerByUserId(sender.getUserId());
    const target = this.gameManager.getObjectById(message.targetGameObjectId);
    const isTargetWithinReach = this.isTargetWithinReach(player, target);
    if (!isTargetWithinReach) {
      this.logger.log('Player attempted to perform action on a target which is not within reach. User: "' + sender.getUserId + '", Target: "' + target.id + '".');
      return;
    }
    
    const canActionBePerformedOnTarget = this.canActionBePerformedOnTarget(player, target, message.type);
    if (!canActionBePerformedOnTarget) {
      this.logger.log('Player attempted to perform an illegal action. User: "' + sender.getUserId + '", Target: "' + target.id + '", Action: "' + message.type + '".');
      return;
    }

    this.startAction(player, target, message.type);
  }

  private isTargetWithinReach(player: Player, target: GameObject): boolean {
    // Trust the front end - For now.
    return true;
  }

  private canActionBePerformedOnTarget(player: Player, target: GameObject, actionType: PlayerActionType): boolean {
    switch (target.type) {
      case GameObjectType.tree:
        return [PlayerActionType.chop].includes(actionType);
      case GameObjectType.rock:
        return [PlayerActionType.mine].includes(actionType);
      case GameObjectType.player:
        return [PlayerActionType.giveItem].includes(actionType);
      default:
        throw new Error ('Unhandled game object type: "' + actionType + '".');
    }
  }

  private startAction(player: Player, target: GameObject, actionType: PlayerActionType): void {
    player.action = {
      targetGameObjectId: target.id,
      timeRemainingInMilliseconds: 3000,
      type: actionType,
    };
    const startActionMessage = this.actionStartedComposer.compose(player.id, player.action);
    this.gameManager.sendMessageToAllPlayers(startActionMessage);
  }
}
