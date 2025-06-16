import { findOne, create, update } from '../adapters/data/mongoRepository';
import { BusinessError } from '../errors/BusinessError';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { refreshToken } from '../adapters/api/googleAuthApi';
import { createToken, getTokenByUUID, updateTokenByUUID } from '@/repositories/tokenRepository';

export async function getBearerToken(sessionId) {
  if (!sessionId) {
    throw new BusinessError('Session ID is required!');
  }

  const token = await getTokenByUUID(sessionId);
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
  return create(tokenResponse);
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

    return update(tokenResponse, uuid, token);
  } catch (error) {
    logger.error(error);
    throw new BusinessError(`Error retrieving token: ${error.message}`);
  }
}

function buildTokenObject(tokenResponse, uuid, token = null) {
  return {
    uuid: uuid,
    access_token: tokenResponse.access_token,
    expires_in: tokenResponse.expires_in,
    scope: tokenResponse.scope,
    token_type: tokenResponse.token_type,
    refresh_token: token || tokenResponse.refresh_token,
    refresh_token_expires_in: tokenResponse.refresh_token_expires_in,
    created_at: new Date(),
  };
}

async function create(tokenResponse) {
  const uuid = uuidv4();
  const tokenObject = buildTokenObject(tokenResponse, uuid);
  await createToken(tokenObject)
}

async function update(tokenResponse, uuid, token) {
  const tokenObject = buildTokenObject(tokenResponse, uuid, token);
  await updateTokenByUUID(tokenObject, uuid);
}
