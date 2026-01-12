// Type imports
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

// Local imports
import { readServerConfig } from '../jsonhelpers/readServerConfig';

/**
* Filters out disabled commands for a specific guild
*/
function filterDisabledCommands(
	commands: RESTPostAPIApplicationCommandsJSONBody[],
	guildId: string
): RESTPostAPIApplicationCommandsJSONBody[] {
	const serverConfig = readServerConfig(guildId);
	const disabledCommands = serverConfig?.disabledCommands || [];
	return commands.filter(cmd => !disabledCommands.includes(cmd.name));
}

export { filterDisabledCommands };