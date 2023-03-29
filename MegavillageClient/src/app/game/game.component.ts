import { Component, Input } from '@angular/core';
import { Game } from 'src/shared/game-state/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  @Input()
  game!: Game;

  public zoom = 1;
  public playerCenterX = 50;
  public playerCenterY = 50;

  public getTransform(): string {
    return `scale(${this.zoom}) translate(calc(50% - ${this.playerCenterX}px), calc(50% - ${this.playerCenterY}px))`;
  }

  public handleKeyDown(keyEvent: KeyboardEvent): void {
    switch (keyEvent.key) {
      case 'a':
        this.playerCenterX -= 10;
        break;
      case 'd':
        this.playerCenterX += 10;
        break;
    }
  }

  public handleKeyUp(keyEvent: KeyboardEvent): void {
    
  }
}
