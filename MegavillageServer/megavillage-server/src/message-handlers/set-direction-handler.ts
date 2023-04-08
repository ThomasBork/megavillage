import { Injectable } from '@nestjs/common';
import { Connection } from 'src/connection';
import { InputBufferService } from 'src/game-loop/input-buffer/input-buffer.service';
import { GameManager } from 'src/game-manager';
import { Vector2 } from 'src/shared/game-state/vector2';
import { ClientMessageSetDirection } from 'src/shared/messages/client/client-message-set-direction';
import { VectorService } from 'src/vector.service';

@Injectable()
export class SetDirectionHandler {
  public constructor(
    private gameManager: GameManager,
    private vectorService: VectorService,
    private inputBufferService: InputBufferService,
  ) {}

  public handle(sender: Connection, message: ClientMessageSetDirection): void {
    const player = this.gameManager.getPlayer(sender.playerId);
    const direction = this.getNormalizedDirection(message.newDirection);
    this.inputBufferService.queueDirectionForPlayer(player.id, direction);
  }

  private getNormalizedDirection(newDirection: Vector2): Vector2 {
    if (newDirection.x === 0 && newDirection.y === 0) {
      return newDirection;
    }
    const normalizedDirection = this.vectorService.normalizedVector(newDirection);
    return normalizedDirection;
  }
}
