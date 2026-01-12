import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { isBotMaster } from '../permissions/botMaster'
import { createNoPermsEmbed } from '../utils/embeds';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Send a message as the bot!')
        .addStringOption(option => option
            .setName('message')
            .setDescription('The message to send').setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isBotMaster(interaction, interaction.user.id)) {
            const noPermsEmbed = createNoPermsEmbed(interaction);
            await interaction.reply({ embeds: [noPermsEmbed], flags: MessageFlags.Ephemeral });
            return;
        }

        const message = interaction.options.getString('message', true);

        if (interaction.channel && 'send' in interaction.channel) {
            await interaction.channel.send(message).catch(console.error);
        }

        await interaction.reply(
            { content: "Message sent successfully!", flags: MessageFlags.Ephemeral }
        ).catch(console.error);
    }
};
