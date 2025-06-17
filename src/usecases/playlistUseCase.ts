import { BusinessError } from '../domain/errors/BusinessError.js';
import { 
  addVideoToPlaylist, 
  getPlaylistItems, 
  getPlaylistList, 
  removeVideoFromPlaylist 
} from '../adapters/api/youtubeApi.js';
import { logger } from '../utils/logger.js';
import { getBearerToken } from './tokenUseCase.js';

export async function getPlaylists(sessionId: string): Promise<any> {
  const accessToken = await getBearerToken(sessionId);

  try {
    return await getPlaylistList(accessToken);
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error retrieving playlists video api');
  }
}

export async function getPlaylistVideos(sessionId: string, playlistId: string): Promise<any> {
  const accessToken = await getBearerToken(sessionId);

  if (!playlistId) {
    throw new BusinessError('Playlist ID is required!');
  }

  try {
    return await getPlaylistItems(accessToken, playlistId);
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error retrieving playlist videos video api');
  }
}

export async function removePlaylistVideo(sessionId: string, playlistItemId: string): Promise<any> {
  const accessToken = await getBearerToken(sessionId);

  if (!playlistItemId) {
    throw new BusinessError('Playlist Item ID is required!');
  }

  try {
    return await removeVideoFromPlaylist(accessToken, playlistItemId);
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error deleting playlist items video api');
  }
}

export async function addPlaylistVideo(sessionId: string, playlistItemId: string, videoId: string): Promise<any> {
  const accessToken = await getBearerToken(sessionId);

  if (!playlistItemId) {
    throw new BusinessError('Playlist Item ID is required!');
  }

  if (!videoId) {
    throw new BusinessError('Video ID is required!');
  }

  try {
    return await addVideoToPlaylist(accessToken, playlistItemId, videoId);
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error adding a video to a playlist api');
  }
}
