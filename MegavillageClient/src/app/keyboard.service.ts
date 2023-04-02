import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private buttonsPressed: Map<string, boolean>;
  public constructor() { 
    this.buttonsPressed = new Map<string, boolean>();
  }

  public setButtonDown(keyCode: string): void {
    this.buttonsPressed.set(keyCode, true);
  }

  public setButtonUp(keyCode: string): void {
    this.buttonsPressed.set(keyCode, false);
  }

  public isButtonPressed(keyCode: string): boolean {
    if (!this.buttonsPressed.has(keyCode)) {
      return false;
    }
    return this.buttonsPressed.get(keyCode) === true;
  }
}
