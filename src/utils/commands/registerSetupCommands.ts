import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { pathToFileURL } from 'url';
import { testingConfig as config } from '../../config';

async function registerSetupCommandGlobally() {
    const rest: REST = new REST({ version: '10' }).setToken(config.token);
    
    const setupCommandPath = path.resolve(__dirname, "..", "..", "commands", "setupguild.ts");
    try {
        const mod = await import(pathToFileURL(setupCommandPath).toString());
        const command = (mod && (mod.default ?? mod)) as any;
        if (!command || !('data' in command) || typeof command.data?.toJSON !== 'function') {
            console.warn(
                `[WARNING] The setupguild command at ${setupCommandPath} is missing a required "data" property.`
            );
            return;
        }
        
        console.log(`Registering setupguild command globally.`);
        await rest.put(
            Routes.applicationCommands(config.applicationId),
            { body: [command.data.toJSON()] }
        );
        console.log(`Successfully registered setupguild command globally.`);
    } catch (err) {
        console.error(`Failed loading or registering setupguild command ${setupCommandPath}:`, err);
    }
}

export { registerSetupCommandGlobally };