import type { Command } from '../types/index.js';
import type { TwitchBot } from '../bot.js';

export const diceCommand: Command = {
  name: 'dice',
  aliases: ['roll'],
  description: 'Roll a dice (1-6) or specify sides',
  usage: '!dice [sides]',
  cooldown: 3,
  async execute(channel, user, args, bot: TwitchBot) {
    const sides = args.length > 0 ? parseInt(args[0]) : 6;

    if (isNaN(sides) || sides < 2 || sides > 100) {
      await bot.say(channel, `@${user.username} Please provide a valid number between 2 and 100`);
      return;
    }

    const result = Math.floor(Math.random() * sides) + 1;
    await bot.say(channel, `@${user.username} rolled a ${result} (1-${sides})`);
  },
};
