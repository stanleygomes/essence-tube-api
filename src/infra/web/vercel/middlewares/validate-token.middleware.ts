import { config } from "../../../config/index.js";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export class ValidateTokenMiddleware {
  static validate(req: VercelRequest, res: VercelResponse): boolean {
    const sessionId = req.headers['uuid'] as string | undefined;


    if (!sessionId) {
      res.status(401).send("Not authorized!")
    }

    return false;
  }

  static isPreflight(req: VercelRequest): boolean {
    return req.method === "OPTIONS";
  }
}
