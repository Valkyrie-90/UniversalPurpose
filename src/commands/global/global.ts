import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { hasBanHammer } from '../../permissions/globalBan';
import { createGlobalBanEmbed, createGlobalPardonEmbed, createNoPermsEmbed } from '../../utils/embeds';
import type { ChatInputCommandInteraction, Client, Guild, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('global')
        .setDescription('Global moderation commands for UP-protected servers.')
        .addSubcommand(subcommand => subcommand
            .setName('ban')
            .setDescription('Ban a user from every UP-protected server.')
            .addMentionableOption(option => option
                .setName('user')
                .setDescription('The user to global ban')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('reason')
                .setDescription('The reason for the global ban')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('pardon')
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
            )
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        // Check if the user has permission to use this command
        const banHammer = await hasBanHammer(interaction);
        if (!banHammer) {
            const noPermsEmbed = createNoPermsEmbed(interaction);
            
            await interaction.reply(
                { embeds: [noPermsEmbed], flags: MessageFlags.Ephemeral },
            ).catch(console.error);
            return;
        }

        const client: Client = interaction.client;
        const subcommand = interaction.options.getSubcommand();
        
        const user = interaction.options.getMentionable('user', true);
        if (!user || !('id' in user)) {
            return;
        }
        
        const args: string[] = [
            user.id,
            interaction.options.getString('reason', true),
        ];

        if (subcommand === 'ban') {
            // Fetch and ban the user from all guilds
            for (const guild of Array.from(client.guilds.cache.values() as Iterable<Guild>)) {
                const member = await guild.members.fetch(args[0]).catch(() => null);
                if (member) {
                    await guild.bans.create(member.user.id, { reason: `Global ban issued by ${interaction.user.username} from ${interaction.guild?.name}.` }).catch(() => null);
                }
            }

            const banEmbed = createGlobalBanEmbed(interaction, args);

            await interaction.reply(
                { embeds: [banEmbed] }
            ).catch(console.error);

            // Fetch the logs channel and send the embed there
            const global_bans_channel = interaction.client.guilds.cache.get("1294354940801585172")?.channels.cache.get("1453462233114874008");
            if (global_bans_channel?.isTextBased()) {
                await global_bans_channel.send({ embeds: [banEmbed] }).catch(console.error);
            }
        } else if (subcommand === 'pardon') {
            for (const guild of Array.from(client.guilds.cache.values() as Iterable<Guild>)) {
                const member = await guild.members.fetch(args[0]).catch(() => null);
                if (member) {
                    await guild.bans.remove(member.user.id, `Global pardon issued by ${interaction.user.username} from ${interaction.guild?.name}.`).catch(() => null);
                }
            }

            const pardonEmbed: EmbedBuilder = createGlobalPardonEmbed(interaction, args);

            await interaction.reply(
                { embeds: [pardonEmbed] }
            ).catch(console.error);
        }
    }
};