import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { GetBearerTokenUseCase } from './get-bearer-token.js';
import { MediaService } from '../port/services/media.service.js';

export class GetVideoUseCase {
  constructor(
    private readonly getBearerToken: GetBearerTokenUseCase,
    private readonly mediaService: MediaService,
  ) {}

  private logger = Logger.getLogger();

  async execute(sessionId: string, videoId: string): Promise<any> {
    const accessToken = await this.getBearerToken.execute(sessionId);

    if (!videoId) {
      throw new BusinessError('Video ID is required!');
    }

    try {
      return this.mediaService.getVideoMetadata(accessToken, videoId);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving video video api');
    }
  }
}
