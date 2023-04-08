import { Injectable } from '@nestjs/common';
import { DirectionInput } from './direction-input';
import { Vector2 } from 'src/shared/game-state/vector2';

@Injectable()
export class InputBufferService {
  private playerDirectionInputQueues: Map<number, DirectionInput[]>;

  public constructor() {
    this.playerDirectionInputQueues = new Map();
  }

  public queueDirectionForPlayer(playerId: number, direction: Vector2): void {
    const playerDirectionInputQueue = this.getOrCreateDirectionInputQueueForPlayer(playerId);
    const time = new Date();
    const directionInput: DirectionInput = {
      time: time,
      direction: direction,
    };
    playerDirectionInputQueue.push(directionInput);
  }

  public popDirectionInputQueueForPlayerUntilTime(playerId: number, maxTime: number): DirectionInput[] {
    const playerDirectionInputQueue = this.getOrCreateDirectionInputQueueForPlayer(playerId);
    const directionInputsBeforeTime = playerDirectionInputQueue.filter((di) => di.time.getTime() < maxTime);
    const directionInputsAfterTime = playerDirectionInputQueue.filter((di) => di.time.getTime() >= maxTime);
    this.playerDirectionInputQueues.set(playerId, directionInputsAfterTime);
    return directionInputsBeforeTime;
  }

  private getOrCreateDirectionInputQueueForPlayer(playerId: number): DirectionInput[] {
    let playerDirectionInputQueue = this.playerDirectionInputQueues.get(playerId);
    if (!playerDirectionInputQueue) {
      playerDirectionInputQueue = [];
      this.playerDirectionInputQueues.set(playerId, playerDirectionInputQueue);
    }
    return playerDirectionInputQueue;
  }
}
