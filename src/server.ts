import { createApp } from './app';
import { logger } from './utils/logger';

const PORT = Number(process.env.PORT || 3000);

if (!Number.isInteger(PORT) || PORT <= 0 || PORT > 65535) {
  throw new Error('PORT must be a valid TCP port');
}

const app = createApp();

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'server listening');
});
