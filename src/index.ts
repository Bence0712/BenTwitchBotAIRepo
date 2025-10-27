import { TwitchBot } from './bot.js';
import { getConfig } from './config.js';
import { defaultCommands } from './commands/index.js';
import { logger } from './utils/logger.js';

async function main() {
  try {
    logger.info('Starting Twitch Bot...');

    const config = getConfig();
    const bot = new TwitchBot(config);

    // Register default commands
    bot.getCommandHandler().registerMultiple(defaultCommands);

    // Connect to Twitch
    await bot.connect();

    logger.success('Bot is running!');
    logger.info(`Command prefix: ${config.commandPrefix}`);
    logger.info(`Channels: ${config.channels.join(', ')}`);

    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down...');
      await bot.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

main();
