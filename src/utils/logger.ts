import pino from 'pino';

const pinoInstance = typeof pino === 'function' ? pino : (pino as any).default;

export const logger = pinoInstance({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty' }
      : undefined,
});
