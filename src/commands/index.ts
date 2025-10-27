import { pingCommand } from './ping.js';
import { uptimeCommand } from './uptime.js';
import { commandsCommand } from './commands.js';
import { diceCommand } from './dice.js';
import { echoCommand } from './echo.js';

export const defaultCommands = [
  pingCommand,
  uptimeCommand,
  commandsCommand,
  diceCommand,
  echoCommand,
];
