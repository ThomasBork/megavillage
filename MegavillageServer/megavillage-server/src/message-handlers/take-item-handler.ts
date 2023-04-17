import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'src/connection';
import { GameManager } from 'src/game-manager';
import { GameObject } from 'src/shared/game-state/game-object';
import { ClientMessageTakeItem } from 'src/shared/messages/client/client-message-take-item';

@Injectable()
export class TakeItemHandler {
  private logger: Logger;
  public constructor(
    private gameManager: GameManager,
  ) {
    this.logger = new Logger('BuyItemHandler');
  }

  public handle(sender: Connection, message: ClientMessageTakeItem): void {
    const receiver = this.gameManager.getPlayerByUserId(sender.getUserId());
    const giver = this.gameManager.getObjectById(message.giverId);

    const item = giver.items.find((i) => i !== null && i.id === message.itemId);
    if (!item) {
      this.logger.log('Player attempted to take an item from another object that doesn\'t have it. User: "' + sender.getUserId() + '", ReceiverId: "' + receiver.id + '", GiverId: "' + giver.id + '".');
      return;
    }
    const receiverHasSpace = this.gameManager.getNumberOfEmptyItemSpaces(receiver) > 0;
    if (!receiverHasSpace) {
      this.logger.log('Player attempted to take an item from another object with no space. User: "' + sender.getUserId() + '", ReceiverId: "' + receiver.id + '", GiverId: "' + giver.id + '".');
      return;
    }
    const isTargetWithinReach = this.isTargetWithinReach(giver, receiver);
    if (!isTargetWithinReach) {
      this.logger.log('Player attempted to take an item from another object which is not within reach. User: "' + sender.getUserId() + '", ReceiverId: "' + receiver.id + '", GiverId: "' + giver.id + '".');
      return;
    }

    this.gameManager.moveItem(giver, receiver, item);
  }

  private isTargetWithinReach(gameObjectA: GameObject, gameObjectB: GameObject): boolean {
    // Trust the front end - For now.
    return true;
  }
}
