import { Client, GatewayIntentBits, Collection, ApplicationCommandData } from "discord.js";
import { loadCommands } from "./utils/loadCommands";
import { registerEvents } from "./utils/registerEvents";
import { main as deployCommands } from "./utils/deployCommands";
import { TESTING_BOT_TOKEN } from "./config";

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

// Load commands and register events
await loadCommands(client);
await deployCommands();
registerEvents(client);

// Log in to Discord with the bot token
client.login(TESTING_BOT_TOKEN);

export default client;
export { Command };