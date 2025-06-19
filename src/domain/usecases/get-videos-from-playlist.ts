import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { GetBearerTokenUseCase } from './get-bearer-token.js';
import { PartnerMediaService } from '../port/services/partner-media.service.js';

export class GetVideosFromPlaylistUseCase {
  constructor(
    private readonly getBearerToken: GetBearerTokenUseCase,
    private readonly partnerMediaService: PartnerMediaService,
  ) {}

  private logger = Logger.getLogger();

  async execute(sessionId: string, playlistId: string): Promise<any> {
    const accessToken = await this.getBearerToken.execute(sessionId);

    if (!playlistId) {
      throw new BusinessError('Playlist ID is required!');
    }

    try {
      return await this.partnerMediaService.getPlaylistItems(accessToken, playlistId);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving playlist videos video api');
    }
  }
}
