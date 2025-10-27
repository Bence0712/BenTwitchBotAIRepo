import readline from 'readline';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SetupConfig {
  username: string;
  oauth: string;
  channels: string;
  prefix: string;
  debug: string;
}

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function question(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function displayWelcome(): void {
  console.log('\n========================================');
  console.log('   🤖 Twitch Bot Setup Wizard');
  console.log('========================================\n');
  console.log('Welcome! This wizard will help you configure your Twitch bot.\n');
}

function displayInstructions(): void {
  console.log('You will need:');
  console.log('  1. A Twitch account for the bot');
  console.log('  2. An OAuth token (we\'ll help you get one)\n');
}

function displayOAuthInstructions(): void {
  console.log('\n📝 Getting your OAuth token:');
  console.log('  1. Visit: https://twitchapps.com/tmi/');
  console.log('  2. Click "Connect" and authorize');
  console.log('  3. Copy the token (starts with "oauth:")');
  console.log('  4. Paste it below\n');
}

async function promptForConfig(rl: readline.Interface): Promise<SetupConfig> {
  // Username
  const username = await question(
    rl,
    'Enter your bot\'s Twitch username: '
  );

  if (!username.trim()) {
    console.log('❌ Username cannot be empty!');
    process.exit(1);
  }

  // OAuth token
  displayOAuthInstructions();
  let oauth = await question(rl, 'Enter your OAuth token: ');

  if (!oauth.trim()) {
    console.log('❌ OAuth token cannot be empty!');
    process.exit(1);
  }

  // Ensure oauth starts with 'oauth:'
  if (!oauth.startsWith('oauth:')) {
    oauth = 'oauth:' + oauth;
  }

  // Channels
  console.log('\n📺 Channels to join:');
  console.log('  (Enter channel names separated by commas)');
  console.log('  Example: mychannel,otherchannel\n');

  const channels = await question(rl, 'Enter channel(s): ');

  if (!channels.trim()) {
    console.log('❌ At least one channel is required!');
    process.exit(1);
  }

  // Command prefix
  const prefixInput = await question(
    rl,
    '\nCommand prefix (default: !): '
  );
  const prefix = prefixInput.trim() || '!';

  // Debug mode
  const debugInput = await question(
    rl,
    'Enable debug mode? (y/N): '
  );
  const debug = debugInput.toLowerCase() === 'y' ? 'true' : 'false';

  return {
    username: username.trim(),
    oauth: oauth.trim(),
    channels: channels.trim(),
    prefix,
    debug,
  };
}

function generateEnvContent(config: SetupConfig): string {
  return `# Twitch Bot Configuration
# Generated on ${new Date().toISOString()}

# Your Twitch username (the bot account)
TWITCH_USERNAME=${config.username}

# OAuth token for authentication
# Get yours at: https://twitchapps.com/tmi/
TWITCH_OAUTH=${config.oauth}

# Comma-separated list of channels to join
TWITCH_CHANNELS=${config.channels}

# Command prefix
COMMAND_PREFIX=${config.prefix}

# Enable debug logging (true/false)
DEBUG=${config.debug}
`;
}

async function saveEnvFile(content: string): Promise<void> {
  const envPath = path.join(__dirname, '..', '.env');
  await fs.writeFile(envPath, content, 'utf-8');
}

function displaySuccess(config: SetupConfig): void {
  console.log('\n✅ Configuration saved successfully!\n');
  console.log('Your bot is configured with:');
  console.log(`  Username: ${config.username}`);
  console.log(`  Channels: ${config.channels}`);
  console.log(`  Prefix: ${config.prefix}`);
  console.log(`  Debug: ${config.debug}\n`);
  console.log('🚀 You can now start your bot with: npm run dev\n');
}

export async function runSetup(): Promise<void> {
  const rl = createReadlineInterface();

  try {
    displayWelcome();
    displayInstructions();

    const config = await promptForConfig(rl);
    const envContent = generateEnvContent(config);

    await saveEnvFile(envContent);
    displaySuccess(config);
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

export async function checkEnvExists(): Promise<boolean> {
  const envPath = path.join(__dirname, '..', '.env');
  try {
    await fs.access(envPath);
    return true;
  } catch {
    return false;
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSetup();
}
