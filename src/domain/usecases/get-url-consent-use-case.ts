import { PartnerOAuthService } from '../port/services/partner-oauth.service.js';

export class GetUrlConsentUseCase {
  constructor(private readonly partnerOAuthService: PartnerOAuthService) {}

  execute(): string {
    return this.partnerOAuthService.buildUrlConsent();
  }
}
