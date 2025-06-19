import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { GetBearerTokenUseCase } from './get-bearer-token.js';
import { MediaService } from '../port/services/media.service.js';

export class GetLatestVideosFromChannelUseCase {
  constructor(
    private readonly getBearerToken: GetBearerTokenUseCase,
    private readonly mediaService: MediaService,
  ) {}

  private logger = Logger.getLogger();

  async execute(sessionId: string, channelId: string): Promise<any> {
    const accessToken = await this.getBearerToken.execute(sessionId);

    try {
      return await this.mediaService.getLatestVideosFromChannel(accessToken, channelId);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving channel videos api');
    }
  }
}
