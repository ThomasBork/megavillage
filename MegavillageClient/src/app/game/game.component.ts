import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/shared/game-state/game';
import { GameService } from '../game.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Input()
  public game!: Game;

  public zoom = 1;
  public get playerCenterX(): number {
    const player = this.playerService.getPlayer(this.game);
    return player.position.x + player.size.x / 2;
  };
  public get playerCenterY(): number {
    const player = this.playerService.getPlayer(this.game);
    return player.position.y + player.size.y / 2;
  };

  public constructor(private playerService: PlayerService) {}
  
  public ngOnInit(): void {
    
  }

  public getTransform(): string {
    return `scale(${this.zoom}) translate(calc(50% - ${this.playerCenterX}px), calc(50% - ${this.playerCenterY}px))`;
  }
}
