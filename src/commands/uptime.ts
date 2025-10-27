import type { Command } from '../types/index.js';
import type { TwitchBot } from '../bot.js';

export const uptimeCommand: Command = {
  name: 'uptime',
  description: 'Show how long the bot has been running',
  cooldown: 10,
  async execute(channel, user, args, bot: TwitchBot) {
    const startTime = bot.getStartTime();
    const uptime = Date.now() - startTime.getTime();

    const seconds = Math.floor((uptime / 1000) % 60);
    const minutes = Math.floor((uptime / (1000 * 60)) % 60);
    const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

    let uptimeStr = '';
    if (days > 0) uptimeStr += `${days}d `;
    if (hours > 0) uptimeStr += `${hours}h `;
    if (minutes > 0) uptimeStr += `${minutes}m `;
    uptimeStr += `${seconds}s`;

    await bot.say(channel, `@${user.username} Bot uptime: ${uptimeStr}`);
  },
};
