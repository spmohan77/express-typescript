import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: { service: 'interview-api' },
});

/** Child logger tagged with the component name. */
export function createServiceLogger(component: string) {
  return logger.child({ component });
}

export { logger };
