import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationRequest } from './shared/user/authentication-request';
import { LogInRequest } from './shared/user/log-in-request';
import { LogInResult } from './shared/user/log-in-result';
import { AuthenticationResult } from './shared/user/authentication-result';
import { CreateUserRequest } from './shared/user/create-user-request';
import { CreateUserResult } from './shared/user/create-user-result';

@Controller('user')
export class UserController {
  public constructor(private userService: UserService) {}
  @Post('logIn')
  public async logIn(@Body() logInRequest: LogInRequest): Promise<LogInResult> {
    return this.userService.logIn(logInRequest.userName, logInRequest.password);
  }

  @Post('authenticate')
  public async authenticate(@Body() authenticationRequest: AuthenticationRequest): Promise<AuthenticationResult> {
    return this.userService.authenticate(authenticationRequest.authenticationToken);
  }

  @Post('createUser')
  public async createUser(@Body() createUserRequest: CreateUserRequest): Promise<CreateUserResult> {
    return this.userService.createUser(createUserRequest.userName, createUserRequest.password);
  }
}
