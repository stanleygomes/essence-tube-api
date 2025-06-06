import { buildUrlConsent } from '../src/usecases/authUseCase'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed!' });
  }

  const redirectUrl = buildUrlConsent();
  return res.redirect(302, redirectUrl);
}
