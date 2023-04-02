import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConnectionManager } from 'src/connection-manager';
import { GameManager } from 'src/game-manager';
import { GameObjectNewPositionComposer } from 'src/message-composers/game-object-new-position-composer';
import { Game } from 'src/shared/game-state/game';
import { VectorService } from 'src/vector.service';

@Injectable()
export class GameLoop implements OnApplicationBootstrap {
  private readonly tickFrequencyInMilliseconds: number;
  private updatingInterval?: NodeJS.Timeout;
  private logger: Logger = new Logger('GameLoop');

  public constructor(
    private gameManager: GameManager,
    private connectionManager: ConnectionManager,
    private vectorService: VectorService,
    private gameObjectNewPositionComposer: GameObjectNewPositionComposer,
  ) {
    this.tickFrequencyInMilliseconds = 100;
  }

  public onApplicationBootstrap() {
    this.updatingInterval = setInterval(() => this.updateGameState(), this.tickFrequencyInMilliseconds);
  }

  private updateGameState(): void {
    const game = this.gameManager.getGame();
    this.updateGameObjectMovement(game);
  }

  private updateGameObjectMovement(game: Game): void {
    for (const gameObject of game.gameObjects) {
      if (this.vectorService.getLength(gameObject.velocity) !== 0) {
        const tickOverSecond = this.tickFrequencyInMilliseconds / 1000;
        const tickVelocity = this.vectorService.multiplyVector(gameObject.velocity, tickOverSecond);
        const oldGameObjectPosition = gameObject.position;
        const newGameObjectPosition = this.vectorService.addVectors(gameObject.position, tickVelocity);
        gameObject.position = newGameObjectPosition;
        const newPositionMessage = this.gameObjectNewPositionComposer.compose(gameObject.id, oldGameObjectPosition, newGameObjectPosition);
        this.gameManager.sendMessageToAllPlayers(newPositionMessage);
      }
    }
  }
}
