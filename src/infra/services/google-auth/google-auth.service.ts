import axios from 'axios';
import { AuthError } from '../../../domain/errors/AuthError.js';
import { config } from '../../config/index.js';
import { Logger } from '../../logger/pino.logger.js';
import { GoogleTokenResponse } from './responses/google-token.response.js';
import { Token } from '../../../domain/entities/token.entity.js';
import { TokenMapper } from './mappers/token.mapper.js';
import { AuthService } from '../../../domain/port/services/auth.service.js';

const googleConfig = config.services.google;

export class GoogleAuthService implements AuthService {
  private logger = Logger.getLogger();

  async getToken(authCode: string): Promise<Token> {
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

      return TokenMapper.toEntity(res.data);
    } catch (error: any) {
      if (error.response) {
        throw new Error(`Google token error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        throw new Error(`Google token error: ${error.message}`);
      }
    }
  }

  buildUrlConsent(): string {
    return `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleConfig.clientId}` +
      `&redirect_uri=${googleConfig.redirectUri}` +
      `&response_type=code` +
      `&scope=${googleConfig.scope}` +
      `&access_type=offline` +
      `&prompt=consent`;
  }

  async refreshToken(token: string): Promise<Token> {
    try {
      const res = await axios.post<GoogleTokenResponse>(googleConfig.baseUrl, null, {
        params: {
          client_id: googleConfig.clientId,
          client_secret: googleConfig.clientSecret,
          refresh_token: token,
          grant_type: 'refresh_token'
        }
      });

      return TokenMapper.toEntity(
        {
          ...res.data,
          refresh_token: token,
        }
      );
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          this.logger.error(error);
          throw new AuthError('Refresh token invalid or expired.');
        }

        throw new Error(`Google refresh token error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        throw new Error(`Google refresh token error: ${error.message}`);
      }
    }
  }
}
