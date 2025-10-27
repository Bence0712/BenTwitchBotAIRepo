import type { Command } from '../types/index.js';
import type { TwitchBot } from '../bot.js';

export const echoCommand: Command = {
  name: 'echo',
  description: 'Repeat a message',
  usage: '!echo <message>',
  cooldown: 5,
  async execute(channel, user, args, bot: TwitchBot) {
    if (args.length === 0) {
      await bot.say(channel, `@${user.username} Usage: !echo <message>`);
      return;
    }

    const message = args.join(' ');
    await bot.say(channel, `@${user.username} ${message}`);
  },
};
