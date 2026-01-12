// built-in modules
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

// Relative imports for local modules
import { testingConfig as config } from '../../config';
import { readServerConfig } from '../jsonhelpers/readServerConfig';
import { readGuildCommands } from '../guilds/readGuildCommands';
import { collectBaseCommands } from './collectBaseCommands';

// Type imports
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

async function refreshCommandsForGuild(guildId: string) {
	const commands = await collectBaseCommands();

	const rest: REST = new REST({ version: '10' }).setToken(config.token);

	try {
		const allCommands = await readGuildCommands(guildId, [...commands]);

		const serverConfig = readServerConfig(guildId);
		const disabledCommands = serverConfig?.disabledCommands || [];

		const guildCommands = allCommands.filter((cmd) => !disabledCommands.includes(cmd.name));

		console.log(
			`Started refreshing ${guildCommands.length} application (/) commands for guild: ${guildId}`
		);
		const data = await rest.put(
			Routes.applicationGuildCommands(config.applicationId, guildId),
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
