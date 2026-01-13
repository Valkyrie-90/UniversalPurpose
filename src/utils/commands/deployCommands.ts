// External imports
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

// Type imports
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

// Local imports
import { config } from '../../config';

import {
    registerSetupCommandGlobally,
    collectBaseCommands,
    filterDisabledCommands
} from './index';

import {
    readGuildIds,
    readGuildCommands
} from "../../utils/guilds";

/**
* Deploys commands to a single guild
*/
async function deployToGuild(
	rest: REST,
	guildId: string,
	baseCommands: RESTPostAPIApplicationCommandsJSONBody[]
): Promise<void> {
	const allCommands = await readGuildCommands(guildId, baseCommands);
	const enabledCommands = filterDisabledCommands(allCommands, guildId);
	
	const data = await rest.put(
		Routes.applicationGuildCommands(config.applicationId, guildId),
		{ body: enabledCommands }
	);

	console.log(`Successfully reloaded ${(data as any).length} application (/) commands in guild: ${guildId}`);
}

/**
* Main function to deploy commands to all registered guilds
*/
async function deployCommands(): Promise<void> {
	await registerSetupCommandGlobally();
	
	const baseCommands = await collectBaseCommands();
	const guildIds = readGuildIds();
	
	if (guildIds.length === 0) {
		console.warn("No guild IDs found to deploy commands to.");
		return;
	}

	const rest = new REST({ version: '10' }).setToken(config.token);

	for (const guildId of guildIds) {
		try {
			await deployToGuild(rest, guildId, baseCommands);
		} catch (error) {
			console.error(`Failed to deploy commands to guild ${guildId}:`, error);
		}
	}
}

export { deployCommands };
