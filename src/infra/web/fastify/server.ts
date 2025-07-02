import 'dotenv/config';
import Fastify, { FastifyInstance } from 'fastify';
import { AppRouter } from './router.js';
import { Logger } from '../../logger/pino.logger.js';
import { config } from '../../config/index.js'

export class AppServer {
  private fastify: FastifyInstance;
  private logger = Logger.getLogger();

  constructor() {
    this.fastify = Fastify();

    const router = new AppRouter();
    router.register(this.fastify, config.app.server.path);
  }

  private getPort(): number {
    return config.app.server.port ? Number(config.app.server.port) : 3000;
  }

  public start() {
    const port = this.getPort();
    const { url, path  } = config.app.server;

    this.fastify.listen({ port }, (err) => {
      if (err) {
        throw err;
      }

      this.logger.info(`Fastify server running on ${url}:${port}${path}`);
    });
  }
}

new AppServer().start();
