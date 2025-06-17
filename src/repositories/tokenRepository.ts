import { findOne, create, update } from '../adapters/data/mongoRepository.js';
import { logger } from '../utils/logger.js';
import { BusinessError } from '../domain/errors/BusinessError.js';
import type { Token } from '../usecases/tokenUseCase.js';

export async function getTokenByUUID(uuid: string): Promise<Token | null> {
  try {
    return await findOne('tokens', { uuid }) as Token | null;
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error retrieving token from database');
  }
}

export async function createToken(token: Token): Promise<Token> {
  try {
    await create('tokens', token);
    return token;
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error creating token to database');
  }
}

export async function updateTokenByUUID(token: Token, uuid: string): Promise<Token> {
  try {
    await update('tokens', { uuid }, token);
    return token;
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error updating token to database');
  }
}
