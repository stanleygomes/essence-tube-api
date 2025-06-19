import { BusinessError } from '../errors/BusinessError.js';
import { Token } from '../entities/token.entity.js';
import { SaveRefreshTokenUseCase } from './save-refresh-token.js';
import { TokenRepository } from '../port/databases/token.repository.js';

export class GetBearerTokenUseCase {
  constructor(
    private readonly saveRefreshToken: SaveRefreshTokenUseCase,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(sessionId: string): Promise<string> {
    if (!sessionId) {
      throw new BusinessError('Session ID is required!');
    }

    const token = await this.tokenRepository.getTokenByUUID(sessionId) as Token | null;
    if (!token) {
      throw new BusinessError(`Token not found for the provided session ID: ${sessionId}`);
    }

    if (this.isTokenExpired(token)) {
      const newToken = await this.saveRefreshToken.execute(token.refresh_token, token.uuid);
      return newToken.access_token;
    }

    return token.access_token;
  }

  private isTokenExpired(token: Token): boolean {
    if (!token || !token.created_at || !token.expires_in) return true;
    const createdAt = new Date(token.created_at).getTime();
    const expiresInMs = token.expires_in * 1000;
    return Date.now() > (createdAt + expiresInMs - 60000);
  }
}
