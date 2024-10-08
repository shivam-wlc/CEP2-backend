/* eslint-disable */
import chalk from 'chalk';
import { createHttpTerminator } from 'http-terminator';
import config from '##/src/config/config.js';
import * as express from '##/src/config/lib/express.js';
import * as mongooseLib from '##/src/config/lib/mongoose.js';

// import * as redis from '##/config/lib/redis.js';

async function init() {
  await mongooseLib.connect();

  // Initialize express
  const app = await express.init();

  return app;
}

function listen(app, port) {
  const server = app.listen(port);

  return server;
}

async function start() {
  const app = await init();

  // Start the app by listening on <port>
  const server = await listen(app, config.port);

  // Create server URL
  const serverUrl = new URL('http://dummy');
  serverUrl.hostname = config.host;
  serverUrl.port = config.port;

  // Logging initialization
  console.log('--');
  console.log(chalk.green(config.app.title));
  console.log();
  console.log(chalk.green(`Environment:     ${config.env}`));
  console.log(chalk.green(`Server:          ${serverUrl}`));
  if (config.env === 'development') {
    console.log(chalk.green(`Database:        ${config.db}`));
    console.log(chalk.green(`Redis:           ${config.redis.url} (DB ${config.redis.db})`));
  }
  console.log(chalk.green(`App version:     ${config.package.version}`));
  console.log('--');

  //   await redis.openConnection();

  registerShutdownHandlers(server);
}

function registerShutdownHandlers(server) {
  const httpTerminator = createHttpTerminator({ server });
  let shuttingDown = false;

  const stopServer = async () => {
    // It's possible that the process receives multiple shut down signals
    // In which case we want to shut down just once
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;

    try {
      console.log(chalk.yellow('Closing HTTP server'));
      await Promise.all([
        httpTerminator.terminate(),
        mongooseLib.disconnect(),
        // redis.closeConnection(),
      ]);
      console.log(chalk.yellow('HTTP server closed'));
      process.exit();
    } catch (error) {
      console.error(error);
    }
  };

  // When the process is terminated (e.g. kill)
  process.on('SIGTERM', stopServer);
  // When the process is interrupted (e.g. ctrl+c)
  process.on('SIGINT', stopServer);
}

export { start };
