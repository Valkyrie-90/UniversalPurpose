import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';

async function collectBaseCommands(): Promise<RESTPostAPIApplicationCommandsJSONBody[]> {
	const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
	const foldersPath = path.resolve(__dirname, '..', '..', 'commands');
	if (!fs.existsSync(foldersPath)) {
		console.warn(`Commands folder not found at ${foldersPath}`);
		return commands;
	}

	const entries = fs.readdirSync(foldersPath);

	for (const entry of entries) {
		const entryPath = path.join(foldersPath, entry);
		const stat = fs.statSync(entryPath);

		if (stat.isDirectory()) {
			const commandFiles = fs
				.readdirSync(entryPath)
				.filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

			for (const file of commandFiles) {
				const filePath = path.join(entryPath, file);
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
		} else if (stat.isFile() && (entry.endsWith('.ts') || entry.endsWith('.js'))) {
			const filePath = entryPath;
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
	}

	return commands;
}

export { collectBaseCommands };