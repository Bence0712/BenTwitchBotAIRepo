# BenTwitchBotAI

A modern, TypeScript-based Twitch chat bot with extensible command system and modern development practices.

## Features

- **TypeScript** - Full type safety and modern JavaScript features
- **Modular Architecture** - Easy to extend with custom commands
- **Command System** - Built-in command handler with cooldowns and aliases
- **Modern Tooling** - ESLint, Prettier, and ES modules
- **Error Handling** - Robust error handling and logging
- **Auto-Reconnect** - Automatic reconnection on connection loss

## Built-in Commands

- `!ping` - Check if the bot is responsive
- `!uptime` - Show how long the bot has been running
- `!commands` (aliases: `!help`, `!cmds`) - List all available commands
- `!dice [sides]` (alias: `!roll`) - Roll a dice with optional custom sides (default: 6)
- `!echo <message>` - Repeat a message

## Prerequisites

- Node.js 18+
- npm or yarn
- A Twitch account for the bot

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BenTwitchBotAIRepo
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your credentials:
   - Get your OAuth token from https://twitchapps.com/tmi/
   - Set your bot's username and channels to join

## Configuration

Edit the `.env` file:

```env
TWITCH_USERNAME=your_bot_username
TWITCH_OAUTH=oauth:your_oauth_token_here
TWITCH_CHANNELS=channel1,channel2
COMMAND_PREFIX=!
DEBUG=false
```

### Getting Your OAuth Token

1. Visit https://twitchapps.com/tmi/
2. Click "Connect"
3. Authorize the application
4. Copy the OAuth token (it will start with `oauth:`)
5. Paste it into your `.env` file

## Usage

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

Build the project:
```bash
npm run build
```

Start the bot:
```bash
npm start
```

### Code Quality

Run linter:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## Creating Custom Commands

Create a new file in `src/commands/` directory:

```typescript
import type { Command } from '../types/index.js';
import type { TwitchBot } from '../bot.js';

export const myCommand: Command = {
  name: 'mycommand',
  aliases: ['mc', 'mycmd'],
  description: 'Description of my command',
  usage: '!mycommand <args>',
  cooldown: 5, // seconds
  async execute(channel, user, args, bot: TwitchBot) {
    await bot.say(channel, `Hello @${user.username}!`);
  },
};
```

Then register it in `src/index.ts`:

```typescript
import { myCommand } from './commands/mycommand.js';

// Add to the registration
bot.getCommandHandler().register(myCommand);
```

## Project Structure

```
BenTwitchBotAIRepo/
├── src/
│   ├── commands/          # Command implementations
│   │   ├── ping.ts
│   │   ├── uptime.ts
│   │   ├── commands.ts
│   │   ├── dice.ts
│   │   ├── echo.ts
│   │   └── index.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   └── logger.ts
│   ├── bot.ts             # Main bot class
│   ├── commandHandler.ts  # Command handling system
│   ├── config.ts          # Configuration loader
│   └── index.ts           # Application entry point
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- [tmi.js](https://github.com/tmijs/tmi.js) - Twitch messaging interface
- [TypeScript](https://www.typescriptlang.org/) - Type safety and modern JavaScript
- [dotenv](https://github.com/motdotla/dotenv) - Environment variable management
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Troubleshooting

### Bot doesn't connect
- Verify your OAuth token is correct and starts with `oauth:`
- Check that your username matches the account that generated the OAuth token
- Ensure the channels you're trying to join exist

### Commands not working
- Verify the command prefix in your `.env` file
- Check that the bot has successfully joined the channel
- Enable DEBUG mode to see detailed logs

### Permission errors
- Ensure your bot account has appropriate permissions in the channels
- Some channels may require the bot to be a moderator for certain actions