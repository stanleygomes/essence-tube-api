import { BusinessError } from '../domain/errors/BusinessError.js';
import { getLatestVideosFromChannel, getSubscribedChannels } from '../adapters/api/youtubeApi.js';
import { logger } from '../utils/logger.js';
import { getBearerToken } from './tokenUseCase.js';

export async function getChannels(sessionId: string): Promise<any> {
  const accessToken = await getBearerToken(sessionId);

  try {
    return await getSubscribedChannels(accessToken);
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error retrieving subscriptions api');
  }
}

export async function getChannelVideos(sessionId: string, channelId: string): Promise<any> {
  const accessToken = await getBearerToken(sessionId);

  try {
    return await getLatestVideosFromChannel(accessToken, channelId);
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error retrieving channel videos api');
  }
}
