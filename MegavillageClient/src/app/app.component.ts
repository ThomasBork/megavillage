import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConnectionService } from './connection.service';
import { GameService } from './game.service';
import { KeyboardService } from './keyboard.service';
import { SetDirectionComposerService } from './message-composers/set-direction-composer.service';
import { CreateUserResult } from 'src/shared/user/create-user-result';
import { LogInResult } from 'src/shared/user/log-in-result';
import { UIGame } from './ui-game-state/ui-game';
import { ActionService } from './action.service';
import { MessageDispatcherService } from './message-dispatcher.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public game?: UIGame;
  public authenticationToken: string | null;
  public screen: 'CreateUser' | 'LogIn' | 'Game';

  public constructor(
    private connectionService: ConnectionService,
    private gameService: GameService,
    private keyboardService: KeyboardService,
    private setDirectionComposerService: SetDirectionComposerService,
    private actionService: ActionService,
    private messageDispatcherService: MessageDispatcherService,
  ) {
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
    this.connectionService.connect(this.authenticationToken, (message) => this.messageDispatcherService.handleMessage(message));
  }

  public handleKeyDown(keyEvent: KeyboardEvent): void {
    if (!this.game) {
      return;
    }
    const isButtonPressed = this.keyboardService.isButtonPressed(keyEvent.key);
    if (!isButtonPressed) {
      this.keyboardService.setButtonDown(keyEvent.key);
      if (this.keyboardService.getMovementKeys().includes(keyEvent.key)) {
        const newDirection = this.keyboardService.getMovementDirection();
        const setDirectionMessage = this.setDirectionComposerService.compose(newDirection);
        this.connectionService.sendMessage(setDirectionMessage);
        const previousNonZeroMovementDirection = this.keyboardService.getPreviousNonZeroMovementDirection();
        this.game.setMovementDirection(previousNonZeroMovementDirection);
        this.gameService.updateCurrentTargetObject();
        this.game.setSelectedShop(undefined);
      } else if (keyEvent.key === 'e') {
        const target = this.game.getCurrentTargetObject();
        console.log('Target: ' + target?.getId() + ', ' + target);
        if (target) {
          const currentPlayer = this.gameService.getCurrentPlayer();
          this.actionService.handleGenericActionOnObject(currentPlayer, target);
        }
      } else if (keyEvent.key === 'Escape') {
        this.game.setSelectedShop(undefined);
      }
    }
  }

  public handleKeyUp(keyEvent: KeyboardEvent): void {
    if (!this.game) {
      return;
    }
    this.keyboardService.setButtonUp(keyEvent.key);
    if (this.keyboardService.getMovementKeys().includes(keyEvent.key)) {
      const newDirection = this.keyboardService.getMovementDirection();
      const setDirectionMessage = this.setDirectionComposerService.compose(newDirection);
      this.connectionService.sendMessage(setDirectionMessage);
      const previousNonZeroMovementDirection = this.keyboardService.getPreviousNonZeroMovementDirection();
      this.game.setMovementDirection(previousNonZeroMovementDirection);
      this.gameService.updateCurrentTargetObject();
    }
  }

  public handleKeyPress(keyEvent: KeyboardEvent): void {
    if (!this.game) {
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
