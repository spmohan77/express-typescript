import express from 'express';
import usersRouter from './routes/users.routes';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.send('ok');
  });

  app.use('/api/v1/users', usersRouter);

  return app;
}
