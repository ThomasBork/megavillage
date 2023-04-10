import { Injectable } from '@nestjs/common';
import { User } from './shared/user/user';

@Injectable()
export class UserPersistenceService {
  private users: User[];
  private nextUserId: number;

  public constructor() {
    this.users = [];
    this.nextUserId = 1;
  }

  public findUserWithId(userId: number): User | undefined {
    return this.users.find((u) => u.id === userId);
  }

  public findUserWithUserName(userName: string): User | undefined {
    return this.users.find((u) => u.userName === userName);
  }

  public findUserWithAuthenticationToken(authenticationToken: string): User | undefined {
    return this.users.find((u) => u.authenticationToken === authenticationToken);
  }

  public insertUser(userName: string, passwordHash: string, authenticationToken: string): void {
    const user: User = {
      id: this.nextUserId++,
      userName: userName,
      passwordHash: passwordHash,
      authenticationToken: authenticationToken,
    };
    this.users.push(user);
  }
}
