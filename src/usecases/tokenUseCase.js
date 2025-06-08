import { findOne, create, update } from '../repositories/mongoRepository';
import { BusinessError } from '../errors/BusinessError';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { refreshToken } from '../adapters/googleAuthApiService';

export async function getBearerToken(sessionId) {
  if (!sessionId) {
    throw new BusinessError('Session ID is required!');
  }

  const token = await getDatabaseToken(sessionId);
  if (!token) {
    throw new BusinessError(`Token not found for the provided session ID: ${sessionId}`);
  }

  if (isTokenExpired(token)) {
    const newToken = await getRefreshToken(token.refresh_token, token.uuid);
    return newToken.access_token;
  }

  return token.access_token;
}

export async function createTokenDatabase(tokenResponse) {
  return createToken(tokenResponse);
}

async function getDatabaseToken(uuid) {
  try {
    return await findOne('tokens', { uuid });
  } catch (error) {
    logger.error('Error retrieving token from database', error);
    throw new BusinessError('Error retrieving token from database');
  }
}

function isTokenExpired(token) {
  if (!token || !token.created_at || !token.expires_in) return true;
  const createdAt = new Date(token.created_at).getTime();
  const expiresInMs = token.expires_in * 1000;
  return Date.now() > (createdAt + expiresInMs - 60000);
}

async function getRefreshToken(token, uuid) {
  if (!token) {
    throw new BusinessError('Refresh token is required!');
  }

  try {
    const tokenResponse = await refreshToken(token);

    if (!tokenResponse || !tokenResponse.access_token) {
      throw new BusinessError('Failed to retrieve access token from Google after refresh');
    }

    return updateToken(tokenResponse, uuid);
  } catch (error) {
    logger.error(`Error retrieving token`, error);
    throw new BusinessError(`Error retrieving token: ${error.message}`);
  }
}

function buildTokenObject(tokenResponse, uuid) {
  return {
    uuid: uuid,
    access_token: tokenResponse.access_token,
    expires_in: tokenResponse.expires_in,
    scope: tokenResponse.scope,
    token_type: tokenResponse.token_type,
    refresh_token_expires_in: tokenResponse.refresh_token_expires_in,
    created_at: new Date(),
  };
}

async function createToken(tokenResponse) {
  try {
    const uuid = uuidv4();
    const tokenObject = buildTokenObject(tokenResponse, uuid);
    await create('tokens', tokenObject);

    return tokenObject
  } catch (error) {
    logger.error('Error creating token to database', error);
    throw new BusinessError('Error creating token to database');
  }
}

async function updateToken(tokenResponse, uuid) {
  try {
    const tokenObject = buildTokenObject(tokenResponse, uuid);
    await update('tokens', { uuid }, tokenObject);

    return tokenObject
  } catch (error) {
    logger.error('Error updating token to database', error);
    throw new BusinessError('Error updating token to database');
  }
}
