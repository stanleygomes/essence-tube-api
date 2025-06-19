import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import type { AuthService } from '../port/services/auth.service.js';
import { Token } from '../entities/token.entity.js';
import { TokenFactory } from '../factories/token.factory.js';
import { TokenRepository } from '../port/databases/token.repository.js';

export class SaveRefreshTokenUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenRepository: TokenRepository,

  ) {}

  private logger = Logger.getLogger();

  async execute(token: string, uuid: string): Promise<Token> {
    if (!token) {
      throw new BusinessError('Refresh token is required!');
    }

    try {
      const tokenResponse = await this.authService.refreshToken(token);

      if (!tokenResponse || !tokenResponse.access_token) {
        throw new BusinessError('Failed to retrieve access token from Google after refresh');
      }

      return this.updateOnDatabase(tokenResponse, uuid, token);
    } catch (error: any) {
      this.logger.error(error);
      throw new BusinessError(`Error retrieving token: ${error.message}`);
    }
  }

  private async updateOnDatabase(tokenResponse: Token, uuid: string, token: string): Promise<Token> {
    const tokenObject = TokenFactory.build(tokenResponse, uuid, token);
    await this.tokenRepository.updateTokenByUUID(tokenObject, uuid);

    return tokenObject;
  }
}
