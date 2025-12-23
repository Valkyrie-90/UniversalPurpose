import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { hasBanHammer } from '../permissions/globalBan';
import { createGlobalBanEmbed } from '../utils/embeds';
import type { ChatInputCommandInteraction, Client, Guild } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('globalban').setDescription('Ban a user from every UP-protected server.')
        .addStringOption(option => option.setName('userid').setDescription('The ID of the user to global ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the global ban').setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        // Check if the user has permission to use this command
        if (!hasBanHammer(interaction)) {
            // Create the no permission embed
            const noPermsEmbed = await import('../utils/embeds').then(module => module.createNoPermsEmbed(interaction));
            
            // Reply to the interaction
            await interaction.reply(
                { embeds: [noPermsEmbed], flags: MessageFlags.Ephemeral },
            ).catch(console.error);
            return;
        }

        // Get the client
        const client: Client = interaction.client;

        // Get the arguments
        const args: string[] = [
            interaction.options.getString('userid', true),
            interaction.options.getString('reason', true),
        ];

        // @ts-expect-error Fetch and ban the user from all guilds
        for (const guild of client.guilds.cache.values()) {
            const member = await guild.members.fetch(args[0]).catch(() => null);
            if (member) {
                await guild.bans.create(member.user.id, { reason: `Global ban issued by ${interaction.user.username} from ${interaction.guild?.name}.` }).catch(() => null);
            }
        }

        // Create the global ban embed
        const banEmbed = createGlobalBanEmbed(interaction, args);

        // Reply to the interaction
        await interaction.reply(
            { embeds: [banEmbed] }
        ).catch(console.error);
    }
};
