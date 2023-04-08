import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from 'src/shared/game-state/game';
import { ConnectionService } from './connection.service';
import { GameService } from './game.service';
import { KeyboardService } from './keyboard.service';
import { SetDirectionComposerService } from './message-composers/set-direction-composer.service';
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
    private setDirectionComposerService: SetDirectionComposerService,
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
    const isButtonPressed = this.keyboardService.isButtonPressed(keyEvent.key);
    if (!isButtonPressed) {
      this.keyboardService.setButtonDown(keyEvent.key);
      if (this.movementKeys.includes(keyEvent.key)) {
        const setDirectionMessage = this.setDirectionComposerService.compose();
        this.connectionService.sendMessage(setDirectionMessage);
        return;
      }
    }
  }

  public handleKeyUp(keyEvent: KeyboardEvent): void {
    if (!this.game) {
      return;
    }
    this.keyboardService.setButtonUp(keyEvent.key);
    if (this.movementKeys.includes(keyEvent.key)) {
      const setDirectionMessage = this.setDirectionComposerService.compose();
      this.connectionService.sendMessage(setDirectionMessage);
      return;
    }
  }
}
