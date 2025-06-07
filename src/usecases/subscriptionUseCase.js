import { BusinessError } from '../errors/BusinessError';
import { getSubscribedChannels } from '../adapters/youtubeApiService';
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
