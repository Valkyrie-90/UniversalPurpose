import { Events } from 'discord.js';
import type { Message } from 'discord.js';

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        // ignore bot messages
        if (message.author.bot) return;

        console.log(`Message from ${message.author.username}: ${message.content}`);
    },
} as const;