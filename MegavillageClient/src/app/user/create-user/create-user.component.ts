import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { AuthenticationResult } from 'src/shared/user/authentication-result';
import { CreateUserResult } from 'src/shared/user/create-user-result';
import { LogInResult } from 'src/shared/user/log-in-result';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  public userName: string;
  public password: string;
  public errorMessage: string | null;
  @Output()
  public userCreated: EventEmitter<CreateUserResult>;
  public constructor(private userService: UserService) {
    this.userName = '';
    this.password = '';
    this.errorMessage = null;
    this.userCreated = new EventEmitter();
  }

  public createUser(): void {
    this.userService.createUser(this.userName, this.password).subscribe((result) => {
      if (result.errorMessage) {
        this.errorMessage = result.errorMessage;
      } else {
        this.userCreated.emit(result);
      }
    });
  }
}
