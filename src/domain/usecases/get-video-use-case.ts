import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { GetBearerTokenUseCase } from './get-bearer-token.js';
import { PartnerMediaService } from '../port/services/partner-media.service.js';

export class GetVideoUseCase {
  constructor(
    private readonly getBearerToken: GetBearerTokenUseCase,
    private readonly partnerMediaService: PartnerMediaService,
  ) {}

  private logger = Logger.getLogger();

  async execute(sessionId: string, videoId: string): Promise<any> {
    const accessToken = await this.getBearerToken.execute(sessionId);

    if (!videoId) {
      throw new BusinessError('Video ID is required!');
    }

    try {
      return this.partnerMediaService.getVideoMetadata(accessToken, videoId);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving video video api');
    }
  }
}
