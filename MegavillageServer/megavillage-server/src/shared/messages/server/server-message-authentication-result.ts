import { User } from 'src/shared/user/user';

export interface ServerMessageAuthenticationResult {
  user: User | null;
  errorMessage: string | null;
}
