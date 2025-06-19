import { VercelRequest, VercelResponse } from "@vercel/node";
import { BusinessError } from "../../../../domain/errors/BusinessError.js";
import { Logger } from "../../../logger/pino.logger.js";
import { GetVideosFromPlaylistUseCase } from "../../../../domain/usecases/get-videos-from-playlist.js";
import { CorsMiddleware } from "../middlewares/cors.middleware.js";
import { ValidateTokenMiddleware } from "../middlewares/validate-token.middleware.js";
import { GetPlaylistsUseCase } from "../../../../domain/usecases/get-playlists.js";
import { AddVideoToPlaylistUseCase } from "../../../../domain/usecases/add-video-to-playlist.js";
import { RemoveVideoFromPlaylistUseCase } from "../../../../domain/usecases/remove-video-from-playlist.js";

export class PlaylistRoutes {
  constructor(
    private readonly getVideosFromPlaylistUseCase: GetVideosFromPlaylistUseCase,
    private readonly getPlaylistsUseCase: GetPlaylistsUseCase,
    private readonly addVideoToPlaylistUseCase: AddVideoToPlaylistUseCase,
    private readonly removeVideoFromPlaylistUseCase: RemoveVideoFromPlaylistUseCase,
  ) {}

  private logger = Logger.getLogger();

  async getVideosFromPlaylist(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (CorsMiddleware.apply(req, res)) return;
    if (ValidateTokenMiddleware.validate(req, res)) return;

    if (req.method !== 'GET') {
      res.status(405).json({ message: 'Method not allowed!' });
      return;
    }

    try {
      const sessionId = req.headers['uuid'] as string | undefined;
      const playlistId = typeof req.query.id === 'string' ? req.query.id : Array.isArray(req.query.id) ? req.query.id[0] : undefined;
      const response = await this.getVideosFromPlaylistUseCase.execute(sessionId ?? '', playlistId ?? '');

      res.status(200).json(response);
    } catch (error: any) {
      this.logger.error(error);
  
      if (error instanceof BusinessError) {
        res.status(400).json({ message: error.message });
        return;
      }
  
      res.status(500).json({ message: 'Internal server error!', error: error.message });
    }
  }

  async getPlaylists(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (CorsMiddleware.apply(req, res)) return;
    if (ValidateTokenMiddleware.validate(req, res)) return;

    if (req.method !== 'GET') {
      res.status(405).json({ message: 'Method not allowed!' });
      return;
    }

    try {
      const sessionId = req.headers['uuid'] as string;
      const response = await this.getPlaylistsUseCase.execute(sessionId);

      res.status(200).json(response);
    } catch (error: any) {
      this.logger.error(error);
  
      if (error instanceof BusinessError) {
        res.status(400).json({ message: error.message });
        return;
      }
  
      res.status(500).json({ message: 'Internal server error!', error: error.message });
    }
  }

  async addPlaylistVideo(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (CorsMiddleware.apply(req, res)) return;
    if (ValidateTokenMiddleware.validate(req, res)) return;

    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed!' });
      return;
    }

    try {
      const sessionId = req.headers['uuid'] as string;
      const playlistId = typeof req.query.playlistId === 'string' ? req.query.playlistId : Array.isArray(req.query.playlistId) ? req.query.playlistId[0] : '';
      const videoId = typeof req.query.videoId === 'string' ? req.query.videoId : Array.isArray(req.query.videoId) ? req.query.videoId[0] : '';
      const response = await this.addVideoToPlaylistUseCase.execute(sessionId, playlistId, videoId);

      res.status(200).json(response);
    } catch (error: any) {
      this.logger.error(error);
  
      if (error instanceof BusinessError) {
        res.status(400).json({ message: error.message });
        return;
      }
  
      res.status(500).json({ message: 'Internal server error!', error: error.message });
    }
  }

  async removePlaylistVideo(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (CorsMiddleware.apply(req, res)) return;
    if (ValidateTokenMiddleware.validate(req, res)) return;

    if (req.method !== 'DELETE') {
      res.status(405).json({ message: 'Method not allowed!' });
      return;
    }

    try {
      const sessionId = req.headers['uuid'] as string;
      const playlistId = this.getQueryId(req);
      await this.removeVideoFromPlaylistUseCase.execute(sessionId, playlistId);

      res.status(200).json("OK");
    } catch (error: any) {
      this.logger.error(error);
  
      if (error instanceof BusinessError) {
        res.status(400).json({ message: error.message });
        return;
      }
  
      res.status(500).json({ message: 'Internal server error!', error: error.message });
    }
  }

  private getQueryId(req: VercelRequest): string | undefined {
    if (typeof req.query.id === 'string') {
      return req.query.id;
    }
    
    if (Array.isArray(req.query.id)) {
      return req.query.id[0]
    }

    return undefined;
  }
}
