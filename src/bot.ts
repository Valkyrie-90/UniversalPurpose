import { GatewayIntentBits } from "discord.js";
import { CustomClient } from "@up/main/types";
import { registerEvents } from "@up/main/utils/helpers/registerEvents";
import { deployCommands } from "@up/main/utils/commands/deployCommands";
import { registerCommands } from "@up/main/utils/commands/registerCommands";
import { loadFlaggedTerms } from '@up/main/utils/helpers/loadFlaggedTerms';
import { registerButtons } from "@up/main/utils/helpers/registerButtons";
import { registerModals } from "@up/main/utils/helpers/registerModals";
import { defaultConfig } from "@up/main/config";


// Define and export the Discord client
const client = new CustomClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
});

// Load commands and register events
await registerCommands(client);
await deployCommands();
await registerEvents(client);
await registerButtons(client);
await registerModals(client);

// Load flagged terms from storage
const flaggedTerms = loadFlaggedTerms();

// Log in to Discord with the bot token
await client.login(defaultConfig.token);

export default client;
export { flaggedTerms };

