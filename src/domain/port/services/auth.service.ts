import { Token } from '../../entities/token.entity.js';

export interface AuthService {
  getToken(authCode: string): Promise<Token>;
  refreshToken(token: string): Promise<Token>;
  buildUrlConsent(): string;
}
