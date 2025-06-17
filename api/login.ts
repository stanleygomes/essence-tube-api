import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getUrlConsent } from '../src/usecases/authUseCase.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed!' });
    return;
  }

  const redirectUrl = getUrlConsent();
  res.redirect(302, redirectUrl);
}
