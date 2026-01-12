import { Client, Events, ActivityType } from 'discord.js';
import { presenceHandler } from '../utils/prescenceHandler';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        console.log(`Ready! Logged in as ${client.user?.tag}`);

        // Start the presence handler
        void presenceHandler(client).catch(console.error);
    },
};