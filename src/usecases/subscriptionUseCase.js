import { BusinessError } from '../errors/BusinessError';
import { getLatestVideosFromChannel, getSubscribedChannels } from '../adapters/youtubeApiService';
import { logger } from '../utils/logger';
import { getBearerToken } from './tokenUseCase';

export async function getChannels(sessionId) {
  const accessToken = await getBearerToken(sessionId);

  try {
    return await getSubscribedChannels(accessToken);
  } catch (error) {
    logger.error('Error retrieving subscriptions from api', error);
    throw new BusinessError('Error retrieving subscriptions api');
  }
}

export async function getChannelVideos(sessionId, channelId) {
  const accessToken = await getBearerToken(sessionId);

  try {
    return await getLatestVideosFromChannel(accessToken, channelId);
  } catch (error) {
    logger.error('Error retrieving channel videos from api', error);
    throw new BusinessError('Error retrieving channel videos api');
  }
}
