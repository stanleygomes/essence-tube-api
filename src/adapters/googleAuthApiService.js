const axios = require('axios');
import { config } from '../config/config';

const googleConfig = config.services.google;

export async function getGoogleToken(authCode) {
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

export function buildUrlConsentGoogle() {
  return `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${googleConfig.clientId}` +
    `&redirect_uri=${googleConfig.redirectUri}` +
    `&response_type=code` +
    `&scope=${googleConfig.scope}` +
    `&access_type=offline` +
    `&prompt=consent`;
}
