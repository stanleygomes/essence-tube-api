import { BusinessError } from '../errors/BusinessError';
import { addVideoToPlaylist, getPlaylistItems, getPlaylistList, removeVideoFromPlaylist } from '../adapters/api/youtubeApi';
import { logger } from '../utils/logger';
import { getBearerToken } from './tokenUseCase';

export async function getPlaylists(sessionId) {
  const accessToken = await getBearerToken(sessionId);

  try {
    return await getPlaylistList(accessToken);
  } catch (error) {
    logger.error(error);
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
    logger.error(error);
    throw new BusinessError('Error retrieving playlist videos video api');
  }
}

export async function removePlaylistVideo(sessionId, playlistItemId) {
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

export async function addPlaylistVideo(sessionId, playlistItemId, videoId) {
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
