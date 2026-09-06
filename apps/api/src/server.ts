import { env } from './config/env.js';
import app from './app.js';

const HOST = '0.0.0.0';

app.listen(env.PORT, HOST, () => {
  console.log(`🚀 SETU Backend Server running on http://${HOST}:${env.PORT}`);
  console.log(`📌 Environment: ${env.NODE_ENV}`);
});
