import { Token } from '../../../../domain/entities/token.entity.js';
import type { TokenDocument } from '../schemas/token.schema.js';

export class TokenMapper {
  static toEntity(doc: TokenDocument): Token {
    return {
      uuid: doc.uuid,
      access_token: doc.access_token,
      expires_in: doc.expires_in,
      scope: doc.scope,
      token_type: doc.token_type,
      refresh_token: doc.refresh_token,
      refresh_token_expires_in: doc.refresh_token_expires_in,
      created_at: doc.created_at,
    };
  }

  static toDocument(entity: Token): Partial<TokenDocument> {
    return {
      uuid: entity.uuid,
      access_token: entity.access_token,
      expires_in: entity.expires_in,
      scope: entity.scope,
      token_type: entity.token_type,
      refresh_token: entity.refresh_token,
      refresh_token_expires_in: entity.refresh_token_expires_in,
      created_at: entity.created_at,
    };
  }
}
