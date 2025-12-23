import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('8ball').setDescription('Test your luck with the magic 8ball!').addStringOption(option => option.setName('question').setDescription('The question you want to ask the magic 8ball').setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const responses = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes – definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful."
        ];

        await interaction.reply(
            responses[Math.floor(Math.random() * responses.length)]
        ).catch(console.error);
    }
};
