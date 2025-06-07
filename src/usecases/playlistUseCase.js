import { BusinessError } from '../errors/BusinessError';
import { getPlaylistItems, getPlaylistList } from '../adapters/youtubeApiService';
import { logger } from '../utils/logger';
import { getBearerToken } from './tokenUseCase';

export async function getPlaylists(sessionId) {
  const accessToken = await getBearerToken(sessionId);

  try {
    return await getPlaylistList(accessToken);
  } catch (error) {
    logger.error('Error retrieving playlists from api', error);
    throw new BusinessError('Error retrieving playlists video api');
  }
}

export async function getPlaylistVideos(sessionId, playlistId) {
  const accessToken = await getBearerToken(sessionId);

  if (!playlistId) {
    throw new BusinessError('Playlist ID is required!');
  }

  try {
    return await getPlaylistItems(accessToken, playlistId);
  } catch (error) {
    logger.error('Error retrieving playlist videos from api', error);
    throw new BusinessError('Error retrieving playlist videos video api');
  }
}
