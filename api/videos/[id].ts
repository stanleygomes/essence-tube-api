import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../src/utils/logger.js';
import { getVideo } from '../../src/usecases/videoUseCase.js';
import { BusinessError } from '../../src/domain/errors/BusinessError.js';
import { applyCors } from '../../src/utils/cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (applyCors(req, res)) return;

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed!' });
    return;
  }

  try {
    const sessionId = req.headers['uuid'] as string | undefined;
    const videoId = typeof req.query.id === 'string' ? req.query.id : Array.isArray(req.query.id) ? req.query.id[0] : undefined;
    const response = await getVideo(sessionId ?? '', videoId ?? '');
    res.status(200).json(response);
  } catch (error: any) {
    logger.error(error);

    if (error instanceof BusinessError) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
}
