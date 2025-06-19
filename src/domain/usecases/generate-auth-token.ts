import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { AuthService } from '../port/services/auth.service.js';
import { CreateTokenUseCase } from './create-token.js';

export class GenerateAuthTokenUseCase {
  constructor(
    private readonly authService: AuthService,
    private readonly createToken: CreateTokenUseCase
  ) {}

  private logger = Logger.getLogger();

  async execute(code: string): Promise<string> {
    try {
      const tokenResponse = await this.authService.getToken(code);

      if (!tokenResponse || !tokenResponse.access_token) {
        throw new BusinessError('Failed to retrieve access token from Google');
      }

      const { uuid } = await this.createToken.execute(tokenResponse);
      return uuid;
    } catch (error: any) {
      this.logger.error(error);
      throw new BusinessError(`Error retrieving token: ${error.message}`);
    }
  }
}
