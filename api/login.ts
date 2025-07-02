import '../src/infra/providers/dependencies.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authRoutes } from '../src/infra/providers/dependencies.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  authRoutes.getUrlConsent(req, res);
}
