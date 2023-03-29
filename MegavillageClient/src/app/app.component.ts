import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from 'src/shared/game-state/game';
import { ConnectionService } from './connection.service';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public game?: Game;
  public playerName: string;

  public constructor(
    private connectionService: ConnectionService,
    private gameService: GameService,
  ) {
    this.playerName = 'player' + Math.floor(Math.random() * 1000000);
  }

  public ngOnInit(): void {
    this.gameService.onGameStateReceived.subscribe(game => 
      this.game = game
    );
  }

  public ngOnDestroy(): void {
    this.gameService.onGameStateReceived.unsubscribe();
  }

  public connect() {
    this.connectionService.connect(this.playerName);
  }


  public handleKeyDown(keyEvent: KeyboardEvent): void {
    switch (keyEvent.key) {
      case 'a':
        break;
      case 'd':
        break;
    }
  }

  public handleKeyUp(keyEvent: KeyboardEvent): void {
    
  }
}
