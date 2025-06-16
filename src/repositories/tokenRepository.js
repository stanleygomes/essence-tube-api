import { findOne, create, update } from '../adapters/data/mongoRepository';

export async function getTokenByUUID(uuid) {
  try {
    return await findOne('tokens', { uuid });
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error retrieving token from database');
  }
}

export async function createToken(token) {
  try {
    await create('tokens', token);

    return tokenObject
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error creating token to database');
  }
}

export async function updateTokenByUUID(token, uuid) {
  try {
    await update('tokens', { uuid }, token);

    return tokenObject
  } catch (error) {
    logger.error(error);
    throw new BusinessError('Error updating token to database');
  }
}
