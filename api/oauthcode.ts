import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../src/utils/logger.js';
import { buildUrlRedirectBack, getAndSaveToken } from '../src/usecases/authUseCase.js';
import { BusinessError } from '../src/domain/errors/BusinessError.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed!' });
    return;
  }

  try {
    const code = typeof req.query.code === 'string' ? req.query.code : Array.isArray(req.query.code) ? req.query.code[0] : undefined;
    if (!code) {
      res.status(400).json({ message: 'Missing code parameter.' });
      return;
    }

    const uuid = await getAndSaveToken(code);
    const redirectUrl = buildUrlRedirectBack(uuid);

    res.redirect(302, redirectUrl);
  } catch (error: any) {
    logger.error(error);

    if (error instanceof BusinessError) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
}
