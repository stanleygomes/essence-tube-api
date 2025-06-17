import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../../../src/utils/logger.js';
import { BusinessError } from '../../../../src/domain/errors/BusinessError.js';
import { applyCors } from '../../../../src/utils/cors.js';
import { addPlaylistVideo } from '../../../../src/usecases/playlistUseCase.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed!' });
    return;
  }

  try {
    const sessionId = req.headers['uuid'] as string | undefined;
    const playlistId = typeof req.query.playlistId === 'string' ? req.query.playlistId : Array.isArray(req.query.playlistId) ? req.query.playlistId[0] : undefined;
    const videoId = typeof req.query.videoId === 'string' ? req.query.videoId : Array.isArray(req.query.videoId) ? req.query.videoId[0] : undefined;
    const response = await addPlaylistVideo(sessionId ?? '', playlistId ?? '', videoId ?? '');
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
