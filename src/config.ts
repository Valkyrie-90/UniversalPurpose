import env from 'dotenv';

env.config();

// Bot role names
export const BOT_MASTER_ROLE_NAME = process.env.BOT_MASTER_ROLE_NAME
export const GBAN_ROLE_NAME = process.env.GBAN_ROLE_NAME

// Discord bot tokens and client IDs
const TOKEN = process.env.PRIMARY_DISCORD_TOKEN || '';
const CLIENT_ID = process.env.CLIENT_ID || '';
const APPLICATION_ID = process.env.APPLICATION_ID || '';

export const config = {
    token: TOKEN,
    applicationId: APPLICATION_ID,
    clientId: CLIENT_ID
};

// Testing bot tokens and client IDs
const TESTING_BOT_TOKEN = process.env.SECONDARY_DISCORD_TOKEN || '';
const TESTING_CLIENT_ID = process.env.TESTING_CLIENT_ID || '';
const TESTING_APPLICATION_ID = process.env.TESTING_APPLICATION_ID || '';

export const testingConfig = {
	token: TESTING_BOT_TOKEN,
	applicationId: TESTING_APPLICATION_ID,
    clientId: TESTING_CLIENT_ID
};
