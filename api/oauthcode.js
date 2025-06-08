import { logger } from '../src/utils/logger.js';
import { buildUrlRedirectBack, getAndSaveToken } from '../src/usecases/authUseCase.js'
import { BusinessError } from '../src/errors/BusinessError.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed!' });
  }

  try {
    const { code } = req.query;
    const uuid = await getAndSaveToken(code);
    const redirectUrl = buildUrlRedirectBack(uuid);
        
    return res.redirect(302, redirectUrl);
  } catch (error) {
    logger.error(error);

    if (error instanceof BusinessError) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error!', error: error.message });
  }
}
