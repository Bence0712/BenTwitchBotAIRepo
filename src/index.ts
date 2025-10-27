import { TwitchBot } from './bot.js';
import { getConfig } from './config.js';
import { defaultCommands } from './commands/index.js';
import { logger } from './utils/logger.js';
import { checkEnvExists, runSetup } from './setup.js';

async function main() {
  try {
    // Check if .env exists, if not run setup
    const envExists = await checkEnvExists();
    if (!envExists) {
      logger.info('No configuration found. Running setup wizard...\n');
      await runSetup();
      console.log('\nStarting bot with new configuration...\n');
    }

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
