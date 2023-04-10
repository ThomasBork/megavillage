import { User } from './user';

export interface AuthenticationResult {
  user: User | null;
  errorMessage: string | null;
}
