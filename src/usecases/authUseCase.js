import { findOne, create, update } from '../repositories/mongoRepository';
import { BusinessError } from '../errors/BusinessError';
import { buildUrlConsentGoogle, getGoogleToken } from '../adapters/googleAuthApiService';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config';

export function buildUrlConsent() {
  return buildUrlConsentGoogle();
}

export async function getAndSaveToken(code) {

  try {
    const tokenResponse = await getGoogleToken(code);
    if (!tokenResponse || !tokenResponse.access_token) {
      throw new BusinessError('Failed to retrieve access token from Google');
    }

    return createTokenDatabase(tokenResponse);
  } catch (error) {
    logger.error(`Error retrieving token`, error);
    throw new BusinessError(`Error retrieving token: ${error.message}`);
  }
}

export function buildUrlRedirectBack(uuid) {
  const webBaseUrl = config.app.web.baseUrl;
  const redirectUrl = new URL(`${webBaseUrl}/auth/redirect`);

  redirectUrl.searchParams.append('uuid', uuid);
  
  return redirectUrl.toString();
}

async function createTokenDatabase(tokenResponse) {
  try {
    const uuid = uuidv4();
    const token = {
      uuid: uuid,
      access_token: tokenResponse.access_token,
      expires_in: tokenResponse.expires_in,
      refresh_token: tokenResponse.refresh_token,
      scope: tokenResponse.scope,
      token_type: tokenResponse.token_type,
      refresh_token_expires_in: tokenResponse.refresh_token_expires_in,
      created_at: new Date(),
    };

    await create('tokens', token);

    return uuid
  } catch (error) {
    logger.error('Error saving token to database', error);
    throw new BusinessError('Error saving token to database');
  }
}
