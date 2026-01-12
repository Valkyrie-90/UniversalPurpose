import { Client, GatewayIntentBits, Collection, ApplicationCommandData } from "discord.js";
import { registerEvents } from "./utils/helpers/registerEvents";
import { deployCommands } from "./utils/commands/deployCommands";
import { registerCommands } from "./utils/commands/registerCommands";
import { loadFlaggedTerms } from './utils/helpers/loadFlaggedTerms';
import { registerButtons } from "./utils/helpers/registerButtons";
import { registerModals } from "./utils/helpers/registerModals";
import { testingConfig } from "./config";

// Define the command structure
interface Command {
    data: ApplicationCommandData;
    execute(message: any, args: string[]): void;
}

// Define and export the Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
});

// Initialize the commands collection
client.commands = new Collection();
client.buttons = new Collection();
client.events = new Collection();
client.modals = new Collection();

// Load commands and register events
await registerCommands(client);
await deployCommands();
await registerEvents(client);
await registerButtons(client);
await registerModals(client);

// Load flagged terms from storage
const flaggedTerms = loadFlaggedTerms();

// Log in to Discord with the bot token
await client.login(testingConfig.token);

export default client;
export { Command, flaggedTerms };

