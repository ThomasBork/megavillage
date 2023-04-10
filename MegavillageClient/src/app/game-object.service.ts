import { Injectable } from '@angular/core';
import { Vector2 } from 'src/shared/game-state/vector2';
import { UIGameObject } from './ui-game-state/ui-game-object';

@Injectable({
  providedIn: 'root'
})
export class GameObjectService {
  public constructor() { }
  public isPointWithinObject(point: Vector2, gameObject: UIGameObject): boolean {
    return gameObject.getMinX() < point.x && point.x < gameObject.getMaxX()
      && gameObject.getMinY() < point.y && point.y < gameObject.getMinY();
  }

  public calculateDistanceOverlappedOnXAxis(gameObject: UIGameObject, position: Vector2, size: Vector2): number {
    const posDeltaX = Math.abs(gameObject.getPosition().x - position.x);
    const bothHalfWidths = gameObject.getSize().x / 2 + size.x / 2;
    return bothHalfWidths - posDeltaX;
  }

  public calculateDistanceOverlappedOnYAxis(gameObject: UIGameObject, position: Vector2, size: Vector2): number {
    const posDeltaY = Math.abs(gameObject.getPosition().y - position.y);
    const bothHalfHeights = gameObject.getSize().y / 2 + size.y / 2;
    return bothHalfHeights - posDeltaY;
  }

  public calculateDistanceOverlappedOnXAxisPlusYAxis(gameObject: UIGameObject, position: Vector2, size: Vector2): number {
    return this.calculateDistanceOverlappedOnXAxis(gameObject, position, size)
      + this.calculateDistanceOverlappedOnYAxis(gameObject, position, size);
  }

  public doesAreaOverlapWithGameObject(gameObject: UIGameObject, position: Vector2, size: Vector2): boolean {
    return this.calculateDistanceOverlappedOnXAxis(gameObject, position, size) > 0
      && this.calculateDistanceOverlappedOnYAxis(gameObject, position, size) > 0;
  }
}
