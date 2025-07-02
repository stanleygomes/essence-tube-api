import '../src/infra/web/vercel/providers/dependencies.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authRoutes } from '../src/infra/web/vercel/providers/dependencies.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  await authRoutes.getUrlRedirectBack(req, res)
}
