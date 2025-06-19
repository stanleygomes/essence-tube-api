import { User } from '../../../../domain/entities/user.entity.js';
import type { UserDocument } from '../schemas/user.schema.js';

export class UserMapper {
  static toEntity(doc: UserDocument): User {
    return {
      uuid: doc.uuid,
      name: doc.name,
      email: doc.email,
      photo_url: doc.photo_url,
      partner_id: doc.partner_id,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    };
  }

  static toDocument(entity: User): Partial<UserDocument> {
    return {
      uuid: entity.uuid,
      name: entity.name,
      email: entity.email,
      photo_url: entity.photo_url,
      partner_id: entity.partner_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
