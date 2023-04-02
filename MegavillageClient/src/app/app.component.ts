import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from 'src/shared/game-state/game';
import { ConnectionService } from './connection.service';
import { GameService } from './game.service';
import { KeyboardService } from './keyboard.service';
import { SetVelocityComposerService } from './message-composers/set-velocity-composer.service';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public game?: Game;
  public get playerName(): string {
    return this.playerService.playerName;
  }
  public set playerName(name: string) {
    this.playerService.playerName = name;
  }

  private movementKeys: string[];

  public constructor(
    private connectionService: ConnectionService,
    private gameService: GameService,
    private playerService: PlayerService,
    private keyboardService: KeyboardService,
    private setVelocityComposerService: SetVelocityComposerService,
  ) {
    this.movementKeys = ['a', 's', 'd', 'w'];
  }

  public ngOnInit(): void {
    this.gameService.onGameStateReceived.subscribe(game => {
      this.game = game;
      setTimeout(() => (document.getElementsByClassName('game')[0] as HTMLElement).focus(), 0);
    });
  }

  public ngOnDestroy(): void {
    this.gameService.onGameStateReceived.unsubscribe();
  }

  public connect() {
    this.connectionService.connect(this.playerName);
  }


  public handleKeyDown(keyEvent: KeyboardEvent): void {
    if (!this.game) {
      return;
    }
    this.keyboardService.setButtonDown(keyEvent.key);
    if (this.movementKeys.includes(keyEvent.key)) {
      const setVelocityMessage = this.setVelocityComposerService.compose();
      this.connectionService.sendMessage(setVelocityMessage);
      return;
    }
  }

  public handleKeyUp(keyEvent: KeyboardEvent): void {
    if (!this.game) {
      return;
    }
    this.keyboardService.setButtonUp(keyEvent.key);
    if (this.movementKeys.includes(keyEvent.key)) {
      const setVelocityMessage = this.setVelocityComposerService.compose();
      this.connectionService.sendMessage(setVelocityMessage);
      return;
    }
  }
}
