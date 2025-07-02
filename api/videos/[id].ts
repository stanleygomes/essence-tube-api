import '../../src/infra/web/vercel/providers/dependencies.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { videoRoutes } from '../../src/infra/web/vercel/providers/dependencies.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  videoRoutes.getVideo(req, res);
}
