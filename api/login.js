import { getUrlConsent } from '../src/usecases/authUseCase.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed!' });
  }

  const redirectUrl = getUrlConsent();
  return res.redirect(302, redirectUrl);
}
