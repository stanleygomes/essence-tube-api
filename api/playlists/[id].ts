import '../../src/infra/web/vercel/providers/dependencies.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { playlistRoutes } from '../../src/infra/web/vercel/providers/dependencies.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  playlistRoutes.getVideosFromPlaylist(req, res);
}
