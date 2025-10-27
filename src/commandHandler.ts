import type { ChatUserstate } from 'tmi.js';
import type { Command } from './types/index.js';
import { logger } from './utils/logger.js';

export class CommandHandler {
  private commands = new Map<string, Command>();
  private cooldowns = new Map<string, Map<string, number>>();

  register(command: Command): void {
    this.commands.set(command.name.toLowerCase(), command);

    if (command.aliases) {
      command.aliases.forEach((alias) => {
        this.commands.set(alias.toLowerCase(), command);
      });
    }

    logger.info(`Registered command: ${command.name}`);
  }

  registerMultiple(commands: Command[]): void {
    commands.forEach((cmd) => this.register(cmd));
  }

  async handle(
    channel: string,
    user: ChatUserstate,
    message: string,
    commandPrefix: string,
    bot: any
  ): Promise<void> {
    if (!message.startsWith(commandPrefix)) return;

    const args = message.slice(commandPrefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = this.commands.get(commandName);
    if (!command) return;

    // Check cooldown
    if (command.cooldown) {
      const now = Date.now();
      const cooldownKey = `${command.name}:${user.username}`;

      if (!this.cooldowns.has(command.name)) {
        this.cooldowns.set(command.name, new Map());
      }

      const timestamps = this.cooldowns.get(command.name)!;
      const cooldownAmount = command.cooldown * 1000;

      if (timestamps.has(user.username || '')) {
        const expirationTime = timestamps.get(user.username || '')! + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = ((expirationTime - now) / 1000).toFixed(1);
          logger.debug(
            `${user.username} tried to use ${command.name} but it's on cooldown (${timeLeft}s left)`
          );
          return;
        }
      }

      timestamps.set(user.username || '', now);
      setTimeout(() => timestamps.delete(user.username || ''), cooldownAmount);
    }

    try {
      logger.debug(`Executing command: ${command.name} by ${user.username}`);
      await command.execute(channel, user, args, bot);
    } catch (error) {
      logger.error(`Error executing command ${command.name}:`, error);
    }
  }

  getCommands(): Command[] {
    const uniqueCommands = new Map<string, Command>();
    this.commands.forEach((cmd) => {
      uniqueCommands.set(cmd.name, cmd);
    });
    return Array.from(uniqueCommands.values());
  }
}
