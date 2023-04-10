import { Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from 'src/shared/game-state/game';
import { ConnectionService } from './connection.service';
import { GameService } from './game.service';
import { KeyboardService } from './keyboard.service';
import { SetDirectionComposerService } from './message-composers/set-direction-composer.service';
import { PlayerService } from './player.service';
import { UserService } from './user.service';
import { CreateUserResult } from 'src/shared/user/create-user-result';
import { LogInResult } from 'src/shared/user/log-in-result';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public game?: Game;
  public authenticationToken: string | null;
  public screen: 'CreateUser' | 'LogIn' | 'Game';

  private movementKeys: string[];

  public constructor(
    private connectionService: ConnectionService,
    private gameService: GameService,
    private keyboardService: KeyboardService,
    private setDirectionComposerService: SetDirectionComposerService,
  ) {
    this.movementKeys = ['a', 's', 'd', 'w', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];
    this.screen = 'LogIn';
    this.authenticationToken = null;
  }

  public ngOnInit(): void {
    this.gameService.onGameStateReceived.subscribe(game => {
      this.screen = 'Game';
      this.game = game;
      setTimeout(() => (document.getElementsByClassName('game')[0] as HTMLElement).focus(), 0);
    });
  }

  public ngOnDestroy(): void {
    this.gameService.onGameStateReceived.unsubscribe();
  }

  public connect() {
    if (!this.authenticationToken) {
      throw new Error('Unable to connect without an authentication token.');
    }
    this.connectionService.connect(this.authenticationToken);
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

  public goToCreateUser(): void {
    this.screen = 'CreateUser';
  }

  public goToLogIn(): void {
    this.screen = 'LogIn';
  }

  public logOut(): void {
    this.goToLogIn();
  }

  public onUserCreated(result: CreateUserResult): void {
    this.goToLogIn();
  }

  public onLoggedIn(result: LogInResult): void {
    this.authenticationToken = result.authenticationToken;
    this.connect();
  }
}
