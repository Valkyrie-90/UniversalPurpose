import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('bonk')
        .setDescription('Bonk a user!')
        .addMentionableOption(option =>
            option.setName('user').setDescription('The user to bonk').setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getMentionable('user');
        
        const response = `${user} gets bonked by ${interaction.user}! https://tenor.com/view/bonk-doge-gif-24837098`;

        await interaction.reply(
            response
        ).catch(console.error);
    }
};
