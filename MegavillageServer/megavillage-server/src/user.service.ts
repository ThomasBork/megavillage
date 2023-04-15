import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LogInResult } from 'src/shared/user/log-in-result';
import { AuthenticationResult } from 'src/shared/user/authentication-result';
import { User } from './shared/user/user';
import { v4 as uuid } from 'uuid';
import { CreateUserResult } from './shared/user/create-user-result';
import { UserPersistenceService } from './user-persistence.service';

@Injectable()
export class UserService {
  private encryptionSaltRounds: number;
  public constructor(private userPersistenceService: UserPersistenceService) {
    this.encryptionSaltRounds = 10;
  }

  public createUser(userName: string, rawPassword: string): CreateUserResult {
    if (userName.length === 0) {
      return {
        errorMessage: 'User name must not be empty.',
      };
    }
    if (rawPassword.length === 0) {
      return {
        errorMessage: 'Password must not be empty.',
      };
    }
    
    const existingUser = this.userPersistenceService.findUserWithUserName(userName);
    if (existingUser) {
      return {
        errorMessage: 'User already exists.',
      };
    }
    const passwordHash = this.encryptPassword(rawPassword);
    const authenticationToken = uuid();
    this.userPersistenceService.insertUser(userName, passwordHash, authenticationToken);
    return {
      errorMessage: null,
    };
  }

  public logIn(userName: string, rawPassword: string): LogInResult {
    const user = this.userPersistenceService.findUserWithUserName(userName);
    if (!user) {
      return {
        authenticationToken: null,
        errorMessage: 'User could not be found.',
      };
    }
    if (!this.doesPasswordMatchHash(rawPassword, user.passwordHash)) {
      return {
        authenticationToken: null,
        errorMessage: 'User name and password do not match.',
      };
    }
    return {
      authenticationToken: user.authenticationToken,
      errorMessage: null,
    };
  }

  public authenticate(authenticationToken: string): AuthenticationResult {
    const user = this.userPersistenceService.findUserWithAuthenticationToken(authenticationToken);
    if (!user) {
      return {
        user: null,
        errorMessage: 'Authentication token incorrect or expired.',
      };
    }
    return {
      user: user,
      errorMessage: null,
    };
  }

  public getUserWithId(userId: number): User {
    const user = this.userPersistenceService.findUserWithId(userId);
    if (!user) {
      throw new Error('User not found with id: "' + userId + '".');
    }
    return user;
  }

  private encryptPassword(rawPassword: string): string {
    const hash = bcrypt.hashSync(rawPassword, this.encryptionSaltRounds);
    return hash;
  }
  
  private doesPasswordMatchHash(rawPassword: string, hash: string): boolean {
    return bcrypt.compareSync(rawPassword, hash);
  }
}
