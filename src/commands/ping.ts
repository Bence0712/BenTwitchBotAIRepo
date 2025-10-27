import type { Command } from '../types/index.js';
import type { TwitchBot } from '../bot.js';

export const pingCommand: Command = {
  name: 'ping',
  description: 'Check if the bot is responsive',
  cooldown: 5,
  async execute(channel, user, args, bot: TwitchBot) {
    await bot.say(channel, `@${user.username} Pong!`);
  },
};
