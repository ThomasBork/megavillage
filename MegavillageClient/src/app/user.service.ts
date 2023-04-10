import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AuthenticationResult } from 'src/shared/user/authentication-result';
import { AuthenticationRequest } from 'src/shared/user/authentication-request';
import { LogInResult } from 'src/shared/user/log-in-result';
import { LogInRequest } from 'src/shared/user/log-in-request';
import { CreateUserResult } from 'src/shared/user/create-user-result';
import { CreateUserRequest } from 'src/shared/user/create-user-request';
import { User } from 'src/shared/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user?: User;
  private baseUrl: string;
  public constructor(private httpClient: HttpClient) { 
    this.baseUrl = 'http://localhost:3000/user/';
  }
  public createUser(userName: string, password: string): Observable<CreateUserResult> {
    const createUserRequest: CreateUserRequest = {
      userName: userName,
      password: password,
    };
    
    return this.httpClient.post<CreateUserResult>(this.baseUrl + 'createUser', createUserRequest, {});
  }

  public logIn(userName: string, password: string): Observable<LogInResult> {
    const logInRequest: LogInRequest = {
      userName: userName,
      password: password,
    };
    
    return this.httpClient.post<LogInResult>(this.baseUrl + 'logIn', logInRequest, {});
  }

  public authenticate(authenticationToken: string): Observable<AuthenticationResult> {
    const authenticationRequest: AuthenticationRequest = {
      authenticationToken: authenticationToken,
    };
    
    return this.httpClient.post<AuthenticationResult>(this.baseUrl + 'authenticate', authenticationRequest, {});
  }
}
