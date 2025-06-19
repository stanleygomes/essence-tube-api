import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { GetBearerTokenUseCase } from './get-bearer-token.js';
import { MediaService } from '../port/services/media.service.js';

export class GetVideosFromPlaylistUseCase {
  constructor(
    private readonly getBearerToken: GetBearerTokenUseCase,
    private readonly mediaService: MediaService,
  ) {}

  private logger = Logger.getLogger();

  async execute(sessionId: string, playlistId: string): Promise<any> {
    const accessToken = await this.getBearerToken.execute(sessionId);

    if (!playlistId) {
      throw new BusinessError('Playlist ID is required!');
    }

    try {
      return await this.mediaService.getPlaylistItems(accessToken, playlistId);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving playlist videos video api');
    }
  }
}
