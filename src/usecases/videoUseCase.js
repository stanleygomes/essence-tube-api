import { BusinessError } from '../errors/BusinessError';
import { getVideoMetadata } from '../adapters/youtubeApiService';
import { logger } from '../utils/logger';
import { getBearerToken } from './tokenUseCase';

export async function getVideo(sessionId, videoId) {
  const accessToken = await getBearerToken(sessionId);

  if (!videoId) {
    throw new BusinessError('Video ID is required!');
  }

  try {
    return await getVideoMetadata(accessToken, videoId);
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error retrieving video video api');
  }
}
