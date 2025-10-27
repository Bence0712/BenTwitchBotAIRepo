import type { Command } from '../types/index.js';
import type { TwitchBot } from '../bot.js';

export const commandsCommand: Command = {
  name: 'commands',
  aliases: ['help', 'cmds'],
  description: 'List all available commands',
  cooldown: 15,
  async execute(channel, user, args, bot: TwitchBot) {
    const commands = bot.getCommandHandler().getCommands();
    const commandNames = commands.map((cmd) => cmd.name).join(', ');
    await bot.say(channel, `@${user.username} Available commands: ${commandNames}`);
  },
};
