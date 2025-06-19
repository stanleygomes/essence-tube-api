import { config } from '../../infra/config/index.js';
import { PartnerAccountService } from '../port/services/partner-account.service.js';
import { GenerateAuthTokenUseCase } from './generate-auth-token.js';

export class GetUrlRedirectBackUseCase {
  constructor(
    private readonly generateAuthToken: GenerateAuthTokenUseCase,
    private readonly partnerAccountService: PartnerAccountService,
  ) {}

  async execute(authCode: string): Promise<string> {
    const token = await this.generateAuthToken.execute(authCode);
    const partnerUserInfo = await this.partnerAccountService.getUserInfo(token.access_token);

    const webBaseUrl = config.app.web.baseUrl;
    const redirectUrl = new URL(`${webBaseUrl}/auth/redirect`);

    redirectUrl.searchParams.append('uuid', token.uuid);

    return redirectUrl.toString();
  }
}
