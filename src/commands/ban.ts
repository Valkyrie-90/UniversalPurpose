import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { createBanEmbed } from '../utils/embeds';
import type { ChatInputCommandInteraction, Guild } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from this guild.')
        .addStringOption(option => option
            .setName('userid')
            .setDescription('The ID of the user to ban')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for the ban')
            .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        // Initialize noPermsEmbed variable
        let noPermsEmbed = undefined;

        // Check if the user has permission to use this command
        if (interaction.memberPermissions && !interaction.memberPermissions.has('BanMembers')) {
            if (noPermsEmbed === undefined) {
                // Create the no permission embed
                noPermsEmbed = await import('../utils/embeds').then(module => module.createNoPermsEmbed(interaction));
            }

            // Reply to the interaction
            await interaction.reply(
                { embeds: [noPermsEmbed], flags: MessageFlags.Ephemeral },
            ).catch(console.error);
            return;
        }

        // Get the arguments
        const args: string[] = [
            interaction.options.getString('userid', true),
            interaction.options.getString('reason', true),
        ];

        // Fetch and ban the user from the guild
        const guild: Guild = interaction.guild!;
        const member = await guild.members.fetch(args[0]).catch(() => null);
        if (member) {
            await guild.bans.create(member.user.id, { reason: `Ban issued by ${interaction.user.username} for ${args[1]}` }).catch(() => null);
        }

        // Create the ban embed
        const banEmbed = createBanEmbed(interaction, args);

        // Reply to the interaction
        await interaction.reply(
            { embeds: [banEmbed] }
        ).catch(console.error);
    }
};