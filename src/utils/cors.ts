import { config } from "../config/config.js";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export function applyCors(req: VercelRequest, res: VercelResponse): boolean {
  const allowedOrigin = config.app.cors.allowedOrigin;

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,uuid");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return false;
}
