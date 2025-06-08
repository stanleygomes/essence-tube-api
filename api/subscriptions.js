import { logger } from '../src/utils/logger.js';
import { getChannels } from '../src/usecases/subscriptionUseCase.js';
import { BusinessError } from '../src/errors/BusinessError.js';
import { applyCors } from '../src/utils/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed!' });
  }

  try {
    const sessionId = req.headers['uuid'];
    const response = await getChannels(sessionId);
    return res.status(200).json(response);
  } catch (error) {
    logger.error(error);

    if (error instanceof BusinessError) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
}
