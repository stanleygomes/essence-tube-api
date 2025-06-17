import { BusinessError } from '../domain/errors/BusinessError.js';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { refreshToken, GoogleTokenResponse } from '../adapters/api/google-auth/googleAuthApi.js';
import { createToken, getTokenByUUID, updateTokenByUUID } from '../repositories/tokenRepository.js';
import { Token } from '../domain/entities/token.entity.js';

export async function getBearerToken(sessionId: string): Promise<string> {
  if (!sessionId) {
    throw new BusinessError('Session ID is required!');
  }

  const token = await getTokenByUUID(sessionId) as Token | null;
  if (!token) {
    throw new BusinessError(`Token not found for the provided session ID: ${sessionId}`);
  }

  if (isTokenExpired(token)) {
    const newToken = await getRefreshToken(token.refresh_token, token.uuid);
    return newToken.access_token;
  }

  return token.access_token;
}

export async function createTokenDatabase(tokenResponse: GoogleTokenResponse): Promise<Token> {
  return create(tokenResponse);
}

function isTokenExpired(token: Token): boolean {
  if (!token || !token.created_at || !token.expires_in) return true;
  const createdAt = new Date(token.created_at).getTime();
  const expiresInMs = token.expires_in * 1000;
  return Date.now() > (createdAt + expiresInMs - 60000);
}

async function getRefreshToken(token: string, uuid: string): Promise<Token> {
  if (!token) {
    throw new BusinessError('Refresh token is required!');
  }

  try {
    const tokenResponse = await refreshToken(token);

    if (!tokenResponse || !tokenResponse.access_token) {
      throw new BusinessError('Failed to retrieve access token from Google after refresh');
    }

    return update(tokenResponse, uuid, token);
  } catch (error: any) {
    logger.error(error);
    throw new BusinessError(`Error retrieving token: ${error.message}`);
  }
}

function buildTokenObject(tokenResponse: GoogleTokenResponse, uuid: string, token?: string | null): Token {
  if (!tokenResponse || !tokenResponse.access_token) {
    throw new BusinessError('Invalid token response from Google. Absent access_token.');
  }

  if (!tokenResponse.refresh_token) {
    throw new BusinessError('Invalid token response from Google. Absent refresh_token.');
  }

  if (!tokenResponse.expires_in) {
    throw new BusinessError('Invalid token response from Google. Absent expires_in.');
  }

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

async function create(tokenResponse: GoogleTokenResponse): Promise<Token> {
  const uuid = uuidv4();
  const tokenObject = buildTokenObject(tokenResponse, uuid);
  await createToken(tokenObject);

  return tokenObject;
}

async function update(tokenResponse: GoogleTokenResponse, uuid: string, token: string): Promise<Token> {
  const tokenObject = buildTokenObject(tokenResponse, uuid, token);
  await updateTokenByUUID(tokenObject, uuid);
  return tokenObject;
}
