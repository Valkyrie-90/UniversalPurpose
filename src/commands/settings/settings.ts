import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { readServerConfig } from '../../utils/jsonhelpers/readServerConfig';
import { isBotMaster } from '../../permissions/botMaster';
import { writeServerConfig } from '../../utils/jsonhelpers/writeServerConfig';

type ServerConfig = {
    logChannelID: string | null;
    commandsChannelID: string | null;
    botMasterRoleID: string | null;
    globalBanRoleID: string | null;
    privateGuild: boolean;
    filteredChannelIDs: string[];
    disabledCommands: string[];
};

export default {
    data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Configure the settings for this guild.")
    .addSubcommand(subcommand => subcommand
        .setName('view')
        .setDescription('View the current settings for this guild.')
        .addStringOption(option => option
            .setName('setting')
            .setDescription('The setting to view')
            .setRequired(false)
            .addChoices(
                { name: 'logChannelID', value: 'logChannelID' }, 
                { name: 'commandsChannelID', value: 'commandsChannelID' },
                { name: 'botMasterRoleID', value: 'botMasterRoleID' },
                { name: 'globalBanRoleID', value: 'globalBanRoleID' },
                { name: 'privateGuild', value: 'privateGuild' },
                { name: 'filteredChannelIDs', value: 'filteredChannelIDs' },
                { name: 'disabledCommands', value: 'disabledCommands' },
                { name: 'all', value: 'all' },
            ),
        ),
    )
    .addSubcommand(subcommand => subcommand
        .setName('set')
        .setDescription('Set a specific setting for this guild.')
        .addStringOption(option => option
            .setName('setting')
            .setDescription('The setting to change')
            .setRequired(true)
            .addChoices(
                { name: 'logChannelID', value: 'logChannelID' }, 
                { name: 'commandsChannelID', value: 'commandsChannelID' },
                { name: 'botMasterRoleID', value: 'botMasterRoleID' },
                { name: 'globalBanRoleID', value: 'globalBanRoleID' },
                { name: 'privateGuild', value: 'privateGuild' },
                { name: 'filteredChannelIDs', value: 'filteredChannelIDs' },
                { name: 'disabledCommands', value: 'disabledCommands' },
            ),
        )
        .addStringOption(option => option
            .setName('value')
            .setDescription('The new value for the setting')
            .setRequired(true)
        ),
    ),
    async execute(interaction: ChatInputCommandInteraction) {
        if (!isBotMaster(interaction, interaction.user.id)) {
            await interaction.reply({
                content: "You do not have permission to use this command.",
                flags: MessageFlags.Ephemeral // Ephemeral flag
            }).catch(console.error);
            return;
        }

        // Read current guild settings
        const guildInfo: ServerConfig = readServerConfig(interaction.guild?.id || '');

        switch (interaction.options.getSubcommand()) {
            case 'view':
                switch (interaction.options.getString('setting')) {
                    case 'logChannelID':
                        await interaction.reply({
                            content: `Log Channel: <#${guildInfo?.logChannelID || 'Not Set'}>`,
                            flags: MessageFlags.Ephemeral // Ephemeral flag
                        }).catch(console.error);
                        break;
                    case 'commandsChannelID':
                        await interaction.reply({
                            content: `Commands Channel: <#${guildInfo?.commandsChannelID || 'Not Set'}>`,
                            flags: MessageFlags.Ephemeral // Ephemeral flag
                        }).catch(console.error);
                        break;
                    case 'botMasterRoleID':
                        await interaction.reply({
                            content: `Bot Master Role ID: <@&${guildInfo?.botMasterRoleID || 'Not Set'}>`,
                            flags: MessageFlags.Ephemeral // Ephemeral flag
                        }).catch(console.error);
                        break;
                    case 'globalBanRoleID':
                        await interaction.reply({
                            content: `Global Ban Role ID: <@&${guildInfo?.globalBanRoleID || 'Not Set'}>`,
                            flags: MessageFlags.Ephemeral // Ephemeral flag
                        }).catch(console.error);
                        break;
                    case 'privateGuild':
                        await interaction.reply({
                            content: `Private Guild: ${guildInfo?.privateGuild ? 'Yes' : 'No'}`,
                            flags: MessageFlags.Ephemeral // Ephemeral flag
                        }).catch(console.error);
                        break;
                    case 'filteredChannelIDs':
                        await interaction.reply({
                            content: `Filtered Channel IDs: ${guildInfo?.filteredChannelIDs.length > 0 ? guildInfo.filteredChannelIDs.join(', ') : 'None'}`,
                            flags: MessageFlags.Ephemeral // Ephemeral flag
                        }).catch(console.error);
                        break;
                    case 'disabledCommands':
                        await interaction.reply({
                            content: `Disabled Commands: ${guildInfo?.disabledCommands.length > 0 ? guildInfo.disabledCommands.join(', ') : 'None'}`,
                            flags: MessageFlags.Ephemeral // Ephemeral flag
                        }).catch(console.error);
                        break;
                    case 'all':
                        await interaction.reply({
                            content: `Settings:\nLog Channel: <#${guildInfo?.logChannelID || 'Not Set'}>\n` +
                                     `Commands Channel: <#${guildInfo?.commandsChannelID || 'Not Set'}>\n` +
                                     `Bot Master Role ID: <@&${guildInfo?.botMasterRoleID || 'Not Set'}>\n` +
                                     `Global Ban Role ID: <@&${guildInfo?.globalBanRoleID || 'Not Set'}>\n` +
                                     `Private Guild: ${guildInfo?.privateGuild ? 'Yes' : 'No'}`,
                            flags: MessageFlags.Ephemeral // Ephemeral flag
                        }).catch(console.error);
                        break;
                    default:
                        await interaction.reply({
                            content: "Invalid setting specified.",
                            flags: MessageFlags.Ephemeral // Ephemeral flag
                        }).catch(console.error);
                        break;
                }
                break;
            case 'set':
                const setting = interaction.options.getString('setting') as keyof ServerConfig;
                const value = interaction.options.getString('value');

                if (!setting || !value) {
                    await interaction.reply({
                        content: "Setting and value are required.",
                        flags: MessageFlags.Ephemeral
                    }).catch(console.error);
                    break;
                }

                switch (setting) {
                    case 'logChannelID':
                    case 'commandsChannelID':
                    case 'botMasterRoleID':
                    case 'globalBanRoleID':
                        if (!/^\d+$/.test(value)) {
                            await interaction.reply({
                                content: "Invalid ID format. Please provide a valid Discord ID.",
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                            break;
                        }
                        guildInfo[setting] = value;
                        if (writeServerConfig(interaction.guild?.id || '', guildInfo)) {
                            console.log(`[SETTINGS] ${setting} updated to ${value} by ${interaction.user.tag} (${interaction.user.id}) in guild ${interaction.guild?.name} (${interaction.guild?.id}).`);
                            await interaction.reply({
                                content: `Updated ${setting} to ${value}`,
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                        } else {
                            await interaction.reply({
                                content: `Failed to update ${setting}.`,
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                        }
                        break;
                    case 'privateGuild':
                        if (!['true', 'false'].includes(value.toLowerCase())) {
                            await interaction.reply({
                                content: "Invalid value. Please use 'true' or 'false'.",
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                            break;
                        }
                        guildInfo.privateGuild = value.toLowerCase() === 'true';
                        if (writeServerConfig(interaction.guild?.id || '', guildInfo)) {
                            await interaction.reply({
                                content: `Updated privateGuild to ${value}`,
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                        } else {
                            await interaction.reply({
                                content: `Failed to update privateGuild.`,
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                        }
                        break;
                    case 'filteredChannelIDs':
                        guildInfo.filteredChannelIDs = value.split(',').map(id => id.trim());
                        if (writeServerConfig(interaction.guild?.id || '', guildInfo)) {
                            await interaction.reply({
                                content: `Updated filteredChannelIDs to [${guildInfo.filteredChannelIDs.join(', ')}]`,
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                        } else {
                            await interaction.reply({
                                content: `Failed to update filteredChannelIDs.`,
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                        }
                        break;
                    case 'disabledCommands':
                        const commands = value.split(',').map(id => id.trim());
                        commands.forEach(command => {
                            if (guildInfo.disabledCommands.includes(command.trim())) {
                                guildInfo.disabledCommands = guildInfo.disabledCommands.filter(cmd => cmd !== command.trim());
                            } else {
                                guildInfo.disabledCommands.push(command.trim());
                            }
                        });
                        if (writeServerConfig(interaction.guild?.id || '', guildInfo)) {
                            await interaction.reply({
                                content: `Updated disabledCommands to [${guildInfo.disabledCommands.join(', ')}]`,
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                        } else {
                            await interaction.reply({
                                content: `Failed to update disabledCommands.`,
                                flags: MessageFlags.Ephemeral
                            }).catch(console.error);
                        }
                        break;
                    default:
                        await interaction.reply({
                            content: "Invalid setting specified.",
                            flags: MessageFlags.Ephemeral
                        }).catch(console.error);
                        break;
                }
            default:
                break;
        }
    }
};
