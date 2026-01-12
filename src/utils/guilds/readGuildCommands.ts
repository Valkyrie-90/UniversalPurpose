import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

async function readGuildCommands(
    guildId: string,
    commands: RESTPostAPIApplicationCommandsJSONBody[]
): Promise<RESTPostAPIApplicationCommandsJSONBody[]> {
    const commandsPath = path.resolve(__dirname, '..', '..', 'guilds', guildId, 'commands');
    if (!fs.existsSync(commandsPath)) {
        console.warn(`Commands folder not found at ${commandsPath}`);
        return commands;
    }

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

    if (commandFiles.length === 0) {
        return commands;
    }

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        try {
            const mod = await import(pathToFileURL(filePath).toString());
            const command = (mod && (mod.default ?? mod)) as any;
            if (command && 'data' in command && typeof command.data?.toJSON === 'function') {
                commands.push(command.data.toJSON());
            } else {
                console.warn(
                    `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
            }
        } catch (err) {
            console.error(`Failed loading command ${filePath}:`, err);
        }
    }
    return commands;
}

export { readGuildCommands };