import { Injectable } from '@angular/core';
import { Vector2 } from 'src/shared/game-state/vector2';

@Injectable({
  providedIn: 'root'
})
export class VectorService {

  public constructor() { }
  

  public getLength(vector: Vector2): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }

  public getDistance(vectorA: Vector2, vectorB: Vector2): number {
    const delta: Vector2 = {
      x: vectorA.x - vectorB.x,
      y: vectorA.y - vectorB.y,
    };
    return this.getLength(delta);
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

  public subtractVector(baseVector: Vector2, minusVector: Vector2): Vector2 {
    return {
      x: baseVector.x - minusVector.x,
      y: baseVector.y + minusVector.y,
    };
  }
}
