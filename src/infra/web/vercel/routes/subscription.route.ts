import { VercelRequest, VercelResponse } from "@vercel/node";
import { CorsMiddleware } from "../middlewares/cors.middleware.js";
import { BusinessError } from "../../../../domain/errors/BusinessError.js";
import { Logger } from "../../../logger/pino.logger.js";
import { ValidateTokenMiddleware } from "../middlewares/validate-token.middleware.js";
import { GetSubscribedChannelsUseCase } from "../../../../domain/usecases/get-subscribed-channels.js";
import { GetLatestVideosFromChannelUseCase } from "../../../../domain/usecases/get-latest-videos-from-channel.js";

export class SubscriptionRoutes {
  constructor(
    private readonly getSubscribedChannelsUseCase: GetSubscribedChannelsUseCase,
    private readonly getLatestVideosFromChannelUseCase: GetLatestVideosFromChannelUseCase,
  ) {}

  private logger = Logger.getLogger()

  async getChannels(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (CorsMiddleware.apply(req, res)) return;
    if (ValidateTokenMiddleware.validate(req, res)) return;

    if (req.method !== 'GET') {
      res.status(405).json({ message: 'Method not allowed!' });
      return;
    }

    try {
      const sessionId = req.headers['uuid'] as string;
      const response = await this.getSubscribedChannelsUseCase.execute(sessionId);

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

  async getLatestVideosFromChannel(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (CorsMiddleware.apply(req, res)) return;
    if (ValidateTokenMiddleware.validate(req, res)) return;

    if (req.method !== 'GET') {
      res.status(405).json({ message: 'Method not allowed!' });
      return;
    }

    try {
      const sessionId = req.headers['uuid'] as string;
      const channelId = typeof req.query.id === 'string' ? req.query.id : Array.isArray(req.query.id) ? req.query.id[0] : '';
      const response = await this.getLatestVideosFromChannelUseCase.execute(sessionId, channelId);

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
