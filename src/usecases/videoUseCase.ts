import { BusinessError } from '../domain/errors/BusinessError.js';
import { getVideoMetadata } from '../adapters/api/youtubeApi.js';
import { logger } from '../utils/logger.js';
import { getBearerToken } from './tokenUseCase.js';

export async function getVideo(sessionId: string, videoId: string): Promise<any> {
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
