import { MongoRepository } from './../repository.js';
import { BusinessError } from '../../../../domain/errors/BusinessError.js';
import type { Token } from '../../../../domain/entities/token.entity.js';
import { TokenMapper } from '../mappers/token.mapper.js';
import { Logger } from '../../../logger/pino.logger.js'
import type { TokenRepository } from '../../../../domain/port/databases/token.repository.js';
import { TokenDocument, TokenModel } from '../schemas/token.schema.js';

export class TokenMongoDBRepository implements TokenRepository {
  private tokenRepository = new MongoRepository(TokenModel);
  private logger = Logger.getLogger()

  async getTokenByUUID(uuid: string): Promise<Token | null> {
    try {
      const doc = await this.tokenRepository.findOne({ uuid })

      return doc ? TokenMapper.toEntity(doc) : null;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving token from database');
    }
  }

  async createToken(token: Token): Promise<Token> {
    try {
      let doc = TokenMapper.toDocument(token);

      if ('_id' in doc) {
        delete (doc as any)._id;
      }

      await this.tokenRepository.create(doc as Omit<Partial<TokenDocument>, '_id'>);
      return token;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error creating token to database');
    }
  }

  async updateTokenByUUID(token: Token, uuid: string): Promise<Token> {
    try {
      const doc = TokenMapper.toDocument(token);
      await this.tokenRepository.update({ uuid }, doc);
      return token;
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error updating token to database');
    }
  }
}
