import { Client, Collection } from 'discord.js';
import { Command } from '../bot';
import * as fs from 'fs';
import * as path from 'path';


export async function loadCommands(client: Client): Promise<void> {
    const commandsFolder = path.resolve(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsFolder).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
    
    // Ensure the client has a commands collection
    if (!client.commands) {
        client.commands = new Collection<string, Command>();
    }

    // Loop through all the command files and load them
    for (const file of commandFiles) {
        try {
            const commandModule = require(path.join(commandsFolder, file)) as { default?: Command } | Command;
            const command: Command = (commandModule as any).default ?? (commandModule as any);
            
            // Check if the command has a name
            if (command) {
                // Add the command to the client's commands collection
                client.commands.set(command.data.name, command);
                console.log(`Loaded command: ${command.data.name}`);
            } else {
                console.warn(`The command in ${file} is missing a name property.`);
            }
        } catch (err) {
            console.error(`Failed to load command file ${file}:`, err);
        }
    }
}
