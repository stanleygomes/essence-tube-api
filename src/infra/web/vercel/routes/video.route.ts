import { VercelRequest, VercelResponse } from "@vercel/node";
import { CorsMiddleware } from "../middlewares/cors.middleware.js";
import { BusinessError } from "../../../../domain/errors/BusinessError.js";
import { Logger } from "../../../logger/pino.logger.js";
import { GetVideoUseCase } from "../../../../domain/usecases/get-video-use-case.js";
import { ValidateTokenMiddleware } from "../middlewares/validate-token.middleware.js";

export class VideoRoutes {
  constructor(private readonly getVideoUseCase: GetVideoUseCase) {}

  private logger = Logger.getLogger()

  async getVideo(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (CorsMiddleware.apply(req, res)) return;
    if (ValidateTokenMiddleware.validate(req, res)) return;

    if (req.method !== 'GET') {
      res.status(405).json({ message: 'Method not allowed!' });
      return;
    }

    try {
      const sessionId = req.headers['uuid'] as string | undefined;
      const videoId = typeof req.query.id === 'string' ? req.query.id : Array.isArray(req.query.id) ? req.query.id[0] : undefined;
      const response = await this.getVideoUseCase.execute(sessionId ?? '', videoId ?? '');
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
}
