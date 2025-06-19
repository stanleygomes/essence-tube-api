import { BusinessError } from '../errors/BusinessError.js';
import { Logger } from '../../infra/logger/pino.logger.js';
import { GetBearerTokenUseCase } from './get-bearer-token.js';
import { PartnerMediaService } from '../port/services/partner-media.service.js';

export class GetSubscribedChannelsUseCase {
  constructor(
    private readonly getBearerToken: GetBearerTokenUseCase,
    private readonly partnerMediaService: PartnerMediaService,
  ) {}

  private logger = Logger.getLogger();

  async execute(sessionId: string): Promise<any> {
    const accessToken = await this.getBearerToken.execute(sessionId);

    try {
      return await this.partnerMediaService.getSubscribedChannels(accessToken);
    } catch (error) {
      this.logger.error(error);
      throw new BusinessError('Error retrieving subscriptions api');
    }
  }
}
