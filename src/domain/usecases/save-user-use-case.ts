import { AuthInfo } from '../entities/auth-info.entity.js';
import { User } from '../entities/user.entity.js';
import { AuthInfoToUserMapper } from '../mappers/entities.mapper.js';
import { UserRepository } from '../port/databases/user.repository.js';
import { v4 as uuidv4 } from 'uuid';

export class SaveUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: AuthInfo): Promise<User> {
    const user = await this.userRepository.getUserByPartnerId(userData.partner_id);

    if (!user) {
      const uuid = uuidv4();
      return this.createUser(uuid, userData);
    }

    return this.updateUser(user);
  }

  private async createUser(uuid: string, userData: AuthInfo): Promise<User> {
    const user = AuthInfoToUserMapper.toUser(userData, uuid);
    user.created_at = new Date();
    user.updated_at = new Date();

    return this.userRepository.createUser(user);
  }

  private async updateUser(user: User): Promise<User>  {
    user.updated_at = new Date();
    return this.userRepository.updateUserByUUID(user, user.uuid);
  }
}
