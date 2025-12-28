import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, Colors, MessageFlags } from 'discord.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { createNoPermsEmbed } from '../utils/embeds';
import * as fs from 'fs';
import path from 'path';


export default {
    data: new SlashCommandBuilder()
        .setName("setupguild")
        .setDescription("Allows you to set up the current guild with specific settings & configurations.")
        .addStringOption(option => option
            .setName("Filtered Channels")
            .setDescription("Enter a comma delimited list of channel IDs to be filtered for flagged terms, type 'none' to disable.")
            .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const perms = interaction.memberPermissions;
        if (!perms || !perms.has(PermissionFlagsBits.ManageGuild)) {
            await interaction.reply(
                { 
                    embeds: 
                        [ 
                            createNoPermsEmbed(interaction)
                                .addFields({
                                    name: "Required Permission",
                                    value: "`Manage Guild`",
                                    inline: false,
                                })
                        ], 
                    flags: MessageFlags.Ephemeral 
                }
            ).catch(console.error);
            return;
        }
        
        // Define the guilds path
        const guildsPath = path.resolve(__dirname, `../guilds/`);

        // Check if guild is already set up
        try {
            fs.accessSync(`${guildsPath}/${interaction.guild?.id}/`, fs.constants.R_OK | fs.constants.W_OK);
            await interaction.reply(
                { content: "This guild is already set up for use with UniversalPurpose!", flags: MessageFlags.Ephemeral }
            ).catch(console.error);
            return;
        } catch (err) {}

        // Create guild directorys and subdirectories
        fs.mkdirSync(`${guildsPath}/${interaction.guild?.id}/`);
        fs.mkdirSync(`${guildsPath}/${interaction.guild?.id}/commands`);
        fs.mkdirSync(`${guildsPath}/${interaction.guild?.id}/settings`);

        // Get the guild
        const guild = interaction.guild;

        // Ensure the command is used in a guild
        if (!guild) {
            await interaction.reply(
                "This command can only be used in a guild!"
            ).catch(console.error);
            return;
        }

        // Create the 'universalpurpose' category
        const upCategory = await guild.channels.create({
            name: 'universalpurpose',
            type: ChannelType.GuildCategory,
            reason: 'Creating required channels for UP Bot'
        }).catch((err) => console.error(err));

        // Get the number of channels in the guild
        const channelsLen = guild.channels.cache.size;

        // Set the category position to the bottom
        upCategory?.setPosition(channelsLen+1).catch((err) => console.error(err));

        // Set permissions so only users with "ManageGuild" can view the category
        upCategory?.permissionOverwrites.set([
            {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: guild.roles.cache.find(role => role.permissions.has(PermissionFlagsBits.ManageGuild))?.id || '',
                allow: [PermissionFlagsBits.ViewChannel],
            }
        ].filter(perm => perm.id)).catch((err) => console.error(err));

        // Create the log channel
        const logChannel = await guild.channels.create({
            name: 'up-logs',
            type: ChannelType.GuildText,
            parent: upCategory?.id || undefined,
            reason: 'Creating log channel for UP Bot'
        }).catch((err) => console.error(err));

        // Create bot commands channel
        const commandsChannel = await guild.channels.create({
            name: 'up-commands',
            type: ChannelType.GuildText,
            parent: upCategory?.id || undefined,
            reason: 'Creating commands channel for UP Bot'
        }).catch((err) => console.error(err));

        // Set permissions for log channel
        logChannel?.permissionOverwrites.set([
            {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: guild.roles.cache.find(role => role.permissions.has(PermissionFlagsBits.ManageGuild))?.id || '',
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            }
        ].filter(perm => perm.id)).catch((err) => console.error(err));

        // Set permissions for commands channel
        commandsChannel?.permissionOverwrites.set([
            {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },
            {
                id: guild.roles.cache.find(role => role.permissions.has(PermissionFlagsBits.ManageGuild))?.id || '',
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            }
        ].filter(perm => perm.id)).catch((err) => console.error(err));

        // Create the Bot Master role
        const botMasterRole = await guild.roles.create({
            name: 'UP | Bot Master',
            colors: {
                primaryColor: Colors.Grey,
            },
            reason: 'Creating Bot Master Role for UP Bot',
            permissions: undefined,
        }).catch((err) => console.error(err));

        // Create the global ban permission role
        const banHammerRole = await guild.roles.create({
            name: 'UP | Ban Hammer',
            colors: {
                primaryColor: Colors.Red,
            },
            reason: 'Creating Ban Hammer Role for UP Bot',
            permissions: PermissionFlagsBits.BanMembers,
        }).catch((err) => console.error(err));

        // Fetch & Assign the roles to the command invoker
        if (botMasterRole && banHammerRole) {
            const member = await guild.members.fetch(interaction.user.id).catch(() => null);
            if (member) {
                member.roles.add(botMasterRole).catch((err) => console.error(err));
                member.roles.add(banHammerRole).catch((err) => console.error(err));
            }
        }

        // Get filtered channels from the command options
        const filteredChannelsOption = interaction.options.getString("Filtered Channels", true);
        let filteredChannelIDs: string[] = [];
        if (filteredChannelsOption.toLowerCase() !== "none") {
            filteredChannelIDs = filteredChannelsOption.split(",").map(id => id.trim());
        }

        // Create the config file
        fs.writeFileSync(`${guildsPath}/${interaction.guild?.id}/settings/config.json`, JSON.stringify({
            logChannelID: logChannel?.id || null,
            commandsChannelID: commandsChannel?.id || null,
            botMasterRoleID: botMasterRole?.id || null,
            globalBanRoleID: banHammerRole?.id || null,
            privateGuild: true, // If servers are included in the global server list
            filteredChannelIDs: [], // Channels that are filtered for flagged terms
        }, null, 4), { encoding: "utf8", flag: "w" } as fs.WriteFileOptions);

        // Reply to the interaction
        await interaction.reply(
            "Successfully set up this guild for use with UniversalPurpose!"
        ).catch(console.error);

        console.log(`[SETUP] Guild ${interaction.guild?.name} (${interaction.guild?.id}) has been set up by ${interaction.user.tag} (${interaction.user.id}).`);
    }
};
