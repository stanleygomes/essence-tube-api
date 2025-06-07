import { findOne } from '../repositories/mongoRepository';
import { BusinessError } from '../errors/BusinessError';
import { logger } from '../utils/logger';

export async function getBearerToken(sessionId) {
  if (!sessionId) {
    throw new BusinessError('Session ID is required!');
  }

  const token = await getDatabaseToken(sessionId);

  if (!token) {
    throw new BusinessError(`Token not found for the provided session ID: ${sessionId}`);
  }

  return token.access_token;
}

async function getDatabaseToken(uuid) {
  try {
    return await findOne('tokens', { uuid });
  } catch (error) {
    logger.error('Error retrieving token from database', error);
    throw new BusinessError('Error retrieving token from database');
  }
}
