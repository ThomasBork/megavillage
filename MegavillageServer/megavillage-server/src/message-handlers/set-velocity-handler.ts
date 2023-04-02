import { Injectable } from '@nestjs/common';
import { Connection } from 'src/connection';
import { GameManager } from 'src/game-manager';
import { Vector2 } from 'src/shared/game-state/vector2';
import { ClientMessageSetVelocity } from 'src/shared/messages/client/client-message-set-velocity';
import { VectorService } from 'src/vector.service';

@Injectable()
export class SetVelocityHandler {
  private playerSpeed: number;
  public constructor(
    private gameManager: GameManager,
    private vectorService: VectorService,
  ) {
    this.playerSpeed = 100;
  }

  public handle(sender: Connection, message: ClientMessageSetVelocity): void {
    const player = this.gameManager.getPlayer(sender.playerId);
    const velocity = this.getNewVelocity(message.x, message.y);
    player.velocity = velocity;
  }

  private getNewVelocity(inputX: number, inputY: number): Vector2 {
    if (Math.abs(inputX) + Math.abs(inputY) === 0) {
      return this.vectorService.buildVector(0, 0);
    }
    const inputVector = this.vectorService.buildVector(inputX, inputY);
    const unitVector = this.vectorService.getUnitVector(inputVector);
    const newVelocity = this.vectorService.multiplyVector(unitVector, this.playerSpeed);
    return newVelocity;
  }
}
