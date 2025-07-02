import 'dotenv/config';
import Fastify, { FastifyInstance } from 'fastify';

import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

import { AppRouter } from './router.js';
import { Logger } from '../../logger/pino.logger.js';
import { config } from '../../config/index.js';

import pkg from '../../../../package.json' with { type: "json" };

export class AppServer {
  private fastify: FastifyInstance;
  private logger = Logger.getLogger();

  constructor() {
    this.fastify = Fastify();

    this.fastify.register(swagger, {
      openapi: {
        info: {
          title: pkg.name,
          description: pkg.description,
          version: pkg.version,
        },
      },
    });

    this.fastify.register(swaggerUI, {
      routePrefix: config.app.docs.path,
    });

    const router = new AppRouter();
    router.register(this.fastify, config.app.server.path);
  }

  private getPort(): number {
    return config.app.server.port ? Number(config.app.server.port) : 3000;
  }

  public start() {
    const port = this.getPort();
    const { url, path } = config.app.server;

    this.fastify.listen({ port }, (err) => {
      if (err) {
        throw err;
      }

      this.logger.info(`Fastify server running on ${url}:${port}${path}`);
      this.logger.info(`Swagger docs available at ${url}:${port}/docs`);
    });
  }
}

new AppServer().start();
