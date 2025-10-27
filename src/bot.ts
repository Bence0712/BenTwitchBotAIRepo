import tmi from 'tmi.js';
import type { BotConfig } from './types/index.js';
import { CommandHandler } from './commandHandler.js';
import { logger } from './utils/logger.js';

export class TwitchBot {
  private client: tmi.Client;
  private config: BotConfig;
  private commandHandler: CommandHandler;
  private startTime: Date;

  constructor(config: BotConfig) {
    this.config = config;
    this.commandHandler = new CommandHandler();
    this.startTime = new Date();

    this.client = new tmi.Client({
      options: { debug: process.env.DEBUG === 'true' },
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: config.username,
        password: config.oauth,
      },
      channels: config.channels,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connected', (address, port) => {
      logger.success(`Connected to ${address}:${port}`);
      logger.info(`Joining channels: ${this.config.channels.join(', ')}`);
    });

    this.client.on('disconnected', (reason) => {
      logger.warn(`Disconnected: ${reason}`);
    });

    this.client.on('join', (channel, username, self) => {
      if (self) {
        logger.success(`Joined channel: ${channel}`);
      }
    });

    this.client.on('message', async (channel, user, message, self) => {
      if (self) return;

      logger.debug(`[${channel}] ${user.username}: ${message}`);

      await this.commandHandler.handle(
        channel,
        user,
        message,
        this.config.commandPrefix,
        this
      );
    });

    this.client.on('error', (error) => {
      logger.error('Client error:', error);
    });
  }

  getCommandHandler(): CommandHandler {
    return this.commandHandler;
  }

  getClient(): tmi.Client {
    return this.client;
  }

  getStartTime(): Date {
    return this.startTime;
  }

  async say(channel: string, message: string): Promise<void> {
    try {
      await this.client.say(channel, message);
      logger.debug(`[${channel}] Bot: ${message}`);
    } catch (error) {
      logger.error(`Failed to send message to ${channel}:`, error);
    }
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      logger.info('Disconnected from Twitch');
    } catch (error) {
      logger.error('Failed to disconnect:', error);
      throw error;
    }
  }
}
