// built-in modules
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

// Relative imports for local modules
import { defaultConfig } from '@up/main/config';
import { readServerConfig } from '@up/main/utils/jsonhelpers/readServerConfig';
import { readGuildCommands } from '@up/main/utils/guilds/readGuildCommands';
import { collectBaseCommands } from '@up/main/utils/commands/collectBaseCommands';

async function refreshCommandsForGuild(guildId: string) {
	const commands = await collectBaseCommands();

	const rest: REST = new REST({ version: '10' }).setToken(defaultConfig.token);

	try {
		const allCommands = await readGuildCommands(guildId, [...commands]);

		const serverConfig = readServerConfig(guildId);
		const disabledCommands = serverConfig?.disabledCommands || [];

		const guildCommands = allCommands.filter((cmd) => !disabledCommands.includes(cmd.name));

		console.log(
			`Started refreshing ${guildCommands.length} application (/) commands for guild: ${guildId}`
		);
		const data = await rest.put(
			Routes.applicationGuildCommands(defaultConfig.applicationId, guildId),
			{
				body: guildCommands
			}
		);
		console.log(
			`Successfully reloaded ${(data as any).length} application (/) commands in guild: ${guildId}`
		);
	} catch (error) {
		console.error(error);
	}
}

export { refreshCommandsForGuild };
