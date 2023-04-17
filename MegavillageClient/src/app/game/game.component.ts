import { Component, Input, OnInit } from '@angular/core';
import { UIGame } from '../ui-game-state/ui-game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  @Input()
  public game!: UIGame;

  public zoom = 1;
  public get playerCenterX(): number {
    const player = this.game.getCurrentPlayer();
    return player.getPosition().x;
  };
  public get playerCenterY(): number {
    const player = this.game.getCurrentPlayer();
    return player.getPosition().y;
  };

  public getTransform(): string {
    return `scale(${this.zoom}) translate(calc(50% - ${this.playerCenterX}px), calc(50% - ${this.playerCenterY}px))`;
  }
}
