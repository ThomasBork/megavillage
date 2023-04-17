import { Injectable } from '@nestjs/common';
import { GameObject } from './shared/game-state/game-object';
import { VectorService } from './vector.service';

@Injectable()
export class GameObjectService {
  public constructor(private vectorService: VectorService) {}

  public areObjectsIntersecting(objectA: GameObject, objectB: GameObject): boolean {
    const isOverlappingOnXAxis = this.calculateDistanceOverlappedOnXAxis(objectA, objectB) > 0;
    const isOverlappingOnYAxis = this.calculateDistanceOverlappedOnYAxis(objectA, objectB) > 0;

    return isOverlappingOnXAxis && isOverlappingOnYAxis;
  }

  public calculateDistanceOverlappedOnXAxis(objectA: GameObject, objectB: GameObject): number {
    const posDeltaX = Math.abs(objectA.position.x - objectB.position.x);
    const bothHalfWidths = objectA.size.x / 2 + objectB.size.x / 2;
    return bothHalfWidths - posDeltaX;
  }

  public calculateDistanceOverlappedOnYAxis(objectA: GameObject, objectB: GameObject): number {
    const posDeltaY = Math.abs(objectA.position.y - objectB.position.y);
    const bothHalfHeights = objectA.size.y / 2 + objectB.size.y / 2;
    return bothHalfHeights - posDeltaY;
  }

  public calculateDistanceOverlappedOnXAxisPlusYAxis(objectA: GameObject, objectB: GameObject): number {
    return this.calculateDistanceOverlappedOnXAxis(objectA, objectB)
      + this.calculateDistanceOverlappedOnYAxis(objectA, objectB);
  }

  public clonePhysicalGameObject(obj: GameObject): GameObject {
    return {
      id: obj.id,
      blocksMovement: obj.blocksMovement,
      direction: this.vectorService.cloneVector(obj.direction),
      position: this.vectorService.cloneVector(obj.position),
      size: this.vectorService.cloneVector(obj.size),
      speed: obj.speed,
      type: obj.type,
      items: [],
      maxItemCount: 0
    };
  }
}
