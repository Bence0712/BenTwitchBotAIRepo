import type { ChatUserstate } from 'tmi.js';

export interface BotConfig {
  username: string;
  oauth: string;
  channels: string[];
  commandPrefix: string;
}

export interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  cooldown?: number;
  execute: (
    channel: string,
    user: ChatUserstate,
    args: string[],
    bot: any
  ) => Promise<void> | void;
}

export interface CommandContext {
  channel: string;
  user: ChatUserstate;
  args: string[];
  fullMessage: string;
}
