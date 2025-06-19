import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { GetBearerTokenUseCase } from './get-bearer-token.js';
import { PartnerMediaService } from '../port/services/partner-media.service.js';

export class AddVideoToPlaylistUseCase {
  constructor(
    private readonly getBearerToken: GetBearerTokenUseCase,
    private readonly partnerMediaService: PartnerMediaService,
  ) {}

  private logger = Logger.getLogger();

  async execute(sessionId: string, playlistItemId: string, videoId: string): Promise<any> {
    const accessToken = await this.getBearerToken.execute(sessionId);

    if (!playlistItemId) {
      throw new BusinessError('Playlist Item ID is required!');
    }

    if (!videoId) {
      throw new BusinessError('Video ID is required!');
    }

    try {
      return await this.partnerMediaService.addVideoToPlaylist(accessToken, playlistItemId, videoId);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error adding a video to a playlist api');
    }
  }
}
