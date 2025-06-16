import { BusinessError } from '../errors/BusinessError';
import { buildUrlConsent, getToken } from '../adapters/api/googleAuthApi';
import { logger } from '../utils/logger';
import { config } from '../config/config';
import { createTokenDatabase } from './tokenUseCase';

export function getUrlConsent() {
  return buildUrlConsent();
}

export async function getAndSaveToken(code) {
  try {
    const tokenResponse = await getToken(code);

    if (!tokenResponse || !tokenResponse.access_token) {
      throw new BusinessError('Failed to retrieve access token from Google');
    }

    const { uuid } = await createTokenDatabase(tokenResponse);
    return uuid;
  } catch (error) {
    logger.error(error);
    throw new BusinessError(`Error retrieving token: ${error.message}`);
  }
}

export function buildUrlRedirectBack(uuid) {
  const webBaseUrl = config.app.web.baseUrl;
  const redirectUrl = new URL(`${webBaseUrl}/auth/redirect`);

  redirectUrl.searchParams.append('uuid', uuid);
  
  return redirectUrl.toString();
}
