import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { GetBearerTokenUseCase } from './get-bearer-token.js';
import { MediaService } from '../port/services/media.service.js';

export class AddVideoToPlaylistUseCase {
  constructor(
    private readonly getBearerToken: GetBearerTokenUseCase,
    private readonly mediaService: MediaService,
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
      return await this.mediaService.addVideoToPlaylist(accessToken, playlistItemId, videoId);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error adding a video to a playlist api');
    }
  }
}
