import axios from 'axios';
import { AuthError } from '../../../domain/errors/AuthError.js';
import { config } from '../../../config/config.js';
import { logger } from '../../../utils/logger.js';

const googleConfig = config.services.google;

export interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  id_token?: string;
  [key: string]: any;
}

export async function getToken(authCode: string): Promise<GoogleTokenResponse> {
  try {
    const res = await axios.post<GoogleTokenResponse>(googleConfig.baseUrl, null, {
      params: {
        code: authCode,
        client_id: googleConfig.clientId,
        client_secret: googleConfig.clientSecret,
        redirect_uri: googleConfig.redirectUri,
        grant_type: 'authorization_code'
      }
    });

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Google token error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error(`Google token error: ${error.message}`);
    }
  }
}

export function buildUrlConsent(): string {
  return `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${googleConfig.clientId}` +
    `&redirect_uri=${googleConfig.redirectUri}` +
    `&response_type=code` +
    `&scope=${googleConfig.scope}` +
    `&access_type=offline` +
    `&prompt=consent`;
}

export async function refreshToken(token: string): Promise<GoogleTokenResponse> {
  try {
    const res = await axios.post<GoogleTokenResponse>(googleConfig.baseUrl, null, {
      params: {
        client_id: googleConfig.clientId,
        client_secret: googleConfig.clientSecret,
        refresh_token: token,
        grant_type: 'refresh_token'
      }
    });

    return res.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        logger.error(error);
        throw new AuthError('Refresh token invalid or expired.');
      }

      throw new Error(`Google refresh token error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error(`Google refresh token error: ${error.message}`);
    }
  }
}
