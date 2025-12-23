import env from 'dotenv';

env.config();

// Bot role names
export const BOT_MASTER_ROLE_NAME = process.env.BOT_MASTER_ROLE_NAME || 'UP | Bot Master';
export const GBAN_ROLE_NAME = process.env.GBAN_ROLE_NAME || 'UP | Global Ban Permission';

// Discord bot tokens and client IDs
export const TOKEN = process.env.PRIMARY_DISCORD_TOKEN || '';
export const CLIENT_ID = process.env.CLIENT_ID || '';

// Testing bot tokens and client IDs
export const TESTING_BOT_TOKEN = process.env.SECONDARY_DISCORD_TOKEN || '';
export const TESTING_CLIENT_ID = process.env.TESTING_CLIENT_ID || '';
export const TESTING_APPLICATION_ID = process.env.TESTING_APPLICATION_ID || '';

// Channel IDs to filter messages
