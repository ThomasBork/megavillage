import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'src/connection';
import { GameManager } from 'src/game-manager';
import { ActionStartedComposer } from 'src/message-composers/action-started-composer';
import { GameObject } from 'src/shared/game-state/game-object';
import { Player } from 'src/shared/game-state/player';
import { PlayerAction } from 'src/shared/game-state/player-action';
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
    return player.availableActions.some((a) => a.actionType === actionType && a.targetType === target.type);
  }

  private startAction(player: Player, target: GameObject, actionType: PlayerActionType): void {
    const timeToPerformAction = this.calculateTimeToPerformAction(player, target, actionType);
    if (timeToPerformAction > 0) {
      const action: PlayerAction = {
        targetGameObjectId: target.id,
        timeRemainingInMilliseconds: timeToPerformAction,
        type: actionType,
      };
      player.action = action;
      const startActionMessage = this.actionStartedComposer.compose(player.id, player.action);
      this.gameManager.sendMessageToAllPlayers(startActionMessage);
    } else {
      this.gameManager.resolveAction(player, target, actionType);
    }
  }

  private calculateTimeToPerformAction(player: Player, target: GameObject, actionType: PlayerActionType): number {
    switch(actionType) {
      case PlayerActionType.harvest: return 2000;
      case PlayerActionType.chop: return 3000;
      case PlayerActionType.mine: return 5000;
      case PlayerActionType.fish: return 10000;
      case PlayerActionType.turnInResources: return 0;
      case PlayerActionType.buy: return 0;
      case PlayerActionType.dropItem: return 0;
      case PlayerActionType.giveItem: return 0;
      case PlayerActionType.takeItem: return 0;
      default: throw new Error('No time set for performing action type: "' + actionType + '".');
    }
  }
}
