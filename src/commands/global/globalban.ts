import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { hasBanHammer } from '../../permissions/globalBan';
import { createGlobalBanEmbed } from '../../utils/embeds';
import type { ChatInputCommandInteraction, Client, Guild } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('globalban')
        .setDescription('Ban a user from every UP-protected server.')
        .addStringOption(option => option
            .setName('userid')
            .setDescription('The ID of the user to global ban')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('The reason for the global ban')
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

        // Fetch and ban the user from all guilds
        for (const guild of Array.from(client.guilds.cache.values() as Iterable<Guild>)) {
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

        // Fetch the logs channel and send the embed there
        let global_bans_channel = interaction.client.guilds.cache.get("1294354940801585172")?.channels.cache.get("1453462233114874008")
        if (global_bans_channel?.isTextBased()) {
            await global_bans_channel.send({ embeds: [banEmbed] }).catch(console.error);
        }
    }
};