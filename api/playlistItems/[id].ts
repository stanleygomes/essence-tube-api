import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../src/utils/logger.js';
import { removePlaylistVideo } from '../../src/usecases/playlistUseCase.js';
import { BusinessError } from '../../src/domain/errors/BusinessError.js';
import { applyCors } from '../../src/utils/cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (applyCors(req, res)) return;

  if (req.method !== 'DELETE') {
    res.status(405).json({ message: 'Method not allowed!' });
    return;
  }

  try {
    const sessionId = req.headers['uuid'] as string | undefined;
    const playlistId = typeof req.query.id === 'string' ? req.query.id : Array.isArray(req.query.id) ? req.query.id[0] : undefined;
    const response = await removePlaylistVideo(sessionId ?? '', playlistId ?? '');
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
