import { BusinessError } from '../domain/errors/BusinessError.js';
import { buildUrlConsent, getToken } from '../adapters/api/google-auth/googleAuthApi.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';
import { createTokenDatabase } from './tokenUseCase.js';

export function getUrlConsent(): string {
  return buildUrlConsent();
}

export async function getAndSaveToken(code: string): Promise<string> {
  try {
    const tokenResponse = await getToken(code);

    if (!tokenResponse || !tokenResponse.access_token) {
      throw new BusinessError('Failed to retrieve access token from Google');
    }

    const { uuid } = await createTokenDatabase(tokenResponse);
    return uuid;
  } catch (error: any) {
    logger.error(error);
    throw new BusinessError(`Error retrieving token: ${error.message}`);
  }
}

export function buildUrlRedirectBack(uuid: string): string {
  const webBaseUrl = config.app.web.baseUrl;
  const redirectUrl = new URL(`${webBaseUrl}/auth/redirect`);

  redirectUrl.searchParams.append('uuid', uuid);

  return redirectUrl.toString();
}
