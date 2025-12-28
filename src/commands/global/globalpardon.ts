import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { hasBanHammer } from '../../permissions/globalBan';
import { createGlobalPardonEmbed } from '../../utils/embeds';
import type { ChatInputCommandInteraction, Client, EmbedBuilder, Guild } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('globalpardon')
        .setDescription('Pardon a user from every UP-protected server.')
        .addStringOption(option => option
            .setName('userid')
            .setDescription('The ID of the user to global pardon')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for the global pardon')
            .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        // Check if the user has permission to use this command
        const banHammer = await hasBanHammer(interaction);
        if (!banHammer) {
            // Create the no permission embed
            const noPermsEmbed = await import('../../utils/embeds').then(module => module.createNoPermsEmbed(interaction));
            
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

        for (const guild of Array.from(client.guilds.cache.values() as Iterable<Guild>)) {
            const member = await guild.members.fetch(args[0]).catch(() => null);
            if (member) {
                await guild.bans.remove(member.user.id, `Global pardon issued by ${interaction.user.username} from ${interaction.guild?.name}.`).catch(() => null);
            }
        }

        // Create the global pardon embed
        const pardonEmbed: EmbedBuilder = createGlobalPardonEmbed(interaction, args);

        // Reply to the interaction
        await interaction.reply(
            { embeds: [pardonEmbed] }
        ).catch(console.error);
    }
};