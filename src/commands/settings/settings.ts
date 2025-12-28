import { SlashCommandBuilder } from 'discord.js';
import { ChatInputCommandInteraction } from 'discord.js';


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
            ),
        )
        .addStringOption(option => option
            .setName('value')
            .setDescription('The new value for the setting')
            .setRequired(true)
        ),
    ),
    async execute(interaction: ChatInputCommandInteraction) {
        interaction.options.getString('setting');
    }
};
