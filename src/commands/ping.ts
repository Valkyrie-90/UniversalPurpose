import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    async execute(interaction: ChatInputCommandInteraction) {
        const responses = [
            `${Math.round(interaction.client.ws.ping)}ms`,
            "pong!"
        ];

        await interaction.reply(
            responses[Math.floor(Math.random() * responses.length)]
        ).catch(console.error);
    }
};
