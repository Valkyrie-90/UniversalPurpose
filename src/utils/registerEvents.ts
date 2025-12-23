import { Client } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

interface Event {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => void | Promise<void>;
}

export function registerEvents(client: Client): void {
    const eventsFolder = path.resolve(__dirname, '..', 'events');
    if (!fs.existsSync(eventsFolder)) {
        console.warn(`Events folder not found: ${eventsFolder}`);
        return;
    }

    const eventFiles = fs
        .readdirSync(eventsFolder)
        .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsFolder, file);
        const imported = require(filePath);
        // Support both `module.exports = { ... }` and `export default { ... }` and direct function exports
        let event: Event = (imported && imported.default) ? imported.default : imported;

        if (typeof event === 'function') {
            // If the file exports a function directly, treat filename as the event name
            event = {
                name: path.parse(file).name,
                execute: event as any,
            };
        }

        if (!event || typeof event.execute !== 'function') {
            console.warn(`Skipping ${file}: missing an execute function.`);
            continue;
        }

        if (!event.name) event.name = path.parse(file).name;

        const handler = (...args: any[]) => {
            try {
                const res = event.execute(...args);
                if (res && typeof (res as Promise<any>).catch === 'function') {
                    (res as Promise<any>).catch((err) => console.error(`Error in event '${event.name}':`, err));
                }
            } catch (err) {
                console.error(`Error executing event '${event.name}':`, err);
            }
        };

        if (event.once) {
            client.once(event.name, handler);
        } else {
            client.on(event.name, handler);
        }

        console.log(`Registered event: ${event.name}`);
    }
}