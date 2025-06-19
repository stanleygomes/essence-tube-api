import { AuthService } from '../port/services/auth.service.js';

export class GetUrlConsentUseCase {
  constructor(private readonly authService: AuthService) {}

  execute(): string {
    return this.authService.buildUrlConsent();
  }
}
