import dotenv from 'dotenv';
import type { BotConfig } from './types/index.js';

dotenv.config();

export function getConfig(): BotConfig {
  const username = process.env.TWITCH_USERNAME;
  const oauth = process.env.TWITCH_OAUTH;
  const channels = process.env.TWITCH_CHANNELS?.split(',').map((c) => c.trim()) || [];
  const commandPrefix = process.env.COMMAND_PREFIX || '!';

  if (!username || !oauth) {
    throw new Error('Missing required environment variables: TWITCH_USERNAME and TWITCH_OAUTH');
  }

  if (channels.length === 0) {
    throw new Error('No channels specified in TWITCH_CHANNELS');
  }

  return {
    username,
    oauth,
    channels,
    commandPrefix,
  };
}
