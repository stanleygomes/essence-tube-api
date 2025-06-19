import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { GetBearerTokenUseCase } from './get-bearer-token.js';
import { MediaService } from '../port/services/media.service.js';

export class RemoveVideoFromPlaylistUseCase {
  constructor(
    private readonly getBearerToken: GetBearerTokenUseCase,
    private readonly mediaService: MediaService,
  ) {}

  private logger = Logger.getLogger();

  async execute(sessionId: string, playlistItemId?: string): Promise<any> {
    const accessToken = await this.getBearerToken.execute(sessionId);

    if (!playlistItemId) {
      throw new BusinessError('Playlist Item ID is required!');
    }

    try {
      return await this.mediaService.removeVideoFromPlaylist(accessToken, playlistItemId);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error deleting playlist items video api');
    }
  }
}
