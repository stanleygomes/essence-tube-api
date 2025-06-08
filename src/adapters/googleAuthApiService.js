const axios = require('axios');
import { AuthError } from '@/errors/AuthError';
import { config } from '../config/config';
import { logger } from '../utils/logger';

const googleConfig = config.services.google;

export async function getToken(authCode) {
  try {
    const res = await axios.post(googleConfig.baseUrl, null, {
      params: {
        code: authCode,
        client_id: googleConfig.clientId,
        client_secret: googleConfig.clientSecret,
        redirect_uri: googleConfig.redirectUri,
        grant_type: 'authorization_code'
      }
    });

    return res.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Google token error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error(`Google token error: ${error.message}`);
    }
  }
}

export function buildUrlConsent() {
  return `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${googleConfig.clientId}` +
    `&redirect_uri=${googleConfig.redirectUri}` +
    `&response_type=code` +
    `&scope=${googleConfig.scope}` +
    `&access_type=offline` +
    `&prompt=consent`;
}

export async function refreshToken(token) {
  try {
    const res = await axios.post(googleConfig.baseUrl, null, {
      params: {
        client_id: googleConfig.clientId,
        client_secret: googleConfig.clientSecret,
        refresh_token: token,
        grant_type: 'refresh_token'
      }
    });

    return res.data;
  } catch (error) {
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
