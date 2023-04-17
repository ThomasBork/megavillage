import { Injectable, Logger } from '@nestjs/common';
import { Connection } from 'src/connection';
import { GameManager } from 'src/game-manager';
import { GameObject } from 'src/shared/game-state/game-object';
import { Player } from 'src/shared/game-state/player';
import { ClientMessageGiveItem } from 'src/shared/messages/client/client-message-give-item';

@Injectable()
export class GiveItemHandler {
  private logger: Logger;
  public constructor(
    private gameManager: GameManager,
  ) {
    this.logger = new Logger('BuyItemHandler');
  }

  public handle(sender: Connection, message: ClientMessageGiveItem): void {
    const giver = this.gameManager.getPlayerByUserId(sender.getUserId());
    const receiver = this.gameManager.getObjectById(message.receiverId);

    const item = giver.items.find((i) => i !== null && i.id === message.itemId);
    if (!item) {
      this.logger.log('Player attempted to give an item that it doesn\'t have. User: "' + sender.getUserId() + '", ReceiverId: "' + receiver.id + '", GiverId: "' + giver.id + '".');
      return;
    }
    const receiverHasSpace = this.gameManager.getNumberOfEmptyItemSpaces(receiver) > 0;
    if (!receiverHasSpace) {
      this.logger.log('Player attempted to give an item to another object with no space. User: "' + sender.getUserId() + '", ReceiverId: "' + receiver.id + '", GiverId: "' + giver.id + '".');
      return;
    }
    const isTargetWithinReach = this.isTargetWithinReach(giver, receiver);
    if (!isTargetWithinReach) {
      this.logger.log('Player attempted to give an item to another object which is not within reach. User: "' + sender.getUserId() + '", ReceiverId: "' + receiver.id + '", GiverId: "' + giver.id + '".');
      return;
    }

    this.gameManager.moveItem(giver, receiver, item);
  }

  private isTargetWithinReach(player: Player, target: GameObject): boolean {
    // Trust the front end - For now.
    return true;
  }
}
