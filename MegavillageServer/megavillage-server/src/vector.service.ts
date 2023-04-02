import { Injectable } from '@nestjs/common';
import { Vector2 } from './shared/game-state/vector2';

@Injectable()
export class VectorService {
  public buildVector(x: number, y: number): Vector2 {
    return {
      x: x,
      y: y,
    };
  }

  public getUnitVector(vector: Vector2): Vector2 {
    const length = this.getLength(vector);
    if (length === 0) {
      throw new Error('Unable to get unit vector from 0 length');
    }
    return {
      x: vector.x / length,
      y: vector.y / length,
    };
  }

  public multiplyVector(vector: Vector2, multiplier: number): Vector2 {
    return {
      x: vector.x * multiplier,
      y: vector.y * multiplier,
    };
  }

  public addVectors(vectorA: Vector2, vectorB: Vector2): Vector2 {
    return {
      x: vectorA.x + vectorB.x,
      y: vectorA.y + vectorB.y,
    };
  }

  public getLength(vector: Vector2): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }
}
