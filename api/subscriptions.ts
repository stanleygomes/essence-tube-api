import '../src/infra/web/vercel/providers/dependencies.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { subscriptionRoutes } from '../src/infra/web/vercel/providers/dependencies.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  subscriptionRoutes.getChannels(req, res);
}
