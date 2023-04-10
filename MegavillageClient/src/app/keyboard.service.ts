import { Injectable } from '@angular/core';
import { Vector2 } from 'src/shared/game-state/vector2';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private movementKeys: string[];
  private buttonsPressed: Map<string, boolean>;
  private currentMovementDirection: Vector2;
  private previousNonZeroMovementDirection: Vector2;
  public constructor() { 
    this.buttonsPressed = new Map<string, boolean>();
    this.movementKeys = ['a', 's', 'd', 'w', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
    this.currentMovementDirection = {
      x: 0,
      y: 0,
    };
    this.previousNonZeroMovementDirection = {
      x: 1,
      y: 0,
    };
  }

  public setButtonDown(keyCode: string): void {
    this.buttonsPressed.set(keyCode, true);
    this.updateMovementDirection();
  }

  public setButtonUp(keyCode: string): void {
    this.buttonsPressed.set(keyCode, false);
    this.updateMovementDirection();
  }

  public isButtonPressed(keyCode: string): boolean {
    if (!this.buttonsPressed.has(keyCode)) {
      return false;
    }
    return this.buttonsPressed.get(keyCode) === true;
  }

  public getMovementKeys(): string[] {
    return this.movementKeys;
  }

  public getMovementDirection(): Vector2 {
    return this.currentMovementDirection;
  }

  public getPreviousNonZeroMovementDirection(): Vector2 {
    return this.previousNonZeroMovementDirection;
  }

  private updateMovementDirection(): void {
    let x = 0;
    let y = 0;
    if (this.isButtonPressed('a') || this.isButtonPressed('ArrowLeft')) {
      x -= 1;
    }
    if (this.isButtonPressed('d') || this.isButtonPressed('ArrowRight')) {
      x += 1;
    }
    if (this.isButtonPressed('w') || this.isButtonPressed('ArrowUp')) {
      y -= 1;
    }
    if (this.isButtonPressed('s') || this.isButtonPressed('ArrowDown')) {
      y += 1;
    }
    this.currentMovementDirection = {
      x: x,
      y: y,
    };
    if (this.currentMovementDirection.x !== 0 || this.currentMovementDirection.y !== 0) {
      this.previousNonZeroMovementDirection = {
        x: x,
        y: y,
      };
    }
  }
}
