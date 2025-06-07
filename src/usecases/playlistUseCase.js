import { BusinessError } from '../errors/BusinessError';
import { getPlaylistItems } from '../adapters/youtubeApiService';
import { logger } from '../utils/logger';
import { getBearerToken } from './tokenUseCase';

export async function getPlaylists(sessionId) {
  const accessToken = await getBearerToken(sessionId);

  try {
    return await getPlaylistItems(accessToken);
  } catch (error) {
    logger.error('Error retrieving playlists from api', error);
    throw new BusinessError('Error retrieving playlists video api');
  }
}
