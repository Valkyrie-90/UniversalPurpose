import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { createPardonEmbed } from '../utils/embeds';
import type { ChatInputCommandInteraction, Client, Guild } from 'discord.js';

export default {
    data: new SlashCommandBuilder().setName('pardon').setDescription('Pardon a user from this guild.')
        .addStringOption(option => option.setName('userid').setDescription('The ID of the user to pardon').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the pardon').setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
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

        // Fetch and pardon the user from the guild
        const guild: Guild = interaction.guild!;
        const member = await guild.members.fetch(args[0]).catch(() => null);
        if (member) {
            await guild.bans.remove(member.user.id).catch(() => null);
        }

        // Create the pardon embed
        const pardonEmbed = createPardonEmbed(interaction, args);

        // Reply to the interaction
        await interaction.reply(
            { embeds: [pardonEmbed] }
        ).catch(console.error);
    }
};