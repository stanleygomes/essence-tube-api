import { config } from '../../infra/config/index.js';
import { GenerateAuthTokenUseCase } from './generate-auth-token.js';

export class GetUrlRedirectBackUseCase {
  constructor(private readonly generateAuthToken: GenerateAuthTokenUseCase) {}

  async execute(authCode: string): Promise<string> {
    const uuid = await this.generateAuthToken.execute(authCode);

    const webBaseUrl = config.app.web.baseUrl;
    const redirectUrl = new URL(`${webBaseUrl}/auth/redirect`);

    redirectUrl.searchParams.append('uuid', uuid);

    return redirectUrl.toString();
  }
}
