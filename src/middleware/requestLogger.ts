import { Env } from 'hono';
import { createMiddleware } from 'hono/factory';

import logger from '@/services/log.service';

const requestLogger = createMiddleware<Env, string>(async (ctx, next) => {
  const start = Date.now();
  await next();
  const latency = Date.now() - start;
  logger.http(
    `${ctx.req.method} ${ctx.req.path} - ${ctx.res.status} - ${latency}ms`,
    { host: ctx.req.raw.headers.toJSON() || '' }
  );
});

export default requestLogger;
