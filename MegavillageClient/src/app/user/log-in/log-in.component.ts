import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { LogInResult } from 'src/shared/user/log-in-result';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  public userName: string;
  public password: string;
  public errorMessage: string | null;
  @Output()
  public loggedIn: EventEmitter<LogInResult>;
  public constructor(private userService: UserService) {
    this.userName = '';
    this.password = '';
    this.errorMessage = null;
    this.loggedIn = new EventEmitter();
  }

  public logIn(): void {
    this.userService.logIn(this.userName, this.password).subscribe((result) => {
      if (result.authenticationToken) {
        this.loggedIn.emit(result);
      } else {
        this.errorMessage = result.errorMessage;
      }
    });
  }
}
