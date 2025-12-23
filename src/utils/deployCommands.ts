// deployCommands.ts
// Note: ensure tsconfig has "esModuleInterop": true and "resolveJsonModule": true

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'url';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { TESTING_BOT_TOKEN, TESTING_CLIENT_ID, TESTING_APPLICATION_ID } from '../config';

const config = {
    token: TESTING_BOT_TOKEN,
    clientId: TESTING_CLIENT_ID,
    applicationId: TESTING_APPLICATION_ID
};

async function main() {
    const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];

    const foldersPath = path.resolve(__dirname, "..", "commands");
    if (!fs.existsSync(foldersPath)) {
        console.warn(`Commands folder not found at ${foldersPath}`);
        return;
    }

    // Read entries directly in the commands folder; support both flat files (commands/*.ts)
    // and grouped commands in subfolders (commands/<group>/*.ts)
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

    const rest: REST = new REST({ version: '10' }).setToken(config.token);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        const data = await rest.put(Routes.applicationCommands(config.applicationId), {
            body: commands
        });
        console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}

export { main };